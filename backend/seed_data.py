"""
seed_data.py - Populate database with sample data
Run: python seed_data.py
"""
from datetime import datetime, timedelta
import random
from app import create_app
from models import db, User, Book, Transaction

app = create_app()

BOOKS = [
    {"title": "The Pragmatic Programmer", "author": "David Thomas", "isbn": "978-0-13-595705-9", "genre": "Technology", "published_year": 2019, "total_count": 3, "description": "A classic guide to software craftsmanship and developer best practices."},
    {"title": "Clean Code", "author": "Robert C. Martin", "isbn": "978-0-13-235088-4", "genre": "Technology", "published_year": 2008, "total_count": 4, "description": "Handbook of agile software craftsmanship."},
    {"title": "Python Crash Course", "author": "Eric Matthes", "isbn": "978-1-71-850156-1", "genre": "Technology", "published_year": 2023, "total_count": 5, "description": "A hands-on introduction to programming with Python."},
    {"title": "Introduction to Algorithms", "author": "Cormen et al.", "isbn": "978-0-26-204630-5", "genre": "Computer Science", "published_year": 2022, "total_count": 3, "description": "The definitive reference for algorithms and data structures."},
    {"title": "Design Patterns", "author": "Gang of Four", "isbn": "978-0-20-163361-5", "genre": "Technology", "published_year": 1994, "total_count": 2, "description": "Elements of reusable object-oriented software."},
    {"title": "Sapiens: A Brief History", "author": "Yuval Noah Harari", "isbn": "978-0-06-231609-7", "genre": "History", "published_year": 2015, "total_count": 4, "description": "A brief history of humankind from ancient times to the present."},
    {"title": "Atomic Habits", "author": "James Clear", "isbn": "978-0-73-520458-9", "genre": "Self-Help", "published_year": 2018, "total_count": 5, "description": "An easy and proven way to build good habits and break bad ones."},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "isbn": "978-0-74-324356-5", "genre": "Fiction", "published_year": 1925, "total_count": 3, "description": "A classic novel of the Jazz Age and the American Dream."},
    {"title": "1984", "author": "George Orwell", "isbn": "978-0-45-152493-5", "genre": "Dystopian", "published_year": 1949, "total_count": 4, "description": "A dystopian novel about totalitarianism and surveillance."},
    {"title": "Deep Learning", "author": "Ian Goodfellow", "isbn": "978-0-26-203561-3", "genre": "AI/ML", "published_year": 2016, "total_count": 2, "description": "The definitive textbook on deep learning."},
    {"title": "Hands-On Machine Learning", "author": "Aurélien Géron", "isbn": "978-1-09-812597-4", "genre": "AI/ML", "published_year": 2022, "total_count": 3, "description": "Practical ML with Scikit-Learn, Keras, and TensorFlow."},
    {"title": "Database System Concepts", "author": "Silberschatz et al.", "isbn": "978-0-07-802215-9", "genre": "Computer Science", "published_year": 2019, "total_count": 3, "description": "Comprehensive introduction to database systems."},
    {"title": "The Alchemist", "author": "Paulo Coelho", "isbn": "978-0-06-231500-7", "genre": "Fiction", "published_year": 1988, "total_count": 5, "description": "A novel about following one's dreams."},
    {"title": "Rich Dad Poor Dad", "author": "Robert Kiyosaki", "isbn": "978-1-61-239038-4", "genre": "Finance", "published_year": 1997, "total_count": 3, "description": "Personal finance classic about financial literacy."},
    {"title": "Operating System Concepts", "author": "Silberschatz et al.", "isbn": "978-1-11-856333-9", "genre": "Computer Science", "published_year": 2018, "total_count": 4, "description": "The dinosaur book — a comprehensive OS textbook."},
]

USERS = [
    {"name": "Dr. Meera Librarian", "email": "librarian@library.edu", "password": "lib@1234", "role": "librarian", "student_id": None},
    {"name": "Arjun Kumar",         "email": "arjun@student.edu",   "password": "student@123", "role": "student", "student_id": "STU001"},
    {"name": "Priya Sharma",        "email": "priya@student.edu",   "password": "student@123", "role": "student", "student_id": "STU002"},
    {"name": "Rahul Verma",         "email": "rahul@student.edu",   "password": "student@123", "role": "student", "student_id": "STU003"},
    {"name": "Ananya Singh",        "email": "ananya@student.edu",  "password": "student@123", "role": "student", "student_id": "STU004"},
    {"name": "Prof. Suresh Staff",  "email": "suresh@staff.edu",    "password": "staff@123",   "role": "staff",   "student_id": "STAFF001"},
]


def seed():
    with app.app_context():
        # Clear existing data
        Transaction.query.delete()
        Book.query.delete()
        User.query.delete()
        db.session.commit()

        # Create users
        users = []
        for u_data in USERS:
            u = User(
                name=u_data["name"],
                email=u_data["email"],
                role=u_data["role"],
                student_id=u_data["student_id"],
            )
            u.set_password(u_data["password"])
            db.session.add(u)
            users.append(u)
        db.session.commit()

        # Create books
        books = []
        for b_data in BOOKS:
            b = Book(
                title=b_data["title"],
                author=b_data["author"],
                isbn=b_data["isbn"],
                genre=b_data["genre"],
                published_year=b_data["published_year"],
                total_count=b_data["total_count"],
                available_count=b_data["total_count"],  # start fully available
                description=b_data["description"],
            )
            db.session.add(b)
            books.append(b)
        db.session.commit()

        # Create sample transactions (some past, some active, some overdue)
        student_users = [u for u in users if u.role in ("student", "staff")]
        txns_to_add = [
            # Returned transactions (past borrows)
            (student_users[0], books[0], -20, -6, "returned"),
            (student_users[0], books[2], -30, -16, "returned"),
            (student_users[1], books[1], -15, -1,  "returned"),
            (student_users[2], books[5], -40, -26, "returned"),
            (student_users[3], books[9], -10, -3,  "returned"),
            # Active borrows
            (student_users[0], books[3], -5,  None, "borrowed"),
            (student_users[1], books[6], -8,  None, "borrowed"),
            # Overdue
            (student_users[2], books[4], -20, None, "overdue"),
        ]

        for (user, book, issue_offset, return_offset, status) in txns_to_add:
            now = datetime.utcnow()
            issue = now + timedelta(days=issue_offset)
            due = issue + timedelta(days=14)
            ret = (now + timedelta(days=return_offset)) if return_offset else None
            fine = max(0, ((now - due).days * 2)) if status == "overdue" else 0.0

            txn = Transaction(
                user_id=user.id,
                book_id=book.id,
                issue_date=issue,
                due_date=due,
                return_date=ret,
                status=status,
                fine_amount=fine,
            )
            if status in ("borrowed", "overdue"):
                book.available_count = max(0, book.available_count - 1)

            db.session.add(txn)

        db.session.commit()
        print("✅ Database seeded successfully!")
        print("\n📋 Login credentials:")
        print("  Librarian : librarian@library.edu / lib@1234")
        print("  Student   : arjun@student.edu     / student@123")
        print("  Staff     : suresh@staff.edu       / staff@123")


if __name__ == "__main__":
    seed()
