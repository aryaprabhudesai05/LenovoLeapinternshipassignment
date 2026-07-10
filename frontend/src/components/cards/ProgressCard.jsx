import { ProgressBar } from "../common";

export default function ProgressCard({ title, value, color, subtitle }) {
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>{title}</h3>
        <span style={{ fontWeight: 800, color: color || "var(--primary)" }}>{value}%</span>
      </div>
      <ProgressBar value={value} color={color} />
      {subtitle && <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>{subtitle}</p>}
    </div>
  );
}
