import { Sparkles, Target, Briefcase, GraduationCap } from "lucide-react";

export function AuthShell({ children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,.2)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            AI
          </div>
          <h2 style={{ color: "#fff" }}>AI Career Mentor</h2>
        </div>

        <h1>Your personal AI mentor for a brighter career.</h1>
        <p>
          Analyze resumes, detect skill gaps, build learning roadmaps, and practice
          interviews — all powered by intelligent agents.
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="ic"><Target size={18} /></span> Resume &amp; ATS analysis
          </div>
          <div className="auth-feature">
            <span className="ic"><GraduationCap size={18} /></span> Personalized learning roadmaps
          </div>
          <div className="auth-feature">
            <span className="ic"><Briefcase size={18} /></span> Smart job recommendations
          </div>
          <div className="auth-feature">
            <span className="ic"><Sparkles size={18} /></span> AI mock interviews &amp; feedback
          </div>
        </div>
      </div>

      <div className="auth-right">{children}</div>
    </div>
  );
}

export default AuthShell;
