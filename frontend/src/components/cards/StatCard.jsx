import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ icon, label, value, trend, color = "var(--primary)" }) {
  const up = trend >= 0;
  return (
    <div className="card stat">
      <div className="row between">
        <div>
          <div className="label">{label}</div>
          <div className="value primary" style={{ color }}>
            {value}
          </div>
        </div>
        {icon && (
          <span className="icon" style={{ background: "var(--primary-bg)", color }}>
            {icon}
          </span>
        )}
      </div>
      {trend !== undefined && (
        <div className={`trend ${up ? "up" : "down"}`}>
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {up ? "+" : ""}
          {trend}% this month
        </div>
      )}
    </div>
  );
}
