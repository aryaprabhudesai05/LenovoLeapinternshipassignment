import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Circle, Lightbulb } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";
import RadarChart from "../../components/charts/RadarChart";

export default function CareerReadiness() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/readiness").then(setData).catch(() => setData({ score: 0, breakdown: [], suggestions: [] }));
  }, []);

  if (!data) return <Skeleton height={320} />;

  const radar = (data.breakdown || []).map((b) => ({ skill: b.label, value: b.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Career Readiness</h1>
          <p>How prepared are you to land your dream job?</p>
        </div>
        <Badge variant={data.score > 75 ? "success" : "warning"}>{data.score}% Ready</Badge>
      </div>

      <div className="grid grid-3">
        <Card className="center">
          <CardHead title="Readiness Score" icon={<Activity size={18} />} />
          <CircularProgress value={data.score} size={160} color="var(--warning)" />
          <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            {(data.breakdown || []).filter((b) => b.value >= 60).length} of {(data.breakdown || []).length} areas strong
          </p>
        </Card>

        <Card>
          <CardHead title="Dimensions" />
          {radar.length ? (
            <RadarChart data={radar} nameKey="skill" dataKey="value" />
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>Complete your profile to see dimensions.</p>
          )}
        </Card>

        <Card>
          <CardHead title="Suggestions" icon={<Lightbulb size={18} />} />
          {(data.suggestions || []).map((s, i) => (
            <div key={i} className="row" style={{ gap: 10, marginBottom: 12 }}>
              <Lightbulb size={18} color="var(--warning)" />
              <span style={{ fontSize: 14 }}>{s}</span>
            </div>
          ))}
          {(data.suggestions || []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>No suggestions yet.</p>}
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead title="Readiness Checklist" />
        {(data.breakdown || []).map((b) => (
          <div key={b.label} className="row" style={{ gap: 10, marginBottom: 12 }}>
            {b.value >= 60 ? (
              <CheckCircle2 size={20} color="var(--success)" />
            ) : (
              <Circle size={20} color="var(--text-light)" />
            )}
            <span style={{ fontSize: 14, flex: 1 }}>{b.label}</span>
            <span className="muted" style={{ fontSize: 13 }}>{b.value}%</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
