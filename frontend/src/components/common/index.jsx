import { motion } from "framer-motion";
import { Input, TextArea, Select } from "../forms/FormControls";

export { Input, TextArea, Select };

export function Button({
  children,
  variant = "primary",
  size,
  className = "",
  ...props
}) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <motion.button whileTap={{ scale: 0.97 }} className={cls} {...props}>
      {children}
    </motion.button>
  );
}

export function Card({ children, className = "", hover, ...props }) {
  return (
    <div className={`card ${hover ? "card hover" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHead({ title, icon, action }) {
  return (
    <div className="card-head">
      <div className="row" style={{ gap: 12 }}>
        {icon && <span className="icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, variant = "", className = "" }) {
  return (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  );
}

export function ProgressBar({ value = 0, color }) {
  return (
    <div className="progress">
      <span style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}

export function Skeleton({ height = 20, width = "100%", radius = 10 }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: radius }}
    />
  );
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="center" style={{ padding: "40px 0" }}>
      {icon}
      <h3 style={{ marginTop: 12 }}>{title}</h3>
      {desc && <p className="muted" style={{ marginTop: 6 }}>{desc}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} style={{ background: "var(--surface-2)" }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
