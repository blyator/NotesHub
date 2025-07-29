import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../context/UserContext";
import { NotesContext } from "../context/NotesContext";
import toast from "react-hot-toast";
import NavHome from "../components/NavHome";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  const { register_user, currentUser, fetchCurrentUser, auth_token } =
    useContext(UserContext);
  const { fetchNotes } = useContext(NotesContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/notes";

  // Apply saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser && auth_token && !justSignedUp) {
      if (currentUser.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [currentUser, auth_token, navigate, justSignedUp, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs using toast instead of HTML validation
    if (!formData.name.trim()) {
      toast.error("Enter your name");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords don't match", {
        icon: "🔒",
      });
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
      await toast.promise(
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const res = await register_user(
            formData.name,
            formData.email,
            formData.password
          );
          localStorage.setItem("showWelcomeMsg", "true");
          await fetchCurrentUser();
          await fetchNotes();
          return res;
        })(),
        {
          loading: "Creating your account...",
          success: "Account created successfully!",
          error: (err) => err.message || "Registration failed",
        },
        {
          duration: 5000,
        }
      );

      setJustSignedUp(true);
      toast.success(`Welcome, ${currentUser?.name || currentUser?.email}!`);

      if (currentUser?.is_admin) {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
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

        const user = await register_user(
          googleUser.name,
          googleUser.email,
          googleUser.password,
          "google"
        );

        toast.success(`Welcome, ${user?.name || user?.email || "friend"}!`);
        localStorage.setItem("showWelcomeMsg", "true");
        await fetchCurrentUser();
        await fetchNotes();
        setJustSignedUp(true);
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Google signup failed:", error);
        toast.error("Google signup failed.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google signup failed");
      setIsGoogleLoading(false);
    },
  });

  const handleGoogleSignup = () => {
    googleSignup();
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

            {/* Right Column - Signup Form */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-md">
                <div className="card bg-base-200 shadow-xl lg:mt-20">
                  <div className="card-body p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-base-content mb-2">
                        Create Your Account
                      </h2>
                      <p className="text-base-content/70">
                        Join NotesHub today
                      </p>
                    </div>

                    {/* Google Signup Button */}
                    <button
                      onClick={handleGoogleSignup}
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
                          <span className="label-text font-medium">
                            Full Name
                          </span>
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 h-5 w-5" />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full pl-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

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

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Confirm Password
                          </span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 h-5 w-5 z-10" />
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full pl-10 pr-12"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/60 z-20 bg-transparent border-none p-1 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full mt-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Creating account...</span>
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </button>
                    </form>

                    <div className="text-center mt-4">
                      <p className="text-base-content/70">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="link link-primary font-medium"
                        >
                          Sign in here
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

export default Signup;
