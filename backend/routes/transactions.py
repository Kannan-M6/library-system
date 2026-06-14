"""
routes/transactions.py - Borrowing & Returning Routes
POST /api/transactions/borrow          - Borrow a book
POST /api/transactions/return/<id>     - Return a book
GET  /api/transactions                 - All transactions [Librarian]
GET  /api/transactions/my              - Current user's transactions [Student]
GET  /api/transactions/overdue         - List overdue [Librarian]
"""
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from models import db, Transaction, Book, User

transactions_bp = Blueprint("transactions", __name__)

LOAN_DAYS = 14          # Books due in 14 days
FINE_PER_DAY = 2.0      # ₹2 per overdue day


def _update_overdue():
    """Mark all overdue transactions (run on any read)."""
    now = datetime.utcnow()
    overdue = Transaction.query.filter(
        Transaction.status == "borrowed",
        Transaction.due_date < now,
    ).all()
    for t in overdue:
        t.status = "overdue"
        days = (now - t.due_date).days
        t.fine_amount = days * FINE_PER_DAY
    if overdue:
        db.session.commit()


@transactions_bp.route("/borrow", methods=["POST"])
@jwt_required()
def borrow_book():
    """
    Borrow a book.
    Body: { book_id }   — user_id comes from JWT
    Librarians can also specify user_id to borrow on behalf of a student.
    """
    claims = get_jwt()
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    book_id = data.get("book_id")
    if not book_id:
        return jsonify({"error": "book_id is required"}), 400

    # Librarians can borrow on behalf of a student
    if claims.get("role") == "librarian":
        user_id = data.get("user_id", current_user_id)
    else:
        user_id = current_user_id

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    if book.available_count <= 0:
        return jsonify({"error": "No copies available"}), 400

    # Check if user already borrowed this book
    existing = Transaction.query.filter_by(
        user_id=user_id, book_id=book_id, status="borrowed"
    ).first()
    if existing:
        return jsonify({"error": "User already has this book borrowed"}), 400

    # Check overdue books — block new borrows if overdue
    overdue = Transaction.query.filter_by(user_id=user_id, status="overdue").count()
    if overdue > 0 and claims.get("role") != "librarian":
        return jsonify({"error": "Please return overdue books before borrowing new ones"}), 400

    now = datetime.utcnow()
    txn = Transaction(
        user_id=user_id,
        book_id=book_id,
        issue_date=now,
        due_date=now + timedelta(days=LOAN_DAYS),
        status="borrowed",
    )
    book.available_count -= 1
    db.session.add(txn)
    db.session.commit()

    return jsonify({
        "message": "Book borrowed successfully",
        "transaction": txn.to_dict(),
    }), 201


@transactions_bp.route("/return/<int:txn_id>", methods=["POST"])
@jwt_required()
def return_book(txn_id):
    """Return a borrowed book. Fine is calculated automatically."""
    claims = get_jwt()
    current_user_id = int(get_jwt_identity())

    _update_overdue()
    txn = Transaction.query.get_or_404(txn_id)

    # Students can only return their own books
    if claims.get("role") != "librarian" and txn.user_id != current_user_id:
        return jsonify({"error": "Cannot return another user's book"}), 403

    if txn.status == "returned":
        return jsonify({"error": "Book already returned"}), 400

    now = datetime.utcnow()
    txn.return_date = now
    txn.status = "returned"

    # Calculate fine
    if now > txn.due_date:
        days_overdue = (now - txn.due_date).days
        txn.fine_amount = days_overdue * FINE_PER_DAY
    else:
        txn.fine_amount = 0.0

    # Restore book availability
    book = Book.query.get(txn.book_id)
    if book:
        book.available_count = min(book.total_count, book.available_count + 1)

    db.session.commit()
    return jsonify({
        "message": "Book returned successfully",
        "fine_amount": txn.fine_amount,
        "transaction": txn.to_dict(),
    }), 200


@transactions_bp.route("", methods=["GET"])
@jwt_required()
def all_transactions():
    """All transactions — librarian only."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    _update_overdue()
    status = request.args.get("status")
    query = Transaction.query

    if status:
        query = query.filter_by(status=status)

    txns = query.order_by(Transaction.issue_date.desc()).all()
    return jsonify({"transactions": [t.to_dict() for t in txns]}), 200


@transactions_bp.route("/my", methods=["GET"])
@jwt_required()
def my_transactions():
    """Current student's transaction history."""
    user_id = int(get_jwt_identity())
    _update_overdue()
    txns = (
        Transaction.query
        .filter_by(user_id=user_id)
        .order_by(Transaction.issue_date.desc())
        .all()
    )
    return jsonify({"transactions": [t.to_dict() for t in txns]}), 200


@transactions_bp.route("/overdue", methods=["GET"])
@jwt_required()
def overdue_list():
    """Overdue transactions — librarian only."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    _update_overdue()
    txns = Transaction.query.filter_by(status="overdue").all()
    return jsonify({"overdue": [t.to_dict() for t in txns]}), 200


@transactions_bp.route("/borrow-manual", methods=["POST"])
@jwt_required()
def borrow_manual():
    """
    Manual book borrowing when scanner fails (Librarian only).
    Body: { user_id, book_id, issue_date (optional) }
    """
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    data = request.get_json() or {}
    user_id = data.get("user_id")
    book_id = data.get("book_id")
    issue_date_str = data.get("issue_date")  # Optional: ISO format

    # Validation
    if not user_id or not book_id:
        return jsonify({"error": "user_id and book_id are required"}), 400

    # Get user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": f"User not found: {user_id}"}), 404

    # Get book
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": f"Book not found: {book_id}"}), 404

    # Check availability
    if book.available_count <= 0:
        return jsonify({"error": f"No copies available: {book.title}"}), 400

    # Check if user already borrowed this book
    existing = Transaction.query.filter_by(
        user_id=user_id, book_id=book_id, status="borrowed"
    ).first()
    if existing:
        return jsonify({"error": f"User already has {book.title} borrowed"}), 400

    # Parse issue date (default to now)
    try:
        if issue_date_str:
            from dateutil import parser
            issue_date = parser.isoparse(issue_date_str)
        else:
            issue_date = datetime.utcnow()
    except Exception:
        issue_date = datetime.utcnow()

    due_date = issue_date + timedelta(days=LOAN_DAYS)

    # Create transaction
    txn = Transaction(
        user_id=user_id,
        book_id=book_id,
        issue_date=issue_date,
        due_date=due_date,
        status="borrowed",
    )
    book.available_count -= 1
    db.session.add(txn)
    db.session.commit()

    return jsonify({
        "message": f"✅ Book '{book.title}' manually borrowed by {user.name}",
        "transaction": txn.to_dict(),
        "user": user.to_dict(),
        "book": book.to_dict(),
    }), 201


@transactions_bp.route("/get-all-students", methods=["GET"])
@jwt_required()
def get_all_students():
    """Get list of all students/staff for manual entry dropdown."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    students = User.query.filter(User.role.in_(["student", "staff"])).all()
    return jsonify({
        "students": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "student_id": u.student_id,
                "role": u.role
            }
            for u in students
        ]
    }), 200


@transactions_bp.route("/get-all-books", methods=["GET"])
@jwt_required()
def get_all_books():
    """Get list of all books for manual entry dropdown."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    books = Book.query.all()
    return jsonify({
        "books": [
            {
                "id": b.id,
                "title": b.title,
                "author": b.author,
                "isbn": b.isbn,
                "available_count": b.available_count,
                "total_count": b.total_count
            }
            for b in books
        ]
    }), 200
