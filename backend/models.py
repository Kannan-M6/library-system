"""
models.py - SQLAlchemy Database Models
Tables: users, books, transactions
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """
    Users table — stores both librarians and students/staff
    role: 'librarian' | 'student' | 'staff'
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")  # librarian | student | staff
    student_id = db.Column(db.String(50), unique=True, nullable=True)   # student/staff ID card number
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: one user → many transactions
    transactions = db.relationship("Transaction", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "student_id": self.student_id,
            "created_at": self.created_at.isoformat(),
        }


class Book(db.Model):
    """
    Books table — library catalog
    """
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(120), nullable=False)
    isbn = db.Column(db.String(20), unique=True, nullable=True)          # barcode/ISBN
    genre = db.Column(db.String(80), nullable=True)
    description = db.Column(db.Text, nullable=True)
    total_count = db.Column(db.Integer, default=1)
    available_count = db.Column(db.Integer, default=1)
    published_year = db.Column(db.Integer, nullable=True)
    cover_image = db.Column(db.String(512), nullable=True)               # URL or path
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: one book → many transactions
    transactions = db.relationship("Transaction", backref="book", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn,
            "genre": self.genre,
            "description": self.description,
            "total_count": self.total_count,
            "available_count": self.available_count,
            "published_year": self.published_year,
            "cover_image": self.cover_image,
            "created_at": self.created_at.isoformat(),
        }


class Transaction(db.Model):
    """
    Transactions table — borrowing and returning records
    status: 'borrowed' | 'returned' | 'overdue'
    """
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)                    # expected return date (14 days)
    return_date = db.Column(db.DateTime, nullable=True)                 # actual return date
    status = db.Column(db.String(20), default="borrowed")              # borrowed | returned | overdue
    fine_amount = db.Column(db.Float, default=0.0)                     # ₹2 per overdue day
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "return_date": self.return_date.isoformat() if self.return_date else None,
            "status": self.status,
            "fine_amount": self.fine_amount,
            # Joined data (when using with relationships)
            "user_name": self.user.name if self.user else None,
            "book_title": self.book.title if self.book else None,
            "book_author": self.book.author if self.book else None,
        }
