import { useEffect, useState } from "react";
import { UploadCloud, FileText, ScanSearch, CheckCircle2, AlertTriangle, Lightbulb, History, GitCompareArrows } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, Button } from "../../components/common";
import CircularProgress from "../../components/ui/CircularProgress";
import FileUpload from "../../components/forms/FileUpload";

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [comparison, setComparison] = useState(null);

  const load = () => {
    api.get("/resume").then((d) => {
      setResumes(d.resumes || []);
      if ((d.resumes || []).length) setSelected(d.resumes[0]);
    }).catch(() => {});
  };
  useEffect(load, []);

  const upload = async (file) => {
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!allowed.includes(ext)) {
      toast.error("Unsupported file. Upload a PDF, DOC/DOCX, TXT, or an image (PNG/JPG).");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.upload("/resume/upload", form);
      toast.success("Resume analyzed");
      if (res?.notice) toast(res.notice, { icon: "⚠️" });
      load();
      setSelected(res);
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed. Please try a different file.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const toggleCompare = (id) => {
    setComparison(null);
    setCompareIds((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 2 ? [...c, id] : [c[1], id]));
  };

  const runCompare = async () => {
    if (compareIds.length !== 2) return toast.error("Select two resumes to compare");
    try {
      const d = await api.get(`/resume/compare?a=${compareIds[0]}&b=${compareIds[1]}`);
      setComparison(d);
    } catch {
      toast.error("Comparison failed");
    }
  };

  if (!resumes.length && !selected) {
    return (
      <div>
        <div className="page-header">
          <div><h1>Resume Analyzer</h1><p>Upload your resume to extract insights and scores.</p></div>
        </div>
        <Card><FileUpload onFile={upload} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif,.bmp" label={busy ? "Analyzing..." : "Drop your resume or image (PDF/DOCX/PNG/JPG)"} /></Card>
        {busy && <Skeleton height={120} className="mt-3" />}
      </div>
    );
  }

  const ex = selected?.extracted || {};

  return (
    <div>
      <div className="page-header">
        <div><h1>Resume Analyzer</h1><p>Extracted insights from your resume.</p></div>
        <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()}><UploadCloud size={16} /> Upload New</Button>
      </div>
      <input id="file-input" type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif,.bmp" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />

      <div className="grid grid-3">
        <Card className="center">
          <CardHead title="Resume Score" icon={<FileText size={18} />} />
          <CircularProgress value={selected?.resumeScore ?? 0} size={150} />
          <div className="row" style={{ gap: 12, marginTop: 10 }}>
            <Badge variant="success">ATS {selected?.atsScore ?? 0}</Badge>
            <Badge variant="primary">Career {selected?.careerScore ?? 0}</Badge>
          </div>
        </Card>
        <Card className="span-2">
          <CardHead title={selected?.fileName || "Resume"} icon={<ScanSearch size={18} />} />
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{selected?.summary || "No summary yet."}</p>
          <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
            {(ex.technicalSkills || []).map((s) => <Badge key={s} variant="primary">{s}</Badge>)}
          </div>
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Strengths & Weaknesses" icon={<CheckCircle2 size={18} />} />
          {(ex.strengths || []).map((s) => <div key={s} className="row" style={{ gap: 8, marginBottom: 8 }}><CheckCircle2 size={16} color="var(--success)" /><span style={{ fontSize: 14 }}>{s}</span></div>)}
          {(ex.weaknesses || []).map((w) => <div key={w} className="row" style={{ gap: 8, marginBottom: 8 }}><AlertTriangle size={16} color="var(--warning)" /><span style={{ fontSize: 14 }}>{w}</span></div>)}
        </Card>
        <Card>
          <CardHead title="Suggestions" icon={<Lightbulb size={18} />} />
          {(selected?.suggestions || []).map((s) => (
            <div key={s} className="row" style={{ gap: 10, marginBottom: 8 }}>
              <span className="badge primary">Tip</span><span style={{ fontSize: 14 }}>{s}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead title={`Resume History (${resumes.length})`} icon={<History size={18} />} action={
          <Button variant="outline" onClick={runCompare} disabled={compareIds.length !== 2}><GitCompareArrows size={16} /> Compare</Button>
        } />
        <div className="list">
          {resumes.map((r) => (
            <div key={r.id} className="list-item" style={{ cursor: "pointer", borderColor: selected?.id === r.id ? "var(--primary)" : "var(--border)" }} onClick={() => setSelected(r)}>
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}><FileText size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{r.fileName}</div>
                <div className="muted" style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <label className="row" style={{ gap: 6, cursor: "pointer" }} onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={compareIds.includes(r.id)} onChange={() => toggleCompare(r.id)} />
              </label>
              <Badge variant="success">{r.resumeScore}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {comparison && (
        <Card className="mt-3">
          <CardHead title="Comparison" icon={<GitCompareArrows size={18} />} />
          <div className="grid grid-2">
            {[comparison.a, comparison.b].map((r, i) => (
              <div key={i}>
                <h4 style={{ fontSize: 14 }}>{r.fileName}</h4>
                <div className="row" style={{ gap: 8 }}>
                  <Badge variant="success">Resume {r.resumeScore}</Badge>
                  <Badge variant="primary">ATS {r.atsScore}</Badge>
                  <Badge variant="warning">Career {r.careerScore}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
