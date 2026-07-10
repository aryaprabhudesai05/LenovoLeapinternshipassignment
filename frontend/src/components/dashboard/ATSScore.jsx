import { useEffect, useState } from "react";
import { ScanSearch, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";

export default function ATSScore() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/ats").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  return (
    <Card>
      <CardHead title="ATS Score" icon={<ScanSearch size={18} />} />
      <div className="center" style={{ padding: "6px 0 14px" }}>
        <CircularProgress value={data.score} size={140} />
        <Badge variant={data.score > 75 ? "success" : "warning"} className="mt-2">
          {data.score > 75 ? "ATS Friendly" : "Needs Work"}
        </Badge>
      </div>

      <div className="row wrap" style={{ gap: 16 }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
            Keywords Found
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            {data.keywordsFound.map((k) => (
              <Badge key={k} variant="success"><CheckCircle2 size={13} /> {k}</Badge>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
            Missing Keywords
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            {data.keywordsMissing.map((k) => (
              <Badge key={k} variant="danger"><XCircle size={13} /> {k}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="muted" style={{ fontSize: 12, marginBottom: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <Lightbulb size={14} /> Optimization Tips
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {data.tips.map((t) => (
          <li key={t} className="row" style={{ gap: 8, fontSize: 13 }}>
            <span className="badge primary">Tip</span>
            <span className="muted">{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
