from .users import users_bp
from .notes import notes_bp
from .tags import tags_bp
from .auth import auth_bp

def register_blueprints(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(tags_bp)
    app.register_blueprint(auth_bp)
