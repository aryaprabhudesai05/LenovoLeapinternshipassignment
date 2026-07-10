import { useEffect, useState } from "react";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button } from "../../components/common";

export default function RecentJobs() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/jobs").then(setData);
  }, []);

  if (!data) return <Skeleton height={320} />;

  return (
    <Card>
      <CardHead
        title="Recent Jobs"
        icon={<Briefcase size={18} />}
        action={<Badge variant="primary">{data.jobs.length} matches</Badge>}
      />
      <div className="list">
        {data.jobs.map((j) => (
          <div key={j.id} className="list-item">
            <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
              <Briefcase size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8 }}>
                <h4 style={{ fontSize: 14 }}>{j.title}</h4>
                <Badge variant="success">{j.match}% match</Badge>
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                {j.company} · <MapPin size={12} style={{ verticalAlign: "-2px" }} /> {j.location}
              </p>
              <div className="row wrap" style={{ gap: 6, marginTop: 6 }}>
                <Badge>{j.type}</Badge>
                <span className="badge primary">{j.salary}</span>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Apply <ArrowRight size={14} />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
