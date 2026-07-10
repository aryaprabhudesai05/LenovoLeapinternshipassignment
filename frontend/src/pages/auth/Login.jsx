import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthShell } from "../../layouts/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="sub">Sign in to continue your career journey.</p>

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

          <div className="field">
            <label>Password</label>
            <div className="row" style={{ gap: 8 }}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  padding: 4,
                  display: "grid",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="link">Forgot password?</Link>
          <div style={{ marginTop: 8 }}>
            New here? <Link to="/register" className="link">Create account</Link>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
