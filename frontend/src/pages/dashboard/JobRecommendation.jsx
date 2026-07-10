import { useEffect, useState } from "react";
import { Briefcase, MapPin, Clock, IndianRupee, Search, Sparkles, History } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button, Input, Select } from "../../components/common";

const COMPANIES = ["Google", "Microsoft", "Amazon", "Lenovo", "Infosys", "TCS", "Wipro", "Accenture", "Cognizant", "Capgemini"];
const LOCATIONS = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi", "Remote"];
const EXPERIENCE = ["Fresher", "1-2 years", "3-5 years", "5+ years"];

export default function JobRecommendation() {
  const [allJobs, setAllJobs] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ company: "Lenovo", role: "Frontend Developer", location: "Bengaluru", experience: "Fresher" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = () =>
    api
      .get("/jobs")
      .then((d) => setAllJobs(d.jobs || []))
      .catch(() => setError("Could not load jobs."))
      .finally(() => setLoading(false));
  const loadHistory = () =>
    api
      .get("/recommendations")
      .then((d) => setHistory(d.recommendations || []))
      .catch(() => {});
  useEffect(() => { loadAll(); loadHistory(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const recommend = async () => {
    setBusy(true);
    try {
      const rec = await api.post("/jobs/recommend", form);
      setRecommended(rec);
      toast.success("Recommendations ready");
      loadHistory();
    } catch {
      toast.error("Could not load recommendations");
    } finally {
      setBusy(false);
    }
  };

  const jobs = recommended?.jobs || allJobs;

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1>Job Recommendations</h1>
            <p>AI-matched roles based on your skills and goals.</p>
          </div>
        </div>
        <Skeleton height={320} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Job Recommendations</h1>
          <p>AI-matched roles based on your skills and goals.</p>
        </div>
        <Button variant="outline" onClick={loadHistory}><History size={16} /> History ({history.length})</Button>
      </div>

      <Card className="mb-2">
        <CardHead title="Get Personalized Matches" icon={<Sparkles size={18} />} />
        <div className="grid grid-2">
          <Select label="Company" options={COMPANIES} value={form.company} onChange={set("company")} />
          <Input label="Role" value={form.role} onChange={set("role")} />
          <Select label="Location" options={LOCATIONS} value={form.location} onChange={set("location")} />
          <Select label="Experience" options={EXPERIENCE} value={form.experience} onChange={set("experience")} />
        </div>
        <Button className="mt-2" onClick={recommend} disabled={busy}><Search size={16} /> {busy ? "Finding..." : "Find Matching Jobs"}</Button>
      </Card>

      <div className="grid grid-2">
        {jobs.map((job) => (
          <Card key={job._id || job.id} hover>
            <div className="row between">
              <div className="row" style={{ gap: 14 }}>
                <div className="avatar">{job.company?.[0] || "?"}</div>
                <div>
                  <h4 style={{ fontSize: 16 }}>{job.title}</h4>
                  <p className="muted" style={{ fontSize: 13 }}>{job.company}</p>
                </div>
              </div>
              {job.match !== undefined && <Badge variant="success">{job.match}% match</Badge>}
            </div>

            <div className="row wrap" style={{ gap: 16, margin: "14px 0" }}>
              <span className="muted row" style={{ gap: 6, fontSize: 13 }}><MapPin size={14} /> {job.location}</span>
              <span className="muted row" style={{ gap: 6, fontSize: 13 }}><Clock size={14} /> {job.type}</span>
              <span className="muted row" style={{ gap: 6, fontSize: 13 }}><IndianRupee size={14} /> {job.salary}</span>
            </div>

            {job.missingSkills?.length > 0 && (
              <div className="row wrap" style={{ gap: 6, marginBottom: 10 }}>
                {job.missingSkills.map((s) => <Badge key={s} variant="danger">{s}</Badge>)}
              </div>
            )}
            {job.tips?.length > 0 && (
              <p className="muted" style={{ fontSize: 13 }}>💡 {job.tips[0]}</p>
            )}

            <div className="progress" style={{ marginTop: job.match !== undefined ? 10 : 0 }}>
              <span style={{ width: `${job.match ?? 80}%` }} />
            </div>

            <Button className="mt-2" variant="outline" style={{ width: "100%" }}>View &amp; Apply</Button>
          </Card>
        ))}
        {jobs.length === 0 && (
          <Card className="center span-2" style={{ padding: 30 }}>
            <p className="muted">No jobs to show yet. Use the form above to get personalized matches.</p>
          </Card>
        )}
      </div>

      {error && (
        <Card className="mt-3 center" style={{ padding: 20 }}>
          <p className="muted">{error}</p>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-3">
          <CardHead title="Past Recommendations" icon={<History size={18} />} />
          <div className="list">
            {history.map((h) => (
              <div key={h.id} className="list-item" style={{ cursor: "pointer" }} onClick={() => setRecommended(h)}>
                <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}><Briefcase size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{h.role} @ {h.company}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{h.location} · {new Date(h.createdAt).toLocaleDateString()}</div>
                </div>
                <Badge variant="primary">{(h.jobs || []).length} roles</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
