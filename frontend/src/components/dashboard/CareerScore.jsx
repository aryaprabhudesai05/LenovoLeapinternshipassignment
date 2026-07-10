import { useEffect, useState } from "react";
import { Trophy, FileText, Activity, Target, ScanSearch } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";

export default function CareerScore() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  const tiles = [
    { label: "Resume Score", value: data.resumeScore, icon: <FileText size={16} />, color: "var(--success)" },
    { label: "Profile Strength", value: data.profileStrength, icon: <Activity size={16} />, color: "var(--info)" },
    { label: "Career Readiness", value: data.readiness, icon: <Target size={16} />, color: "var(--warning)" },
    { label: "ATS Score", value: data.atsScore, icon: <ScanSearch size={16} />, color: "var(--primary)" },
  ];

  return (
    <Card>
      <CardHead title="Career Score" icon={<Trophy size={18} />} />
      <div className="row" style={{ gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div className="center">
          <CircularProgress value={data.careerScore} size={150} label="Overall" />
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {tiles.map((t) => (
              <div
                key={t.label}
                className="row"
                style={{
                  gap: 10,
                  padding: 12,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-2)",
                }}
              >
                <span
                  className="icon"
                  style={{
                    width: 32,
                    height: 32,
                    background: "var(--primary-bg)",
                    color: t.color,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 9,
                  }}
                >
                  {t.icon}
                </span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{t.value}%</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>{t.label}</div>
                </div>
              </div>
            ))}
          </div>
          <Badge variant={data.careerScore > 80 ? "success" : "warning"} className="mt-2">
            {data.careerScore > 80 ? "On track to your goal" : "Needs attention"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
