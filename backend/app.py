from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db
from views import register_blueprints
from views.mailserver import email
from flask_jwt_extended import JWTManager
from datetime import timedelta
from views.auth import init_jwt
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

@app.route('/')
def root():
    return "We are Live!"

app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///notes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_VERIFY_SUB"] = False

init_jwt(app)

CORS(app)

db.init_app(app)

migrate = Migrate(app, db)

email(app)

register_blueprints(app)

if __name__ == "__main__":
    app.run(debug=True)