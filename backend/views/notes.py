from flask import Blueprint, request, jsonify
from models import db, Note

notes_bp = Blueprint("notes_bp", __name__)


@notes_bp.route("/notes", methods=["POST"])
def create_note():
    data = request.get_json()
    title = data.get("title")
    notes = data.get("notes")
    user_id = data.get("user_id")

    if not title or not notes or not user_id:
        return jsonify({"error": "Title, notes, and user_id are required"}), 400

    new_note = Note(title=title, notes=notes, user_id=user_id)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"success": "Note created successfully"}), 201


@notes_bp.route("/notes", methods=["GET"])
def get_all_notes():
    notes = Note.query.all()
    result = []
    for note in notes:
        result.append({
            "id": note.id,
            "title": note.title,
            "notes": note.notes,
            "user_id": note.user_id,
            "created_at": note.created_at,
            "updated_at": note.updated_at
        })
    return jsonify(result), 200



@notes_bp.route("/notes/<note_id>", methods=["PATCH"])
def update_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    data = request.get_json()
    note.title = data.get("title", note.title)
    note.notes = data.get("notes", note.notes)

    db.session.commit()
    return jsonify({"success": "Note updated successfully"}), 200



@notes_bp.route("/notes/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"success": "Note deleted successfully"}), 200
