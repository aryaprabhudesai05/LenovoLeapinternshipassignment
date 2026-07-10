import { useEffect, useState } from "react";
import { BarChart3, BrainCircuit, Activity, PieChart as PieIcon } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Skeleton } from "../../components/common";
import BarChart from "../../components/charts/BarChart";
import AreaChart from "../../components/charts/AreaChart";
import PieChart from "../../components/charts/PieChart";

export default function Charts() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(setData);
  }, []);

  if (!data) return <Skeleton height={320} />;

  const skillPie = data.skills.map((s) => ({ name: s.name, value: s.level }));

  return (
    <div className="grid grid-2">
      <Card>
        <CardHead title="Salary Trend (LPA)" icon={<BarChart3 size={18} />} />
        <BarChart data={data.salary} xKey="month" dataKey="value" color="#e53935" />
      </Card>

      <Card>
        <CardHead title="Skill Distribution" icon={<PieIcon size={18} />} />
        <PieChart data={skillPie} dataKey="value" nameKey="name" />
      </Card>

      <Card>
        <CardHead title="Skill Levels" icon={<BrainCircuit size={18} />} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
          {data.skills.map((s) => (
            <div key={s.name}>
              <div className="row between" style={{ fontSize: 13, marginBottom: 6 }}>
                <span>{s.name}</span>
                <span style={{ fontWeight: 700 }}>{s.level}%</span>
              </div>
              <div className="progress">
                <span
                  style={{
                    width: `${s.level}%`,
                    background: s.level > 80 ? "var(--success)" : "var(--primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHead title="Weekly Activity" icon={<Activity size={18} />} />
        <AreaChart data={data.activity} xKey="name" dataKey="visits" color="#8b5cf6" />
      </Card>
    </div>
  );
}
