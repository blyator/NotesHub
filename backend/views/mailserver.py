from flask_mail import Mail, Message

mail = Mail()

def email(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'demajor45@gmail.com'
    app.config['MAIL_PASSWORD'] = 'wnpc ygqz xnzm ckia'
    app.config['MAIL_DEFAULT_SENDER'] = 'noteshub@gmail.com'
    
    mail.init_app(app)


def send_email(name, email):
    msg = Message(
        subject="Welcome to NotesHub",
        recipients=[email],
        body=(
            f"Hello {name},\n\n"
            f"Welcome to NotesHub! We're excited to have you on board.\n\n"
            f"You can now create, tag, and organize your personal notes efficiently.\n\n"
            f"Happy note-taking! \n\n"
            f"- The NotesHub Team"
        )
    )
    mail.send(msg)