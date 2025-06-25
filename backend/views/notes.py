from flask import Blueprint, request, jsonify
from models import NoteTag, Tag, db, Note
from flask_jwt_extended import get_jwt_identity, jwt_required

notes_bp = Blueprint("notes_bp", __name__)

@notes_bp.route("/notes", methods=["POST"])
@jwt_required()
def create_note():
    data = request.get_json()
    title = data.get("title")
    notes = data.get("notes")
    
    current_user_id = get_jwt_identity()
    
    if not title:
        return jsonify({"error": "Title required"}), 400
    
    try:
        new_note = Note(title=title, notes=notes, user_id=current_user_id)
        db.session.add(new_note)
        db.session.commit()
        
        return jsonify({
            "id": new_note.id,
            "title": new_note.title,
            "notes": new_note.notes,
            "user_id": new_note.user_id,
            "created_at": new_note.created_at.isoformat(),
            "updated_at": new_note.updated_at.isoformat()
        }), 201
        
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create note"}), 500



@notes_bp.route("/notes", methods=["GET"])
@jwt_required()
def get_all_notes():
    current_user_id = get_jwt_identity()
    notes = Note.query.filter_by(user_id=current_user_id).order_by(Note.updated_at.desc()).all()
    result = []
    for note in notes:
        result.append({
            "id": note.id,
            "title": note.title,
            "notes": note.notes,
            "user_id": note.user_id,
            "created_at": note.created_at.isoformat(),
            "updated_at": note.updated_at.isoformat(),
            "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags]
        })
    return jsonify(result), 200




@notes_bp.route("/notes/<note_id>", methods=["PATCH"])
@jwt_required()
def update_note(note_id):
    current_user_id = get_jwt_identity()
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    if note.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    note.title = data.get("title", note.title)
    note.notes = data.get("notes", note.notes)
    note.updated_at = db.func.current_timestamp()
    
    try:
        db.session.commit()
        
        return jsonify({
            "id": note.id,
            "title": note.title,
            "notes": note.notes,
            "user_id": note.user_id,
            "created_at": note.created_at.isoformat(),
            "updated_at": note.updated_at.isoformat(),
            "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags]
        }), 200
        
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to update"}), 500
    

@notes_bp.route("/notes/<note_id>", methods=["GET"])
@jwt_required()
def get_note(note_id):
    current_user_id = get_jwt_identity()
    
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    if note.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify({
        "id": note.id,
        "title": note.title,
        "notes": note.notes,
        "user_id": note.user_id,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
        "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags]
    }), 200

@notes_bp.route("/notes/<note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    current_user_id = get_jwt_identity()

    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    if note.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        note.tags.clear()
        db.session.commit()

        db.session.delete(note)
        db.session.commit()

        return jsonify({"success": "Note deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete note: {str(e)}"}), 500




@notes_bp.route("/notes/<note_id>/tags", methods=["POST"])
@jwt_required()
def add_tag_to_note(note_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    tag_id = data.get("tag_id")

    if not tag_id:
        return jsonify({"error": "tag_id is required"}), 400

    note = Note.query.get(note_id)
    if not note or note.user_id != current_user_id:
        return jsonify({"error": "Note not found or unauthorized"}), 404

    tag = Tag.query.get(tag_id)
    if not tag or tag.user_id != current_user_id:
        return jsonify({"error": "Tag not found or unauthorized"}), 404

    existing_relation = NoteTag.query.filter_by(note_id=note_id, tag_id=tag_id).first()
    if existing_relation:
        return jsonify({"error": "Tag already added to note"}), 400

    note_tag = NoteTag(note_id=note_id, tag_id=tag_id)
    db.session.add(note_tag)
    db.session.commit()

    return jsonify({
        "success": "Tag added to note",
        "note_id": note_id,
        "tag_id": tag_id
    }), 200

@notes_bp.route("/notes/<note_id>/tags/<tag_id>", methods=["DELETE"])
@jwt_required()
def remove_tag_from_note(note_id, tag_id):
    current_user_id = get_jwt_identity()

    note = Note.query.get(note_id)
    if not note or note.user_id != current_user_id:
        return jsonify({"error": "Note not found"}), 404

    tag = Tag.query.get(tag_id)
    if not tag or tag.user_id != current_user_id:
        return jsonify({"error": "Tag not found "}), 404

    note_tag = NoteTag.query.filter_by(note_id=note_id, tag_id=tag_id).first()
    if not note_tag:
        return jsonify({"error": "Tag not associated with note"}), 404

    db.session.delete(note_tag)
    db.session.commit()

    return jsonify({"success": "Tag removed from note"}), 200

@notes_bp.route("/notes/<note_id>/tags", methods=["GET"])
@jwt_required()
def get_note_tags(note_id):
    current_user_id = get_jwt_identity()
    
    note = Note.query.get(note_id)
    if not note or note.user_id != current_user_id:
        return jsonify({"error": "Note not found"}), 404

    tags = [{
        "id": tag.id,
        "name": tag.name
    } for tag in note.tags]

    return jsonify(tags), 200