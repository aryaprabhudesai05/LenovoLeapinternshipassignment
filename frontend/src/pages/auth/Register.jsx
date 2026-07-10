import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthShell } from "../../layouts/AuthLayout";

export default function Register() {
  const { register: doRegister } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await doRegister(data.name, data.email, data.password);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      const msg = e?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="sub">Start your AI-powered career mentoring today.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label>Full Name</label>
            <div className="row" style={{ gap: 8 }}>
              <User size={18} color="var(--text-muted)" />
               <input
                className="input"
                placeholder="Your full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
            </div>
            {errors.name && (
              <span style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.name.message}
              </span>
            )}
          </div>

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
                autoComplete="new-password"
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

          <div className="field">
            <label>Confirm Password</label>
            <div className="row" style={{ gap: 8 }}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </div>
      </div>
    </AuthShell>
  );
}
