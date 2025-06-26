from flask import Blueprint, request, jsonify
from models import db, User
from flask_mail import Message
from views.mailserver import send_email
from werkzeug.security import generate_password_hash
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash


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
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": "User deleted"}), 200


@users_bp.route("/users/<int:user_id>/change_password", methods=["PATCH"])
@jwt_required()
def change_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    current_user_id = get_jwt_identity()
    if user.id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        return jsonify({"error": "Current and new password are required"}), 400

    if not check_password_hash(user.password, current_password):
        return jsonify({"error": "Current password is incorrect"}), 400

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"success": "Password updated"}), 200
