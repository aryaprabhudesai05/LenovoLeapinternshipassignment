import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthShell } from "../../layouts/AuthLayout";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { email: "" } });
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success("Reset link sent to your email.");
    } catch (e) {
      toast.error(e?.message || "Could not send reset link. Please try again.");
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <h2>Reset password</h2>
        <p className="sub">
          {sent
            ? "Check your inbox for the reset link."
            : "We'll email you a link to reset your password."}
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label>Email</label>
              <div className="row" style={{ gap: 8 }}>
                <Mail size={18} color="var(--text-muted)" />
                <input
                  className="input"
                  placeholder="you@email.com"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="center" style={{ padding: "20px 0" }}>
            <CheckCircle2 size={48} color="var(--success)" />
            <p className="muted" style={{ marginTop: 12 }}>
              If an account with that email exists, you'll receive a password reset link shortly.
            </p>
            <button
              className="btn btn-outline"
              style={{ marginTop: 16 }}
              onClick={() => {
                setSent(false);
                reset();
              }}
              type="button"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" className="link">
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
