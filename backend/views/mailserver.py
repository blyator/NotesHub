from flask_mail import Mail, Message

mail = Mail()

def email(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'demajor45@gmail.com'
    app.config['MAIL_PASSWORD'] = 'wnpc ygqz xnzm ckia'
    app.config['MAIL_DEFAULT_SENDER'] = 'demajor45@gmail.com'
    
    mail.init_app(app)


def send_email(name, email):

    subject = "Welcome to NotesHub"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Welcome to NotesHub, {name}</h2>
            <p>Dear {name},</p>
            <p>Thank you for joining NotesHub. We are pleased to have you on board.</p>
            <p>With NotesHub, you can:</p>
            <ul>
                <li>Create and manage your personal notes efficiently</li>
                <li>Tag and categorize your content for better organization</li>
                <li>Access your notes anytime with a simple and intuitive interface</li>
            </ul>
            <p>To get started, please visit the link below:</p>
            <p>
                <a href="http://localhost:5173/" style="background-color: #1d4ed8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to NotesHub</a>
            </p>
            <p>We look forward to supporting your productivity.</p>
            <p>Sincerely,<br/>The NotesHub Team</p>
        </body>
    </html>
    """

    text_body = f"""
    Dear {name},

    Thank you for joining NotesHub. We are pleased to have you on board.

    With NotesHub, you can:
    - Create and manage your personal notes efficiently
    - Tag and categorize your content for better organization
    - Access your notes anytime with a simple and intuitive interface

    To get started, visit: http://localhost:5173/

    We look forward to supporting your productivity.

    Sincerely,
    The NotesHub Team
    """

    msg = Message(
        subject=subject,
        recipients=[email],
        html=html_body,
        body=text_body
    )

    mail.send(msg)




def send_reset_email(email, reset_url):
    subject = "Password Reset Request"
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your account associated with <strong>{email}</strong>.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{reset_url}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
        </body>
    </html>
    """
    
    text_body = f"""
    Hello,

    You requested a password reset for your account associated with {email}.

    Reset your password using the link below:
    {reset_url}

    This link will expire in 1 hour.

    If you didn't request this reset, please ignore this email.
    """

    msg = Message(
        subject=subject,
        recipients=[email],
        html=html_body,
        body=text_body
    )
    mail.send(msg)