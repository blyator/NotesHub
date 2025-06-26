import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/reset-password/${token}`);
        if (res.ok) {
          setVerified(true);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.promise(
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await fetch(`${BACKEND_URL}/reset-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: newPassword }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to reset password.");
        }

        return res;
      })(),
      {
        loading: "Resetting password...",
        success: () => {
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          return "Password reset!";
        },
        error: (err) => err.message || "Could not reset password",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-lg p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold text-error">
            Invalid or expired link
          </h2>
          <p>Please request a new password reset link.</p>
          <button
            className="btn btn-secondary w-full"
            onClick={() => navigate("/forgot-password")}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
                onClick={() => setShowConfirm((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
