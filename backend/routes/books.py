"""
routes/books.py - Book Management Routes (Librarian only for CUD)
GET    /api/books         - List all books (with search/filter)
GET    /api/books/<id>    - Get single book
POST   /api/books         - Add book  [Librarian]
PUT    /api/books/<id>    - Edit book [Librarian]
DELETE /api/books/<id>    - Delete book [Librarian]
GET    /api/books/stats   - Dashboard stats [Librarian]
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models import db, Book, Transaction

books_bp = Blueprint("books", __name__)


def librarian_required():
    """Helper: returns error response if current user is not librarian."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403
    return None


@books_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    """Dashboard statistics for the librarian."""
    err = librarian_required()
    if err:
        return err

    total_books = db.session.query(db.func.sum(Book.total_count)).scalar() or 0
    available_books = db.session.query(db.func.sum(Book.available_count)).scalar() or 0
    borrowed_books = total_books - available_books
    overdue_count = Transaction.query.filter_by(status="overdue").count()
    total_users = db.session.execute(
        db.text("SELECT COUNT(*) FROM users WHERE role != 'librarian'")
    ).scalar()

    return jsonify({
        "total_books": int(total_books),
        "available_books": int(available_books),
        "borrowed_books": int(borrowed_books),
        "overdue_count": overdue_count,
        "total_users": total_users,
    }), 200


@books_bp.route("", methods=["GET"])
@jwt_required()
def list_books():
    """
    List books with optional search query.
    ?search=title_or_author&genre=Science&page=1&per_page=20
    """
    search = request.args.get("search", "").strip()
    genre = request.args.get("genre", "").strip()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Book.query

    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Book.title.ilike(like),
                Book.author.ilike(like),
                Book.isbn.ilike(like),
            )
        )
    if genre:
        query = query.filter(Book.genre.ilike(f"%{genre}%"))

    pagination = query.order_by(Book.title).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "books": [b.to_dict() for b in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page,
    }), 200


@books_bp.route("/<int:book_id>", methods=["GET"])
@jwt_required()
def get_book(book_id):
    """Get a single book by ID."""
    book = Book.query.get_or_404(book_id)
    return jsonify({"book": book.to_dict()}), 200


@books_bp.route("", methods=["POST"])
@jwt_required()
def add_book():
    """Add a new book to the catalog. Librarian only."""
    err = librarian_required()
    if err:
        return err

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    title = data.get("title", "").strip()
    author = data.get("author", "").strip()
    if not title or not author:
        return jsonify({"error": "Title and author are required"}), 400

    isbn = data.get("isbn", "").strip() or None
    if isbn and Book.query.filter_by(isbn=isbn).first():
        return jsonify({"error": "ISBN already exists"}), 409

    total = int(data.get("total_count", 1))
    book = Book(
        title=title,
        author=author,
        isbn=isbn,
        genre=data.get("genre", ""),
        description=data.get("description", ""),
        total_count=total,
        available_count=total,
        published_year=data.get("published_year"),
        cover_image=data.get("cover_image", ""),
    )
    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Book added successfully", "book": book.to_dict()}), 201


@books_bp.route("/<int:book_id>", methods=["PUT"])
@jwt_required()
def update_book(book_id):
    """Update book details. Librarian only."""
    err = librarian_required()
    if err:
        return err

    book = Book.query.get_or_404(book_id)
    data = request.get_json()

    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.genre = data.get("genre", book.genre)
    book.description = data.get("description", book.description)
    book.published_year = data.get("published_year", book.published_year)
    book.cover_image = data.get("cover_image", book.cover_image)

    # Handle count changes carefully
    if "total_count" in data:
        diff = int(data["total_count"]) - book.total_count
        book.total_count = int(data["total_count"])
        book.available_count = max(0, book.available_count + diff)

    db.session.commit()
    return jsonify({"message": "Book updated", "book": book.to_dict()}), 200


@books_bp.route("/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    """Delete a book. Librarian only. Cannot delete if copies are borrowed."""
    err = librarian_required()
    if err:
        return err

    book = Book.query.get_or_404(book_id)

    active = Transaction.query.filter_by(book_id=book_id, status="borrowed").count()
    if active > 0:
        return jsonify({"error": f"Cannot delete: {active} copy/copies are currently borrowed"}), 400

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200
