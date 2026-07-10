import { useEffect, useState } from "react";
import { BrainCircuit, TrendingUp, CheckCircle2, AlertTriangle, Briefcase, Target, Sparkles, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";
import ProgressCard from "../../components/cards/ProgressCard";

export default function CareerAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/career").then((d) => setAnalysis(d.analysis)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const generate = async () => {
    setBusy(true);
    try {
      const d = await api.post("/career", {});
      setAnalysis(d);
      toast.success("Career analysis generated");
    } catch {
      toast.error("Failed to generate analysis");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Skeleton height={320} />;

  if (!analysis)
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Career Analysis</h1>
            <p>AI insights into your career trajectory and market fit.</p>
          </div>
        </div>
        <Card className="center" style={{ padding: 40 }}>
          <BrainCircuit size={40} color="var(--primary)" />
          <p className="muted" style={{ margin: "12px 0" }}>No analysis yet. Generate one based on your profile.</p>
          <Button onClick={generate} disabled={busy}><RefreshCw size={16} /> Generate Analysis</Button>
        </Card>
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Career Analysis</h1>
          <p>AI insights into your career trajectory and market fit.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <Badge variant="primary">Path: {analysis.path}</Badge>
          <Button variant="outline" onClick={generate} disabled={busy}><RefreshCw size={16} /> Regenerate</Button>
        </div>
      </div>

      <div className="grid grid-3">
        <Card>
          <CardHead title="Market Demand" icon={<TrendingUp size={18} />} />
          <div className="center" style={{ padding: 10 }}>
            <CircularProgress value={analysis.marketDemand ?? 0} size={150} color="var(--success)" />
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Industry demand</p>
          </div>
        </Card>
        <Card>
          <CardHead title="Role Fit" icon={<Briefcase size={18} />} />
          <div className="center" style={{ padding: 10 }}>
            <CircularProgress value={analysis.fit ?? 0} size={150} color="var(--info)" />
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Fit for {analysis.path}</p>
          </div>
        </Card>
        <Card>
          <CardHead title="Summary" icon={<BrainCircuit size={18} />} />
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-muted)" }}>{analysis.summary}</p>
          <div className="divider" />
          <div className="row wrap" style={{ gap: 6 }}>
            <Badge variant="primary"><Target size={13} /> {analysis.path}</Badge>
            <Badge variant="success"><Sparkles size={13} /> AI Generated</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Your Strengths" icon={<CheckCircle2 size={18} />} />
          {(analysis.strengths || []).map((s, i) => (
            <ProgressCard key={s} title={s} value={90 - i * 4} color="var(--success)" />
          ))}
        </Card>
        <Card>
          <CardHead title="Focus Areas" icon={<AlertTriangle size={18} />} />
          {(analysis.improvements || []).map((s, i) => (
            <ProgressCard key={s} title={s} value={70 - i * 6} color="var(--warning)" />
          ))}
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead title="Recommended Roles" icon={<Briefcase size={18} />} />
        {(analysis.roles || []).map((r) => (
          <div key={r.title} style={{ marginBottom: 16 }}>
            <div className="row between" style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 600 }}>{r.title}</span>
              <span style={{ fontWeight: 800, color: "var(--primary)" }}>{r.match}% match</span>
            </div>
            <ProgressCard title="" value={r.match} />
          </div>
        ))}
        <div className="divider" />
        <div className="row wrap" style={{ gap: 10 }}>
          <span className="muted" style={{ fontSize: 13 }}>Top companies:</span>
          {(analysis.topCompanies || []).map((c) => <Badge key={c} variant="primary">{c}</Badge>)}
        </div>
        {analysis.salaryPrediction && (
          <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>Salary: {analysis.salaryPrediction}</p>
        )}
      </Card>
    </div>
  );
}
