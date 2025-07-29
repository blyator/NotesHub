import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../context/UserContext";
import { NotesContext } from "../context/NotesContext";
import toast from "react-hot-toast";
import NavHome from "../components/NavHome";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const { login_user, currentUser, fetchCurrentUser, auth_token } =
    useContext(UserContext);
  const { fetchNotes } = useContext(NotesContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/notes";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    if (currentUser && auth_token && !justLoggedIn) {
      if (currentUser.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [currentUser, auth_token, navigate, justLoggedIn, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      toast("Password too short", {
        icon: "🔒",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await toast.promise(
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const res = await login_user(formData.email, formData.password);
          localStorage.setItem("showWelcomeMsg", "true");
          await fetchCurrentUser();
          await fetchNotes();
          return res;
        })(),
        {
          loading: "Signing you in...",
          success: "Login successful!",
          error: (err) => err.message || "Login failed",
        }
      );

      if (data?.access_token) {
        setJustLoggedIn(true);
        toast.success(
          `Welcome back, ${
            currentUser?.name || currentUser?.email || "friend"
          }!`
        );
        if (currentUser?.is_admin) {
          navigate("/admin");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      toast.error(error?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userInfo = await userInfoResponse.json();

        const googleUser = {
          email: userInfo.email,
          password: userInfo.id,
          name: userInfo.name,
          provider: "google",
        };

        const user = await login_user(
          googleUser.email,
          googleUser.password,
          "google",
          googleUser.name
        );
        localStorage.setItem("showWelcomeMsg", "true");
        await fetchCurrentUser();
        await fetchNotes();
        setJustLoggedIn(true);
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error("Google login failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed");
      setIsGoogleLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen">
      <NavHome />
      <section className="pt-30  pb-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-8xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Marketing Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-base-content leading-tight">
                  Your thoughts,
                  <span className="text-5xl lg:text-6xl font-bold text-secondary leading-tight">
                    {" "}
                    beautifully organized
                  </span>
                </h1>
                <p className="text-xl text-base-content/80 leading-relaxed">
                  NotesHub is the clean and minimal note taking app that helps
                  you capture, organize, and securely store your ideas. Focus on
                  what matters most. Your thoughts.
                </p>
              </div>

              <div className="flex items-center space-x-8 text-sm text-base-content/60">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>It's absolutely free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <span>Join thousands of happy users</span>
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-md">
                <div className="card bg-base-200 shadow-xl lg:mt-40">
                  <div className="card-body p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-base-content mb-2">
                        Welcome Back
                      </h2>
                      <p className="text-base-content/70">
                        Sign in to your account
                      </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className="btn btn-outline w-full mb-6"
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <FcGoogle className="w-5 h-5" />
                          <span className="ml-2">Continue with Google</span>
                        </>
                      )}
                    </button>

                    <div className="divider">OR</div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 h-5 w-5" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full pl-10"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Password
                          </span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 h-5 w-5 z-10" />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered w-full pl-10 pr-12"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/60 z-20 bg-transparent border-none p-1 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          to="/forgot-password"
                          className="link link-primary text-sm"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full mt-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </form>

                    <div className="text-center mt-4">
                      <p className="text-base-content/70">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="link link-primary font-medium"
                        >
                          Sign up here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
