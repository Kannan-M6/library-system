"""
routes/chatbot_routes.py
POST /api/chat                  - Chat with library bot
GET  /api/recommendations/<uid> - Get book recommendations for user
GET  /api/demand/<book_id>      - Demand forecast for a book
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models import db, Book, Transaction, User
from chatbot.chatbot import LibraryChatbot
from ml_model.recommender import BookRecommender, DemandPredictor

chatbot_bp = Blueprint("chatbot", __name__)

# Singletons
_chatbot = None
_recommender = BookRecommender()
_demand = DemandPredictor()


def get_chatbot():
    global _chatbot
    if _chatbot is None:
        _chatbot = LibraryChatbot(db=db, Book=Book, Transaction=Transaction)
    return _chatbot


def _build_recommender():
    """Rebuild the recommender with fresh data from DB."""
    books = [b.to_dict() for b in Book.query.all()]
    txns = [
        {"user_id": t.user_id, "book_id": t.book_id}
        for t in Transaction.query.all()
    ]
    _recommender.fit_content(books)
    _recommender.fit_collaborative(txns)


# ------------------------------------------------------------------ #
@chatbot_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    """Chat endpoint — accepts user message and returns bot response."""
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400

    bot = get_chatbot()
    response = bot.respond(message)
    return jsonify({"response": response}), 200


@chatbot_bp.route("/recommendations/<int:user_id>", methods=["GET"])
@jwt_required()
def recommendations(user_id):
    """
    Return book recommendations for a user.
    Uses collaborative + content-based hybrid.
    """
    claims = get_jwt()
    current_uid = int(get_jwt_identity())
    # Students can only get their own recommendations
    if claims.get("role") != "librarian" and current_uid != user_id:
        return jsonify({"error": "Access denied"}), 403

    _build_recommender()

    # Get user's borrow history
    history = Transaction.query.filter_by(user_id=user_id).all()
    borrowed_ids = [t.book_id for t in history]

    # Collaborative recommendations
    collab_ids = _recommender.collaborative_recommend(user_id, top_n=5)

    # Content-based from last borrowed book
    content_ids = []
    if borrowed_ids:
        content_ids = _recommender.content_recommend(borrowed_ids[-1], top_n=5)

    # Merge & deduplicate, prefer collaborative
    seen = set(borrowed_ids)
    merged = []
    for bid in (collab_ids + content_ids):
        if bid not in seen:
            seen.add(bid)
            merged.append(bid)
        if len(merged) >= 6:
            break

    # If no ML result, return top available books by genre
    if not merged:
        books = (
            Book.query
            .filter(Book.available_count > 0)
            .order_by(Book.available_count.desc())
            .limit(6)
            .all()
        )
    else:
        books = Book.query.filter(Book.id.in_(merged)).all()

    return jsonify({
        "recommendations": [b.to_dict() for b in books],
        "based_on": "borrowing history" if borrowed_ids else "popular books",
    }), 200


@chatbot_bp.route("/demand/<int:book_id>", methods=["GET"])
@jwt_required()
def demand_forecast(book_id):
    """Demand forecast for a specific book."""
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    book = Book.query.get_or_404(book_id)

    # Aggregate monthly borrows
    from sqlalchemy import func, extract
    monthly = (
        db.session.query(
            extract("year", Transaction.issue_date).label("yr"),
            extract("month", Transaction.issue_date).label("mo"),
            func.count(Transaction.id).label("cnt"),
        )
        .filter(Transaction.book_id == book_id)
        .group_by("yr", "mo")
        .order_by("yr", "mo")
        .all()
    )

    counts = [int(r.cnt) for r in monthly]
    prediction = _demand.predict_demand(counts)

    return jsonify({
        "book": book.to_dict(),
        "monthly_counts": counts,
        "forecast": prediction,
    }), 200
