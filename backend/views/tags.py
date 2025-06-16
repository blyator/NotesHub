from flask import Blueprint, request, jsonify
from models import db, Tag

tags_bp = Blueprint("tags_bp", __name__)


@tags_bp.route("/tags", methods=["POST"])
def create_tag():
    data = request.get_json()
    name = data.get("name")
    user_id = data.get("user_id")

    if not name or not user_id:
        return jsonify({"error": "Name and user_id are required"}), 400

    tag = Tag(name=name, user_id=user_id)
    db.session.add(tag)
    db.session.commit()
    return jsonify({"success": "Tag created successfully"}), 201



@tags_bp.route("/tags", methods=["GET"])
def get_all_tags():
    tags = Tag.query.all()
    result = []
    for tag in tags:
        result.append({
            "id": tag.id,
            "name": tag.name,
            "user_id": tag.user_id
        })
    return jsonify(result), 200



@tags_bp.route("/tags/<tag_id>", methods=["GET"])
def get_tag_by_id(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    return jsonify({
        "id": tag.id,
        "name": tag.name,
        "user_id": tag.user_id
    }), 200




@tags_bp.route("/tags/<tag_id>", methods=["DELETE"])
def delete_tag(tag_id):
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"success": "Tag deleted successfully"}), 200
