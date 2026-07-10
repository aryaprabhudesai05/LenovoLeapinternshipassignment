import { useEffect, useState } from "react";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, ProgressBar } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";

export default function ResumeCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/resume").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  return (
    <Card>
      <CardHead title="Resume Card" icon={<FileText size={18} />} />
      <div className="row" style={{ gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div className="center">
          <CircularProgress value={data.score} size={120} label="Resume" />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div className="muted" style={{ fontSize: 13 }}>{data.fileName}</div>
          <Badge variant="success" className="mt-2">{data.score > 80 ? "Strong" : "Good"}</Badge>
          <div className="row wrap mt-2" style={{ gap: 6 }}>
            {data.strengths.map((s) => (
              <Badge key={s} variant="success"><CheckCircle2 size={13} /> {s}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.sections.map((s) => (
          <div key={s.name}>
            <div className="row between" style={{ fontSize: 13, marginBottom: 6 }}>
              <span>{s.name}</span>
              <span style={{ fontWeight: 700 }}>{s.score}%</span>
            </div>
            <ProgressBar
              value={s.score}
              color={s.score > 85 ? "var(--success)" : "var(--warning)"}
            />
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="row wrap" style={{ gap: 6 }}>
        {data.weaknesses.map((w) => (
          <Badge key={w} variant="warning"><AlertCircle size={13} /> {w}</Badge>
        ))}
      </div>
    </Card>
  );
}
