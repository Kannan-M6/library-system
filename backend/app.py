"""
app.py - Main Flask Application
Registers all blueprints and initializes extensions.
Run: python app.py
"""
import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from config import config


def create_app(env: str = "default") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config.get(env, config["default"]))

    # Ensure upload directory exists
    os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)

    # ── Extensions ────────────────────────────────────────────────── #
    db.init_app(app)
    JWTManager(app)
    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    # ── Blueprints ────────────────────────────────────────────────── #
    from routes.auth import auth_bp
    from routes.books import books_bp
    from routes.transactions import transactions_bp
    from routes.chatbot_routes import chatbot_bp
    from routes.camera_routes import camera_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(books_bp, url_prefix="/api/books")
    app.register_blueprint(transactions_bp, url_prefix="/api/transactions")
    app.register_blueprint(chatbot_bp, url_prefix="/api")
    app.register_blueprint(camera_bp, url_prefix="/api/camera")

    # ── Health Check ──────────────────────────────────────────────── #
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "Library Management API"}), 200

    # ── Error Handlers ────────────────────────────────────────────── #
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    # ── DB Init ───────────────────────────────────────────────────── #
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    env = os.environ.get("FLASK_ENV") or "development"
    app = create_app(env)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(env == "development"))
