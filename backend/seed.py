from app import app
from models import db, User, Note, Tag, NoteTag
from datetime import datetime

def seed_data():
    with app.app_context():
        print("🔄 Clearing existing data...")
        NoteTag.query.delete()
        Note.query.delete()
        Tag.query.delete()
        User.query.delete()
        db.session.commit()

        print("🌱 Seeding users...")
        users = [
            User(name="Alice", email="alice@example.com", password="password1"),
            User(name="Bob", email="bob@example.com", password="password2"),
        ]
        db.session.add_all(users)
        db.session.commit()

        print("📝 Seeding notes...")
        notes = [
            Note(title="Flask Setup", notes="Install Flask and set up your app structure.", user_id=users[0].id),
            Note(title="ORM Notes", notes="SQLAlchemy is used for database interactions.", user_id=users[1].id),
        ]
        db.session.add_all(notes)
        db.session.commit()

        print("🏷️ Seeding tags...")
        tags = [
            Tag(name="python", user_id=users[0].id),
            Tag(name="flask", user_id=users[0].id),
            Tag(name="orm", user_id=users[1].id),
        ]
        db.session.add_all(tags)
        db.session.commit()

        print("🔗 Linking tags to notes...")
        note_tags = [
            NoteTag(note_id=notes[0].id, tag_id=tags[0].id),
            NoteTag(note_id=notes[0].id, tag_id=tags[1].id),
            NoteTag(note_id=notes[1].id, tag_id=tags[2].id),
        ]
        db.session.add_all(note_tags)
        db.session.commit()

        print("✅ Seeding complete!")

if __name__ == "__main__":
    seed_data()
