import { useEffect, useState } from "react";
import { Target, BookOpen } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import BarChart from "../../components/charts/BarChart";

export default function SkillGap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/skill").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  const gapData = data.gaps.map((g) => ({
    name: g.skill,
    current: g.level,
    required: g.required,
  }));

  return (
    <Card>
      <CardHead
        title="Skill Gap"
        icon={<Target size={18} />}
        action={<Badge variant="primary">Full Stack Dev</Badge>}
      />

      <BarChart data={gapData} xKey="name" dataKey="required" color="#3b82f6" />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        {data.gaps.map((g) => {
          const gap = g.required - g.level;
          return (
            <div key={g.skill}>
              <div className="row between" style={{ fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 600 }}>{g.skill}</span>
                <Badge variant="danger">+{gap} needed</Badge>
              </div>
              <div className="progress">
                <span style={{ width: `${g.level}%`, background: "var(--warning)" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="divider" />

      <div className="list">
        {data.courses.map((c) => (
          <div key={c.skill} className="list-item">
            <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              <BookOpen size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 14 }}>{c.course}</h4>
              <p className="muted" style={{ fontSize: 13 }}>For: {c.skill}</p>
            </div>
            <Badge>{c.hours} hrs</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
