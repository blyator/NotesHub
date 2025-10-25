from app import app
from models import db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    print("🌱 Starting seed process...")

    # Check if admin user already exists
    existing_admin = User.query.filter_by(email="admin@noteshub.com").first()

    if existing_admin:
        print("Admin user already exists, skipping creation.")
    else:
        admin = User(
            name="admin",
            email="admin@noteshub.com",
            password=generate_password_hash("admin@admin"),
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")

    print("Seed complete!")
