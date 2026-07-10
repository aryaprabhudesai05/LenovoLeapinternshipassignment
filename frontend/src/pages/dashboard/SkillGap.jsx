import { useEffect, useState } from "react";
import { Target, BookOpen, GraduationCap, TrendingUp, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button, Input, TextArea } from "../../components/common";
import BarChart from "../../components/charts/BarChart";

export default function SkillGap() {
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [required, setRequired] = useState("");
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/skill")
      .then((d) => setSkillGap(d?.skillGap ?? (d?.gaps ? d : null)))
      .catch(() => setError("Could not load your skill gap analysis."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const analyze = async () => {
    if (!required.trim()) return toast.error("Enter at least one required skill");
    setBusy(true);
    try {
      const req = required.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
      const d = await api.post("/skill", { targetRole, required: req });
      setSkillGap(d);
      toast.success("Skill gap analyzed");
    } catch {
      toast.error("Failed to analyze skill gap");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Skeleton height={320} />;

  const gaps = skillGap?.gaps || [];
  const courses = skillGap?.courses || [];
  const gapData = gaps.map((g) => ({ name: g.skill, current: g.level, required: g.required }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Skill Gap Detection</h1>
          <p>Compare your skills against a target role.</p>
        </div>
        {skillGap && (
          <Button variant="outline" onClick={load}><RefreshCw size={16} /> Refresh</Button>
        )}
      </div>

      <Card className="mb-2">
        <CardHead title="Analyze" icon={<Target size={18} />} />
        <div className="grid grid-2">
          <Input label="Target Role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Full Stack Developer" />
          <div className="field">
            <label>Required Skills (comma separated)</label>
            <TextArea value={required} onChange={(e) => setRequired(e.target.value)} placeholder="React, Node.js, MongoDB" />
          </div>
        </div>
        <Button onClick={analyze} disabled={busy}><TrendingUp size={16} /> Analyze Gap</Button>
      </Card>

      {error ? (
        <Card className="center" style={{ padding: 30 }}>
          <p className="muted">{error}</p>
          <Button variant="outline" className="mt-2" onClick={load}><RefreshCw size={16} /> Retry</Button>
        </Card>
      ) : !skillGap ? (
        <Card className="center" style={{ padding: 30 }}>
          <p className="muted">Enter a target role and required skills to see your gap analysis.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-2">
            <Card>
              <CardHead title="Current vs Required" icon={<Target size={18} />} />
              {gapData.length ? (
                <BarChart data={gapData} xKey="name" dataKey="required" color="#3b82f6" />
              ) : (
                <p className="muted" style={{ fontSize: 13 }}>No gaps — you have all required skills!</p>
              )}
              <div className="row" style={{ gap: 12, marginTop: 8 }}>
                <span className="row" style={{ gap: 6, fontSize: 12 }}><span style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: 3 }} /> Required</span>
                <span className="row" style={{ gap: 6, fontSize: 12 }}><span style={{ width: 12, height: 12, background: "var(--warning)", borderRadius: 3 }} /> Current</span>
              </div>
            </Card>

            <Card>
              <CardHead title="Gap Detail" icon={<TrendingUp size={18} />} />
              {gaps.length ? (
                gaps.map((g) => {
                  const gap = Math.max(0, g.required - g.level);
                  return (
                    <div key={g.skill} style={{ marginBottom: 16 }}>
                      <div className="row between" style={{ fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600 }}>{g.skill}</span>
                        <Badge variant={g.priority === "High" ? "danger" : "warning"}>{g.priority}</Badge>
                      </div>
                      <div className="row" style={{ gap: 8, alignItems: "center" }}>
                        <div className="progress" style={{ flex: 1 }}>
                          <span style={{ width: `${g.level}%`, background: "var(--warning)" }} />
                        </div>
                        <span className="muted" style={{ fontSize: 12, minWidth: 64, textAlign: "right" }}>{g.level} / {g.required}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="muted" style={{ fontSize: 13 }}>No gap details available yet.</p>
              )}
            </Card>
          </div>

          <Card className="mt-3">
            <CardHead title="Recommended Courses" icon={<BookOpen size={18} />} />
            {courses.length ? (
              <div className="grid grid-3">
                {courses.map((c) => (
                  <div key={c.skill} className="list-item">
                    <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}><GraduationCap size={18} /></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 14 }}>{c.course}</h4>
                      <p className="muted" style={{ fontSize: 13 }}>For: {c.skill}</p>
                    </div>
                    <Badge>{c.hours} hrs</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted" style={{ fontSize: 13 }}>No course recommendations yet.</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
