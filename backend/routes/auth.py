"""
routes/auth.py - Authentication Routes
POST /api/auth/login    - Login (librarian or student/staff)
POST /api/auth/register - Register new user
GET  /api/auth/me       - Get current user profile
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from models import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Unified login endpoint.
    Body: { email, password, role }
    role filter ensures librarians can't log in through the student portal and vice versa.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    requested_role = data.get("role", "")  # 'librarian' | 'student' | 'staff'

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Role-based portal restriction
    if requested_role == "librarian" and user.role != "librarian":
        return jsonify({"error": "Access denied: not a librarian account"}), 403
    if requested_role in ("student", "staff") and user.role == "librarian":
        return jsonify({"error": "Access denied: please use the librarian portal"}), 403

    # Create JWT token
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "name": user.name},
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new student/staff user.
    Librarians must be created by an admin directly.
    Body: { name, email, password, role, student_id }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "student")
    student_id = data.get("student_id", "").strip()

    # Validation
    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400
    if role == "librarian":
        return jsonify({"error": "Cannot self-register as librarian"}), 403
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    if student_id and User.query.filter_by(student_id=student_id).first():
        return jsonify({"error": "Student ID already registered"}), 409

    user = User(name=name, email=email, role=role, student_id=student_id or None)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful", "user": user.to_dict()}), 201


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Return the currently authenticated user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200
