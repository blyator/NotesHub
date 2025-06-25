from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import db, Tag

tags_bp = Blueprint("tags_bp", __name__)


@tags_bp.route("/tags", methods=["POST"])
@jwt_required()
def create_tag():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Name is required"}), 400

    existing_tag = Tag.query.filter_by(name=name, user_id=current_user_id).first()
    if existing_tag:
        return jsonify({"error": "Tag with this name already exists"}), 400

    tag = Tag(name=name, user_id=current_user_id)
    db.session.add(tag)
    db.session.commit()
    
    return jsonify({
        "id": tag.id,
        "name": tag.name,
        "user_id": tag.user_id
    }), 201

@tags_bp.route("/tags", methods=["GET"])
@jwt_required()
def get_all_tags():
    current_user_id = get_jwt_identity()
    tags = Tag.query.filter_by(user_id=current_user_id).all()
    result = []
    for tag in tags:
        result.append({
            "id": tag.id,
            "name": tag.name,
            "user_id": tag.user_id
        })
    return jsonify(result), 200

@tags_bp.route("/tags/<tag_id>", methods=["DELETE"])
@jwt_required()
def delete_tag(tag_id):
    current_user_id = get_jwt_identity()
    tag = Tag.query.get(tag_id)
    
    if not tag:
        return jsonify({"error": "Tag not found"}), 404
        
    if tag.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"success": "Tag deleted successfully"}), 200