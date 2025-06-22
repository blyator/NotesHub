from flask import Flask, request, jsonify, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from flask_jwt_extended import jwt_manager, create_access_token, jwt_required, get_jwt_identity, get_jwt, JWTManager
from datetime import datetime
from datetime import timezone


auth_bp = Blueprint("auth_bp", __name__)

jwt = JWTManager()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

@jwt.revoked_token_loader
def custom_revoked_token_response(jwt_header, jwt_payload):
    return jsonify({
        "error": "User not logged in"
    }), 401


def init_jwt(app):
    jwt.init_app(app)


@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"error": "email or password is wrong"}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)

    else:
        return jsonify({"error": "email or password is wrong"}), 400



@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def fetch_loggedin():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "created_at": user.created_at
    }
    return jsonify(user_data), 200




@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    new_blocked_token =TokenBlocklist(jti=jti, created_at=now)
    db.session.add(new_blocked_token)
    db.session.commit()
    return jsonify({"success": "Successfully logged out"}), 200