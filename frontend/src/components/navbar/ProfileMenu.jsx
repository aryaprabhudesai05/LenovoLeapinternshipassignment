import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileMenu({ name, email, photo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = [
    { label: "Profile", icon: <User size={16} />, path: "/dashboard/profile" },
    { label: "Settings", icon: <Settings size={16} />, path: "/dashboard/settings" },
  ];

  return (
    <div className="profile" ref={ref} onClick={() => setOpen((o) => !o)}>
      <img src={photo} alt="" />
      <div className="meta">
        <h4>{name}</h4>
        <p>{email}</p>
      </div>
      <ChevronDown size={16} color="var(--text-muted)" />

      {open && (
        <div
          style={{
            position: "absolute",
            top: 64,
            right: 28,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "var(--shadow)",
            width: 200,
            padding: 8,
            zIndex: 60,
          }}
        >
          {items.map((it) => (
            <div
              key={it.label}
              className="row"
              style={{ gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}
              onClick={() => navigate(it.path)}
            >
              {it.icon}
              <span style={{ fontSize: 14 }}>{it.label}</span>
            </div>
          ))}
          <div
            className="row"
            style={{ gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--danger)" }}
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} />
            <span style={{ fontSize: 14 }}>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}
