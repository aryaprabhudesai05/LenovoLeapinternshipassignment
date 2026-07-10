import { useEffect, useState } from "react";
import { GraduationCap, CheckCircle2, Clock, Circle } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";

const STATUS = {
  completed: { color: "var(--success)", label: "Completed", icon: <CheckCircle2 size={16} /> },
  "in-progress": { color: "var(--primary)", label: "In Progress", icon: <Clock size={16} /> },
  pending: { color: "var(--text-light)", label: "Pending", icon: <Circle size={16} /> },
};

export default function LearningRoadmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/roadmap").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  return (
    <Card>
      <CardHead title="Learning Roadmap" icon={<GraduationCap size={18} />} />
      <div className="timeline">
        {data.steps.map((s, i) => {
          const st = STATUS[s.status];
          return (
            <div className="tl-item" key={i} style={{ paddingBottom: i === data.steps.length - 1 ? 0 : 22 }}>
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 4,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: st.color,
                  border: "3px solid var(--surface)",
                  boxShadow: `0 0 0 2px ${st.color}`,
                }}
              />
              <div className="row between" style={{ alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ fontSize: 15 }}>{s.title}</h4>
                  <p className="muted" style={{ fontSize: 13, marginTop: 3 }}>{s.detail}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge
                    variant={s.status === "completed" ? "success" : s.status === "in-progress" ? "primary" : ""}
                  >
                    {st.icon} {st.label}
                  </Badge>
                  <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{s.weeks}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
