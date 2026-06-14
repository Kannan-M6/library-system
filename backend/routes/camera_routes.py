"""
routes/camera_routes.py
POST /api/camera/scan   - Scan a base64 image and decode QR/barcode
POST /api/camera/borrow - Scan both student ID and book barcode, then borrow

Uses OpenCV + pyzbar for QR code / barcode decoding.
"""
import base64
import numpy as np
import cv2
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

camera_bp = Blueprint("camera", __name__)


def decode_image(b64_string: str):
    """Decode a base64 image string into an OpenCV BGR array."""
    try:
        # Handle data URLs (strip the "data:image/...;base64," prefix)
        if "," in b64_string:
            b64_string = b64_string.split(",")[1]
        
        # Validate base64 string
        if not b64_string or not isinstance(b64_string, str):
            raise ValueError("Invalid base64 string")
        
        # Decode base64
        try:
            img_bytes = base64.b64decode(b64_string, validate=True)
        except Exception as e:
            raise ValueError(f"Failed to decode base64: {str(e)}")
        
        # Validate decoded bytes
        if not img_bytes or len(img_bytes) == 0:
            raise ValueError("Base64 decoded to empty data")
        
        # Convert to numpy array
        arr = np.frombuffer(img_bytes, dtype=np.uint8)
        if len(arr) == 0:
            raise ValueError("Numpy array is empty after decoding")
        
        # Decode image with OpenCV
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        
        # Check if image was decoded successfully
        if img is None:
            raise ValueError("Failed to decode image - invalid image data or format")
        
        if img.size == 0:
            raise ValueError("Decoded image is empty")
        
        return img
    
    except Exception as e:
        raise ValueError(f"Image decode error: {str(e)}")


def detect_qr_barcode(img) -> list[str]:
    """
    Detect and decode all QR codes and barcodes in an image.
    Returns list of decoded strings.
    Priority: QR codes first via OpenCV, then pyzbar for 1D barcodes.
    """
    results = []

    # 1. Try OpenCV QR code detector
    qr_detector = cv2.QRCodeDetector()
    data, _, _ = qr_detector.detectAndDecode(img)
    if data:
        results.append(data)

    # 2. Try pyzbar for 1D barcodes (ISBN, etc.)
    try:
        from pyzbar.pyzbar import decode as pyzbar_decode
        decoded = pyzbar_decode(img)
        for obj in decoded:
            val = obj.data.decode("utf-8")
            if val not in results:
                results.append(val)
    except ImportError:
        pass  # pyzbar optional

    return results


@camera_bp.route("/scan", methods=["POST"])
@jwt_required()
def scan_image():
    """
    Scan a base64-encoded image and return decoded QR/barcode values.
    Body: { image: "<base64 string>" }
    """
    data = request.get_json() or {}
    b64 = data.get("image", "")
    if not b64:
        return jsonify({"error": "No image provided"}), 400

    try:
        img = decode_image(b64)
        if img is None:
            return jsonify({"error": "Could not decode image"}), 400

        decoded_values = detect_qr_barcode(img)
        return jsonify({
            "success": True,
            "decoded": decoded_values,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@camera_bp.route("/borrow-by-scan", methods=["POST"])
@jwt_required()
def borrow_by_scan():
    """
    Combined scan-and-borrow:
    1. Decode student_id from student QR image
    2. Decode ISBN from book barcode image
    3. Look up both in DB and create a transaction
    Body: { student_image: "<b64>", book_image: "<b64>" }
    """
    claims = get_jwt()
    if claims.get("role") != "librarian":
        return jsonify({"error": "Librarian access required"}), 403

    from models import User, Book, Transaction, db
    from datetime import datetime, timedelta

    data = request.get_json() or {}

    # --- Decode Student ID ---
    student_b64 = data.get("student_image", "")
    book_b64 = data.get("book_image", "")
    if not student_b64 or not book_b64:
        return jsonify({"error": "Both student_image and book_image are required"}), 400

    try:
        student_img = decode_image(student_b64)
        student_codes = detect_qr_barcode(student_img)
    except Exception as e:
        return jsonify({"error": f"Student image error: {e}"}), 400

    if not student_codes:
        return jsonify({"error": "No QR/barcode detected in student image"}), 400

    student_id_scanned = student_codes[0]
    student = User.query.filter_by(student_id=student_id_scanned).first()
    if not student:
        return jsonify({"error": f"No student found with ID: {student_id_scanned}"}), 404

    # --- Decode Book ISBN ---
    try:
        book_img = decode_image(book_b64)
        book_codes = detect_qr_barcode(book_img)
    except Exception as e:
        return jsonify({"error": f"Book image error: {e}"}), 400

    if not book_codes:
        return jsonify({"error": "No QR/barcode detected in book image"}), 400

    isbn_scanned = book_codes[0]
    book = Book.query.filter_by(isbn=isbn_scanned).first()
    if not book:
        return jsonify({"error": f"No book found with ISBN: {isbn_scanned}"}), 404
    if book.available_count <= 0:
        return jsonify({"error": "No copies of this book are available"}), 400

    # Check duplicate borrow
    existing = Transaction.query.filter_by(
        user_id=student.id, book_id=book.id, status="borrowed"
    ).first()
    if existing:
        return jsonify({"error": "This student has already borrowed this book"}), 400

    # Create transaction
    now = datetime.utcnow()
    txn = Transaction(
        user_id=student.id,
        book_id=book.id,
        issue_date=now,
        due_date=now + timedelta(days=14),
        status="borrowed",
    )
    book.available_count -= 1
    db.session.add(txn)
    db.session.commit()

    return jsonify({
        "message": f"Book '{book.title}' borrowed by {student.name}",
        "transaction": txn.to_dict(),
        "student": student.to_dict(),
        "book": book.to_dict(),
    }), 201
