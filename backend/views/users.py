import os
from flask import Blueprint, request, jsonify
from models import Note, Tag, TokenBlocklist, db, User
from flask_mail import Message
from views.mailserver import send_email, send_reset_email
from werkzeug.security import generate_password_hash
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token, decode_token
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta, timezone
from flask import current_app 
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")

users_bp = Blueprint("users_bp", __name__)


@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(name=name, email=email, password=generate_password_hash(password))
    db.session.add(new_user)

    try:
        send_email(name, email)
        db.session.commit()
        return jsonify({"success": "User created"}), 201

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Could not register user"}), 500



@users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin,
            "created_at": user.created_at
        } for user in users
    ]), 200



@users_bp.route("/users/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    if "name" in data:
        user.name = data["name"]

    if "password" in data and data["password"]:
        user.password = generate_password_hash(data["password"])
    
    try:
        db.session.commit()
        return jsonify({"success": "Profile updated!"}), 201

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Could not update profile"}), 500



@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        Note.query.filter_by(user_id=user_id).delete()
        Tag.query.filter_by(user_id=user_id).delete()
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "Account and all related data deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@users_bp.route("/change_password", methods=["PATCH"])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({"error": "Current and new password are required"}), 400

    if not check_password_hash(user.password, current_password):
        return jsonify({"error": "Current password is incorrect"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"success": "Password updated"}), 200



def create_reset_token(user_id):
    return create_access_token(
        identity=user_id,
        expires_delta=timedelta(hours=1),
        additional_claims={"type": "password_reset"}
    )

def verify_reset_token(token):
    try:
        decoded = decode_token(token)
        jti = decoded.get("jti")
        
        is_blocked = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
        if is_blocked:
            print("Token has been revoked")
            return None

        if decoded.get("type") != "password_reset":
            print("Invalid token type:", decoded.get("type"))
            return None

        return decoded["sub"]
    except Exception as e:
        print("Token verification failed:", str(e))
        return None


@users_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        try:
            token = create_reset_token(user.id)
            reset_url = f"{FRONTEND_URL}/reset-password/{token}"
            send_reset_email(user.email, reset_url)
        except Exception as e:
            print(f"Error sending reset email: {str(e)}")
    
    return jsonify({"message": "If the email exists, a reset link has been sent."}), 200



@users_bp.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):
    user_id = verify_reset_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired reset token"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == "GET":
        return jsonify({
            "email": user.email,
            "valid": True
        })

    data = request.get_json()
    new_password = data.get("new_password")

    if not new_password or len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        user.password = generate_password_hash(new_password)
        db.session.commit()

        decoded = decode_token(token)
        jti = decoded["jti"]
        now = datetime.now(timezone.utc)
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.commit()

        return jsonify({"message": "Password successfully reset"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@users_bp.route("/verify-reset-token/<token>", methods=["GET"])
def verify_token_route(token):
    user_id = verify_reset_token(token)
    if user_id:
        return jsonify({"valid": True}), 200
    else:
        return jsonify({"valid": False, "error": "Invalid or expired token"}), 400