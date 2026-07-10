import { useEffect, useState } from "react";
import { ScanSearch, CheckCircle2, XCircle, Lightbulb, FileCheck2, RefreshCw, History } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Button, Badge, Skeleton, Input } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";

export default function ATSChecker() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/ats")
      .then((d) => {
        const results = d.results || d.atsResults || [];
        setHistory(results);
        if (results.length) setResult(results[0]);
      })
      .catch(() => setError("Could not load ATS history."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const scan = async () => {
    setBusy(true);
    try {
      const res = await api.post("/ats", { targetRole });
      setResult(res);
      toast.success("ATS check complete");
      load();
    } catch {
      toast.error("ATS scan failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Skeleton height={300} />;

  if (error && !result) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>ATS Resume Checker</h1>
            <p>Optimize your resume for Applicant Tracking Systems.</p>
          </div>
        </div>
        <Card className="center" style={{ padding: 30 }}>
          <p className="muted">{error}</p>
          <Button variant="outline" className="mt-2" onClick={load}><RefreshCw size={16} /> Retry</Button>
        </Card>
      </div>
    );
  }

  const coverage = result && result.keywordsFound?.length
    ? Math.round((result.keywordsFound.length / (result.keywordsFound.length + (result.keywordsMissing?.length || 0))) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>ATS Resume Checker</h1>
          <p>Optimize your resume for Applicant Tracking Systems.</p>
        </div>
        <Button variant="outline" onClick={() => setHistory((h) => h)}><History size={16} /> History ({history.length})</Button>
      </div>

      <Card className="mb-2">
        <CardHead title="Run a Scan" icon={<ScanSearch size={18} />} />
        <div className="grid grid-2">
          <Input label="Target Role (optional)" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Frontend Developer" />
        </div>
        <Button onClick={scan} disabled={busy} className="mt-2"><RefreshCw size={16} /> {busy ? "Scanning..." : "Run ATS Scan"}</Button>
      </Card>

      {!result && (
        <Card className="center mt-3" style={{ padding: 30 }}>
          <p className="muted">No ATS scan yet. Run a scan above to check how your resume scores.</p>
        </Card>
      )}

      {result && (
        <>
          <div className="grid grid-3">
            <Card className="center">
              <CardHead title="ATS Score" icon={<ScanSearch size={18} />} />
              <CircularProgress value={result.score} size={160} />
              <Badge variant={result.score > 75 ? "success" : "warning"} className="mt-2">
                {result.score > 75 ? "ATS Friendly" : "Needs Work"}
              </Badge>
              <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>Keyword coverage: {coverage}%</p>
            </Card>

            <Card>
              <CardHead title="Keywords Found" icon={<CheckCircle2 size={18} />} />
              <div className="row wrap" style={{ gap: 8 }}>
                {(result.keywordsFound || []).map((k) => <Badge key={k} variant="success"><CheckCircle2 size={14} /> {k}</Badge>)}
              </div>
              <div className="divider" />
              <div className="row" style={{ gap: 10 }}>
                <FileCheck2 size={18} color="var(--success)" />
                <span className="muted" style={{ fontSize: 13 }}>Resume parses cleanly</span>
              </div>
            </Card>

            <Card>
              <CardHead title="Missing Keywords" icon={<XCircle size={18} />} />
              <div className="row wrap" style={{ gap: 8 }}>
                {(result.keywordsMissing || []).map((k) => <Badge key={k} variant="danger"><XCircle size={14} /> {k}</Badge>)}
              </div>
              <div className="divider" />
              <div className="row" style={{ gap: 10 }}>
                <XCircle size={18} color="var(--danger)" />
                <span className="muted" style={{ fontSize: 13 }}>Add these to boost score</span>
              </div>
            </Card>
          </div>

          <Card className="mt-3">
            <CardHead title="Optimization Tips" icon={<Lightbulb size={18} />} />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {(result.tips || []).map((t) => (
                <li key={t} className="row" style={{ gap: 10 }}>
                  <span className="badge primary">Tip</span>
                  <span style={{ fontSize: 14 }}>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      {history.length > 0 && (
        <Card className="mt-3">
          <CardHead title="Scan History" icon={<History size={18} />} />
          <div className="list">
            {history.map((h) => (
              <div key={h.id} className="list-item" style={{ cursor: "pointer" }} onClick={() => setResult(h)}>
                <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}><ScanSearch size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{h.targetRole || "General scan"}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{new Date(h.createdAt).toLocaleDateString()}</div>
                </div>
                <Badge variant={h.score > 75 ? "success" : "warning"}>{h.score}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
