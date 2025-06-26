import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { NotesContext } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login_user, fetchCurrentUser, loading, currentUser, auth_token } =
    useContext(UserContext);
  const { fetchNotes } = useContext(NotesContext);

  //****************** Prevent flash on redirect ******************

  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (currentUser && auth_token && !justLoggedIn) {
      if (currentUser.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/notes", { replace: true });
      }
    }
  }, [currentUser, auth_token, navigate, justLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser && auth_token) {
    return (
      <div className="loading loading-ring text-secondary loading-lg"></div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast("Please enter a valid email", {
        icon: "📧",
        style: {
          borderRadius: "10px",
          background: "#5C3A21",
          color: "#fff",
        },
      });
      return;
    }

    if (password.length < 6) {
      toast("Password too short", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#5C3A21",
          color: "#fff",
        },
      });
      return;
    }

    toast
      .promise(
        login_user(email, password),
        {
          loading: "Please wait...",
          error: (err) => err.message || "Login failed",
        },
        {
          style: {
            borderRadius: "10px",
            background: "#5C3A21",
            color: "#fff",
          },
          duration: 1500,
        }
      )
      .then((res) => {
        localStorage.setItem("showWelcomeMsg", "true");
        fetchCurrentUser();
        fetchNotes();

        if (res && res.user && res.user.is_admin) {
          navigate("/admin");
        } else {
          navigate("/notes");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  const handleGoogleAuth = () => {
    // Google authentication logic
  };

  const handleAppleAuth = () => {
    // Apple authentication logic
  };

  return (
    <div className="body-container">
      <section className="form-section">
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="inputbox">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
              />
              <label>Email</label>
              <svg
                className="input-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="inputbox">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label>Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="forget">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <a href="#">Forgot Password ?</a>
            </div>

            <button type="submit" className="auth-btn">
              Log In
            </button>
          </form>

          <div className="social-login">
            <div className="social-divider">
              <span>or continue with</span>
            </div>
            <div className="social-buttons">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="social-btn google-btn"
              >
                <svg viewBox="0 0 32 32" className="social-icon">
                  {/* Google icon SVG */}
                  <path
                    fill="#34A853"
                    d="M16,23.1c-3.3,0-6-2.2-6.8-5.2l-6.7,6.7C5.3,29,10.3,32,16,32c3.1,0,6-0.9,8.5-2.5l-6.7-6.7C17.2,23,16.6,23.1,16,23.1z"
                  />
                  <path
                    fill="#4285F4"
                    d="M32,13.8c-0.1-0.5-0.5-0.8-1-0.8H16c-0.6,0-1,0.4-1,1v5c0,0.6,0.4,1,1,1h5.3c-0.9,1.4-2.2,2.3-3.5,2.8l6.7,6.7C29,26.7,32,21.7,32,16c0-0.3,0-0.5,0-0.7C32.1,14.9,32.1,14.4,32,13.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M8.9,16c0-0.6,0.1-1.2,0.2-1.8L2.5,7.5C0.9,10,0,12.9,0,16s0.9,6,2.5,8.5l6.7-6.7C9,17.2,8.9,16.6,8.9,16z"
                  />
                  <path
                    fill="#EA4335"
                    d="M28.5,6c-1.1-1.4-2.5-2.6-4-3.6C22,0.9,19.1,0,16,0C10.3,0,5.3,3,2.5,7.5l6.7,6.7c0.8-3,3.6-5.2,6.8-5.2c0.6,0,1.2,0.1,1.8,0.3c0.9,0.3,1.7,0.8,2.6,1.5c0.3,0.3,0.7,0.3,1.1,0.1l6.7-3.3c0.3-0.1,0.5-0.4,0.5-0.7C28.8,6.6,28.7,6.3,28.5,6z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                className="social-btn apple-btn"
              >
                <svg viewBox="0 0 32 32" className="social-icon">
                  {/* Apple icon SVG */}
                  <g transform="translate(1.000000, 1.000000)">
                    <path
                      fill="#000000"
                      d="M10.7,31C10.7,31,10.7,31,10.7,31c-2.6,0-4.4-2.3-5.7-4.3c-3.3-5.1-4-11.5-1.6-15.2c1.6-2.5,4.2-4,6.7-4c1.3,0,2.4,0.4,3.3,0.7c0.7,0.3,1.4,0.5,2.1,0.5c0.6,0,1.1-0.2,1.8-0.5c0.9-0.3,2-0.7,3.5-0.7c2.2,0,4.5,1.2,6.1,3.2c0.2,0.2,0.3,0.5,0.2,0.8c-0.1,0.3-0.2,0.5-0.5,0.7c-1.8,1-2.8,2.8-2.6,4.8c0.1,2.1,1.4,3.8,3.3,4.5c0.3,0.1,0.5,0.3,0.6,0.6c0.1,0.3,0.1,0.5,0,0.8c-0.7,1.5-1,2.2-1.9,3.5c-1.5,2.2-3.3,4.5-5.7,4.5c-1.1,0-1.8-0.3-2.4-0.6c-0.6-0.3-1.2-0.6-2.4-0.6c-1.1,0-1.7,0.3-2.4,0.6C12.5,30.7,11.8,31,10.7,31z"
                    />
                    <path
                      fill="#000000"
                      d="M14.7,7.7c-0.1,0-0.1,0-0.2,0c-0.5,0-0.9-0.4-1-0.8c-0.3-1.7,0.3-3.7,1.6-5.3c1.2-1.5,3.2-2.5,5-2.7c0.5,0,1,0.3,1.1,0.9c0.3,1.8-0.3,3.7-1.6,5.3l0,0C18.5,6.7,16.5,7.7,14.7,7.7z"
                    />
                  </g>
                </svg>
                Apple
              </button>
            </div>
          </div>

          <div className="toggle-auth">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/SignUp")}
                className="toggle-btn"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </section>
      <div />
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "poppins", sans-serif;
        }

        .body-container {
          min-height: 100vh;
          position: relative;
        }

        .body-container::before {
          content: "";
          position: fixed;
          top: -5px;
          left: -5px;
          width: calc(100% + 10px);
          height: calc(100% + 10px);
          background-image: url("/assets/bg.avif");
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          filter: blur(2px);
          z-index: 1;
        }

        .form-section {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          max-width: 400px;
          background-color: transparent;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          backdrop-filter: blur(55px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 3rem;
          z-index: 1;
          opacity: 1;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .form-section.transitioning {
          opacity: 0;
          transform: translateY(-50%) translateX(-30px) scale(0.95);
          filter: blur(3px);
        }

        .form-container {
          width: 100%;
        }

        h1 {
          font-size: 2rem;
          color: #fff;
          text-align: center;
          margin-bottom: 20px;
        }

        .inputbox {
          position: relative;
          margin: 30px 0;
          max-width: 310px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        .inputbox:nth-child(2) {
          animation-delay: 0.1s;
        }
        .inputbox:nth-child(3) {
          animation-delay: 0.2s;
        }
        .inputbox:nth-child(4) {
          animation-delay: 0.3s;
        }
        .inputbox:nth-child(5) {
          animation-delay: 0.4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .inputbox label {
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          pointer-events: none;
          transition: all 0.5s ease-in-out;
        }

        .inputbox input:focus ~ label,
        .inputbox input:valid ~ label,
        .inputbox input:not(:placeholder-shown) ~ label {
          top: -5px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
        }

        .inputbox input {
          width: 100%;
          height: 60px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          padding: 0 35px 0 5px;
          color: rgba(255, 255, 255, 0.9);
        }

        .inputbox .input-icon {
          position: absolute;
          right: 8px;
          color: rgba(255, 255, 255, 0.7);
          width: 1.2rem;
          height: 1.2rem;
          top: 20px;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          top: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: auto;
          height: auto;
          border-radius: 0;
        }

        .password-toggle:hover {
          background: none;
        }

        .password-toggle svg {
          color: rgba(255, 255, 255, 0.7);
          width: 1.2rem;
          height: 1.2rem;
        }

        .forget {
          margin: 35px 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: space-between;
        }

        .forget label {
          display: flex;
          align-items: center;
        }

        .forget label input {
          margin-right: 3px;
        }

        .forget a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 600;
        }

        .forget a:hover {
          text-decoration: underline;
        }

        .auth-btn {
          width: 80%;
          height: 40px;
          border-radius: 40px;
          background-color: rgb(255, 255, 255, 0.5);
          border: none;
          outline: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.4s ease;
          margin-bottom: 20px;
          margin-bottom: 20px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .auth-btn:hover {
          background-color: rgb(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .social-login {
          width: 100%;
          margin: 20px 0;
        }

        .social-divider {
          text-align: center;
          margin: 20px 0;
        }

        .social-divider::before {
          content: "";
          display: block;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          margin-bottom: 10px;
        }

        .social-divider span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          display: block;
        }

        .social-buttons {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .social-btn {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        .social-icon {
          width: 18px;
          height: 18px;
        }

        .google-btn:hover {
          background: rgba(66, 133, 244, 0.1);
          border-color: #4285f4;
        }

        .apple-btn:hover {
          background: rgba(0, 0, 0, 0.1);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .toggle-auth {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin: 25px 0 10px;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          font-size: inherit;
          padding: 0;
          transition: all 0.3s ease;
        }

        .toggle-btn:hover {
          color: #fff;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .body-container {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }

          .form-section {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            margin: 10px auto;
            max-width: 85%;
            width: 100%;
            padding: 1.2rem 1.5rem;
            border-radius: 12px;
            min-height: auto;
          }

          .form-section.transitioning {
            transform: translateX(-15px) scale(0.98);
          }

          h1 {
            font-size: 1.5rem;
            margin-bottom: 12px;
          }

          .inputbox {
            margin: 18px 0;
            max-width: 100%;
          }

          .inputbox input {
            height: 45px;
            font-size: 0.85rem;
          }

          .inputbox label {
            font-size: 0.85rem;
          }

          .inputbox input:focus ~ label,
          .inputbox input:valid ~ label,
          .inputbox input:not(:placeholder-shown) ~ label {
            font-size: 0.7rem;
          }

          .forget {
            margin: 18px 0;
            font-size: 0.75rem;
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .forget a {
            align-self: flex-end;
          }

          .auth-btn {
            height: 42px;
            font-size: 0.9rem;
            margin-bottom: 15px;
          }

          .social-login {
            margin: 15px 0;
          }

          .social-buttons {
            flex-direction: column;
            gap: 10px;
          }

          .social-btn {
            height: 40px;
            font-size: 0.8rem;
          }

          .social-divider {
            margin: 12px 0;
          }

          .social-divider span {
            font-size: 0.8rem;
          }

          .toggle-auth {
            font-size: 0.8rem;
            margin: 15px 0 5px;
          }
        }

        @media (max-width: 480px) {
          .body-container {
            padding: 5px;
          }

          .body-container::before {
            background-position: center;
            background-size: cover;
          }

          .form-section {
            margin: 5px auto;
            max-width: 95%;
            padding: 1rem 1.2rem;
            border-radius: 10px;
          }

          h1 {
            font-size: 1.4rem;
          }

          .inputbox {
            margin: 15px 0;
          }

          .inputbox input {
            height: 40px;
            font-size: 0.8rem;
            padding: 0 28px 0 5px;
          }

          .inputbox label {
            font-size: 0.8rem;
          }

          .inputbox input:focus ~ label,
          .inputbox input:valid ~ label,
          .inputbox input:not(:placeholder-shown) ~ label {
            font-size: 0.65rem;
          }

          .inputbox .input-icon,
          .password-toggle svg {
            width: 0.9rem;
            height: 0.9rem;
          }

          .password-toggle {
            top: 14px;
          }

          .inputbox .input-icon {
            top: 14px;
          }

          .auth-btn {
            height: 38px;
            font-size: 0.85rem;
            margin-bottom: 12px;
          }

          .social-login {
            margin: 12px 0;
          }

          .social-btn {
            height: 36px;
            font-size: 0.75rem;
            gap: 5px;
          }

          .social-icon {
            width: 14px;
            height: 14px;
          }

          .social-buttons {
            gap: 8px;
          }

          .social-divider {
            margin: 10px 0;
          }

          .social-divider span {
            font-size: 0.75rem;
          }

          .forget {
            font-size: 0.7rem;
            margin: 15px 0;
          }

          .toggle-auth {
            font-size: 0.75rem;
            margin: 12px 0 3px;
          }
        }

        @media (max-width: 360px) {
          .form-section {
            margin: 3px auto;
            max-width: 98%;
            padding: 0.8rem 1rem;
          }

          h1 {
            font-size: 1.3rem;
          }

          .inputbox {
            margin: 12px 0;
          }

          .inputbox input {
            height: 38px;
            font-size: 0.75rem;
          }

          .inputbox label {
            font-size: 0.75rem;
          }

          .inputbox input:focus ~ label,
          .inputbox input:valid ~ label,
          .inputbox input:not(:placeholder-shown) ~ label {
            font-size: 0.6rem;
          }

          .auth-btn {
            height: 36px;
            font-size: 0.8rem;
          }

          .social-btn {
            height: 34px;
            font-size: 0.7rem;
          }

          .social-icon {
            width: 12px;
            height: 12px;
          }

          .forget {
            font-size: 0.65rem;
            margin: 12px 0;
          }

          .toggle-auth {
            font-size: 0.7rem;
          }
        }

        /* Landscape orientation on mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .body-container {
            padding: 5px;
          }

          .form-section {
            position: relative;
            margin: 5px auto;
            padding: 0.8rem 1.5rem;
            max-width: 80%;
          }

          h1 {
            font-size: 1.3rem;
            margin-bottom: 8px;
          }

          .inputbox {
            margin: 10px 0;
          }

          .inputbox input {
            height: 35px;
          }

          .forget {
            margin: 10px 0;
          }

          .auth-btn {
            height: 35px;
          }

          .social-btn {
            height: 35px;
          }

          .social-divider {
            margin: 8px 0;
          }

          .toggle-auth {
            margin: 10px 0 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
