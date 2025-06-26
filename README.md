# Notes App

NotesHub is an app designed to help users easily create, manage, and organize their notes. With a simple interface, users can add notes with titles, content and tags, then edit or delete them for better organization. The app also includes a search feature to quickly find specific notes. NotesHub is the perfect solution for keeping everything in one accessible place.

## Features

### User Authentication

- Secure user registration and login
- JWT token-based authentication
- Protected routes and user sessions

### Notes Management

- Create, edit, and delete notes
- Note tagging and organization
- Search and filter functionality

### Admin Panel

- Admin authentication and authorization
- View all registered users

### Modern UI/UX

- Responsive design for all devices
- Theme support
- Intuitive navigation

## 🛠️ Tech Stack

### Frontend

- **React** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library

### Backend

- **Flask** - Python web framework
- **Flask-JWT-Extended** - JWT authentication
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Database options

## 🚀 Getting Started

### Prerequisites

- **Node.js**
- **Python**
- **npm** or **yarn**

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/blyator/NotesHub/tree/main
   cd notes-app
   ```

2. **Set up Python virtual environment**

   ```bash
   cd backend
   pipenv install
   pipenv shell

   ```

3. **Initialize the database**

   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

4. **Run the Flask server**
   ```bash
   python run.py
   ```
   The backend will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Usage

### Creating Your First Note

1. **Register** for an account or **login** if you already have one
2. Click **"+"** floating button
3. Add your note title and content
4. Select a tag, optionally
5. Click **"Save"** to create your note

### Admin Access

#### Admin Login

1. Login with admin credentials
2. Admins will automatically be redirected to admin page
3. Access the admin dashboard to view registered users

## Customization

### Themes

The app supports multiple themes through DaisyUI:

- On the Navbar click on Theme dropdowm
- Pick a desired theme from the list

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## Live Demo

-Vercel frontend [NotesHub](https://notes-hub-teal.vercel.app/login)

-Render [Backend](https://noteshub-pzs1.onrender.com)

## 📄 License

MIT License

© 2025 Billy Yator

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Support

For support, questions, or feedback, open an issue or contact the developer:

📧 dmnbilly@gmail.com

---

**Made with love by Billy**

_Happy note-taking!_
