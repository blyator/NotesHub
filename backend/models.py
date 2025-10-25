from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy import JSON
from datetime import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    provider = db.Column(db.String(50), default='credentials')

    notes = db.relationship(
        'Note',
        backref='user',
        lazy=True,
        cascade="all, delete-orphan"
    )

    tags = db.relationship(
        'Tag',
        backref='user',
        lazy=True,
        cascade="all, delete-orphan"
    )

class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    notes = db.Column(JSON, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    tags = db.relationship(
        'Tag',
        secondary='note_tags',
        back_populates='notes',
        lazy='subquery',
        overlaps="note_tags_assoc,tag"
    )


class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    notes = db.relationship(
        'Note',
        secondary='note_tags',
        back_populates='tags',
        lazy='subquery',
        overlaps="note_tags_assoc,note"
    )


class NoteTag(db.Model):
    __tablename__ = 'note_tags'

    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)

    note = db.relationship(
        'Note',
        backref=db.backref('note_tags_assoc', lazy=True, overlaps="tags,notes"),
        overlaps="tags,notes"
    )
    tag = db.relationship(
        'Tag',
        backref=db.backref('note_tags_assoc', lazy=True, overlaps="tags,notes"),
        overlaps="notes,tags"
    )


class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
