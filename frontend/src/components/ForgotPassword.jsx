import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    toast
      .promise(
        (async () => {
          const startTime = Date.now();

          const res = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || "Failed to send reset link");

          const elapsed = Date.now() - startTime;
          const minDelay = 2000;
          if (elapsed < minDelay) {
            await new Promise((resolve) =>
              setTimeout(resolve, minDelay - elapsed)
            );
          }

          return data;
        })(),
        {
          loading: "Sending reset link...",
          success: "Link sent if email exists",
          error: (err) => err.message || "Please try again.",
        }
      )
      .then(() => {
        setEmail("");
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-lg bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          className="btn btn-warning btn-sm mt-4 w-full flex items-center justify-center gap-2"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} /> Back to Login
        </button>
      </div>
    </div>
  );
}
