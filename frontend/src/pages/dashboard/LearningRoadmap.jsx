import { useEffect, useState } from "react";
import { GraduationCap, CheckCircle2, Circle, Clock, Trophy, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button } from "../../components/common";

const statusColor = { completed: "var(--success)", "in-progress": "var(--primary)", pending: "var(--text-light)" };

export default function LearningRoadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/roadmap")
      .then(setData)
      .catch(() => setError("Could not load your learning roadmap."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const generate = async () => {
    setBusy(true);
    try {
      const d = await api.post("/roadmap", { goal: "Full Stack Developer" });
      setData(d);
      toast.success("Roadmap generated");
    } catch {
      toast.error("Failed to generate roadmap");
    } finally {
      setBusy(false);
    }
  };

  const steps = data?.steps || data?.roadmap?.steps || [];
  const done = steps.filter((s) => s.status === "completed").length;
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0;

  if (loading) return <Skeleton height={320} />;

  if (error) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Learning Roadmap</h1>
            <p>Your personalized 16-week path to your dream role.</p>
          </div>
        </div>
        <Card className="center" style={{ padding: 30 }}>
          <p className="muted">{error}</p>
          <Button variant="outline" className="mt-2" onClick={load}><RefreshCw size={16} /> Retry</Button>
        </Card>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Learning Roadmap</h1>
            <p>Your personalized 16-week path to your dream role.</p>
          </div>
        </div>
        <Card className="center" style={{ padding: 30 }}>
          <p className="muted">No roadmap yet. Generate one to start tracking your progress.</p>
          <Button className="mt-2" onClick={generate} disabled={busy}><RefreshCw size={16} /> Generate Roadmap</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Learning Roadmap</h1>
          <p>Your personalized 16-week path to your dream role.</p>
        </div>
        <Button variant="outline" onClick={generate} disabled={busy}><RefreshCw size={16} /> {data ? "Regenerate" : "Generate"}</Button>
      </div>

      <div className="grid grid-3">
        <Card className="center">
          <CardHead title="Overall Progress" />
          <div style={{ fontSize: 40, fontWeight: 800, color: "var(--primary)" }}>{progress}%</div>
          <p className="muted" style={{ fontSize: 13 }}>{done} of {steps.length} steps complete</p>
          <div className="divider" />
          <div className="row wrap" style={{ gap: 8, justifyContent: "center" }}>
            <Badge variant="success"><CheckCircle2 size={13} /> {done} done</Badge>
            <Badge variant="primary"><Clock size={13} /> 1 active</Badge>
            <Badge><Circle size={13} /> {steps.length - done - 1} pending</Badge>
          </div>
        </Card>

        <Card className="span-2">
          <CardHead title="Roadmap Timeline" icon={<GraduationCap size={18} />} />
          <div className="timeline" style={{ marginTop: 10 }}>
            {steps.map((s) => (
              <div key={s.title} className="tl-item">
                <h4>{s.title}</h4>
                <p>{s.detail}</p>
                <div className="row" style={{ gap: 8, marginTop: 6 }}>
                  <Badge variant="primary">{s.weeks} weeks</Badge>
                  <Badge
                    variant={
                      s.status === "completed" ? "success" : s.status === "in-progress" ? "primary" : ""
                    }
                  >
                    {s.status === "completed" ? <CheckCircle2 size={12} /> : s.status === "in-progress" ? <Clock size={12} /> : <Circle size={12} />} {s.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead title="Step Breakdown" icon={<Trophy size={18} />} />
        {steps.map((s) => (
          <div key={s.title} className="row" style={{ gap: 12, marginBottom: 16 }}>
            {s.status === "completed" ? (
              <CheckCircle2 size={22} color="var(--success)" />
            ) : s.status === "in-progress" ? (
              <Clock size={22} color="var(--primary)" />
            ) : (
              <Circle size={22} color="var(--text-light)" />
            )}
            <div style={{ flex: 1 }}>
              <div className="row between">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                <span className="muted" style={{ fontSize: 12 }}>{s.weeks}</span>
              </div>
              <div className="progress" style={{ marginTop: 6 }}>
                <span
                  style={{
                    width: s.status === "completed" ? "100%" : s.status === "in-progress" ? "50%" : "0%",
                    background: statusColor[s.status],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
