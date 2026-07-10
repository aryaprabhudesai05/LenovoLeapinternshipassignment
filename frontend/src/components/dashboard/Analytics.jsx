import { useEffect, useState } from "react";
import { BarChart3, Users } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import LineChart from "../../components/charts/LineChart";
import RadarChart from "../../components/charts/RadarChart";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then(setData);
  }, []);

  if (!data) return <Skeleton height={320} />;

  return (
    <div className="grid grid-2">
      <Card className="span-2">
        <CardHead
          title="Analytics Overview"
          icon={<BarChart3 size={18} />}
          action={<Badge variant="primary">Last 6 months</Badge>}
        />
        <div className="grid grid-4">
          {data.metrics.map((m) => (
            <div key={m.label} className="card" style={{ boxShadow: "none" }}>
              <div className="muted" style={{ fontSize: 12 }}>{m.label}</div>
              <div className="value" style={{ fontSize: 26, fontWeight: 800 }}>{m.value}</div>
              <div className={`trend ${m.delta >= 0 ? "up" : "down"}`}>
                {m.delta >= 0 ? "+" : ""}{m.delta}% vs last
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHead title="Score Trends" icon={<BarChart3 size={18} />} />
        <LineChart
          data={data.scoreOverTime}
          xKey="month"
          lines={[
            { key: "career", color: "#e53935" },
            { key: "ats", color: "#3b82f6" },
            { key: "readiness", color: "#16a34a" },
          ]}
        />
      </Card>

      <Card>
        <CardHead title="Competency Radar" icon={<Users size={18} />} />
        <RadarChart data={data.skillRadar.map((s) => ({ skill: s.skill, value: s.value }))} />
      </Card>
    </div>
  );
}
