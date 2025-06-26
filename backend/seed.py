from app import app
from models import db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    admin = User(
        name="admin",
        email="admin@noteshub.com",
        password=generate_password_hash("admin@admin"),
        is_admin=True
    )
    
    db.session.add(admin)
    db.session.commit()
    print("Admin user created!")