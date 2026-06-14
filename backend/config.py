"""
config.py - Application Configuration
"""
import os
from datetime import timedelta

class Config:
    # Secret Keys
    SECRET_KEY = os.environ.get("SECRET_KEY", "library_super_secret_key_2024")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt_library_secret_2024")

    # Database
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'library.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Settings
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    # CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Upload folder for scanned images
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
