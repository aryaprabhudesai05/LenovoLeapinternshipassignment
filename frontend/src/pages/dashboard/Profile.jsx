import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Save,
  Award,
  Code2,
  UploadCloud,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Button, Badge } from "../../components/common";
import { Input, TextArea } from "../../components/forms/FormControls";
import CircularProgress from "../../components/ui/CircularProgress";

const toArr = (v) =>
  Array.isArray(v)
    ? v
    : String(v || "")
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

const initials = (name) =>
  (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

export default function Profile() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [snapshot, setSnapshot] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get("/profile")
      .then((d) => {
        setData(d || {});
        setForm({
          name: d?.name || "",
          role: d?.role || "",
          targetRole: d?.targetRole || "",
          phone: d?.phone || "",
          location: d?.location || "",
          college: d?.college || "",
          degree: d?.degree || "",
          branch: d?.branch || "",
          graduationYear: d?.graduationYear || "",
          linkedIn: d?.linkedIn || "",
          github: d?.github || "",
          skills: (d?.skills || []).join(", "),
          projects: (d?.projects || []).join("\n"),
          experience: (d?.experience || []).join("\n"),
          summary: d?.summary || "",
        });
      })
      .catch(() => {
        setError("We couldn't load your profile. Please try again.");
        toast.error("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const loadExtras = useCallback(() => {
    api
      .get("/dashboard")
      .then((d) => setSnapshot(d?.scores || null))
      .catch(() => {});
    api
      .get("/resume")
      .then((d) => setResumeName(d?.resumes?.[0]?.fileName || ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    loadExtras();
  }, [load, loadExtras]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: toArr(form.skills),
        projects: toArr(form.projects),
        experience: toArr(form.experience),
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      };
      const updated = await api.put("/profile", payload);
      setData((prev) => ({ ...prev, ...(updated || {}) }));
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onPhoto = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    try {
      const dataUrl = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const updated = await api.put("/profile", { profileImage: dataUrl });
      setData((prev) => ({ ...prev, ...(updated || {}), profileImage: dataUrl }));
      toast.success("Profile photo updated");
    } catch {
      toast.error("Could not update photo");
    }
  };

  const onResume = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.upload("/resume/upload", fd);
      setResumeName(file.name);
      toast.success("Resume uploaded");
    } catch {
      toast.error("Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const photo = data?.profileImage || data?.avatar || "";
  const skills = toArr(form.skills);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your personal and professional details. Stored privately per account.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <Card className="center mb-2" style={{ padding: 20 }}>
          <p className="muted">{error}</p>
          <Button variant="outline" className="mt-2" onClick={load}>
            Retry
          </Button>
        </Card>
      )}

      <div className="grid grid-3">
        <Card className="center">
          {photo ? (
            <img
              src={photo}
              alt=""
              style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              className="avatar"
              style={{
                width: 110,
                height: 110,
                fontSize: 36,
                background: "var(--primary-bg)",
                color: "var(--primary)",
              }}
            >
              {initials(form.name)}
            </div>
          )}
          <h3 style={{ marginTop: 12 }}>{form.name || "—"}</h3>
          <p className="muted" style={{ fontSize: 13 }}>{form.targetRole || form.role || "—"}</p>
          <div style={{ marginTop: 16 }}>
            <CircularProgress value={skills.length * 8} size={110} label="Skills" />
          </div>
        </Card>

        <Card className="span-2">
          <CardHead title="Basic Details" icon={<User size={18} />} />
          <div className="grid grid-2">
            <Input label="Full Name" value={form.name} onChange={set("name")} />
            <Input label="Target Role" value={form.targetRole} onChange={set("targetRole")} />
            <Input label="Phone" value={form.phone} onChange={set("phone")} />
            <Input label="Location" value={form.location} onChange={set("location")} />
            <Input label="College" value={form.college} onChange={set("college")} />
            <Input label="Degree" value={form.degree} onChange={set("degree")} />
            <Input label="Branch" value={form.branch} onChange={set("branch")} />
            <Input label="Graduation Year" type="number" value={form.graduationYear} onChange={set("graduationYear")} />
            <Input label="LinkedIn" value={form.linkedIn} onChange={set("linkedIn")} />
            <Input label="GitHub" value={form.github} onChange={set("github")} />
          </div>
          <TextArea label="Summary" value={form.summary} onChange={set("summary")} />
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Profile Photo" icon={<ImageIcon size={18} />} />
          <label className="dropzone" style={{ cursor: "pointer" }}>
            <UploadCloud size={34} color="var(--primary)" />
            <h4 style={{ marginTop: 12 }}>Upload a profile photo</h4>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>PNG, JPG up to 8MB</p>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
          </label>
        </Card>
        <Card>
          <CardHead title="Resume" icon={<FileText size={18} />} />
          <label className="dropzone" style={{ cursor: "pointer" }}>
            <UploadCloud size={34} color="var(--primary)" />
            <h4 style={{ marginTop: 12 }}>Upload your resume</h4>
            <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              {uploading ? "Uploading…" : resumeName ? `Latest: ${resumeName}` : "PDF, DOCX up to 8MB"}
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              hidden
              disabled={uploading}
              onChange={(e) => onResume(e.target.files?.[0])}
            />
          </label>
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Skills (comma separated)" icon={<Award size={18} />} />
          <TextArea value={form.skills} onChange={set("skills")} />
          <div className="row wrap" style={{ gap: 8, marginTop: 10 }}>
            {skills.map((s) => (
              <Badge key={s} variant="primary">
                {s}
              </Badge>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Projects (one per line)" icon={<Code2 size={18} />} />
          <TextArea value={form.projects} onChange={set("projects")} />
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead title="Experience (one per line)" icon={<Briefcase size={18} />} />
        <TextArea value={form.experience} onChange={set("experience")} />
      </Card>

      <Card className="mt-3">
        <CardHead title="Account" icon={<Mail size={18} />} />
        <div className="list">
          <Row icon={<User size={16} />} label="Full Name" value={data?.name} />
          <Row icon={<Mail size={16} />} label="Email" value={data?.email} />
          <Row icon={<Phone size={16} />} label="Phone" value={data?.phone} />
          <Row icon={<MapPin size={16} />} label="Location" value={data?.location} />
          <Row
            icon={<GraduationCap size={16} />}
            label="Education"
            value={[data?.college, data?.degree, data?.branch].filter(Boolean).join(", ")}
          />
        </div>
      </Card>

      {snapshot && (
        <Card className="mt-3">
          <CardHead title="Your Snapshot" icon={<Award size={18} />} />
          <div className="grid grid-2">
            <div className="list-item">
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                <Award size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12 }}>Career Score</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{snapshot.careerScore ?? "—"}</div>
              </div>
            </div>
            <div className="list-item">
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                <FileText size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12 }}>ATS Score</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{snapshot.atsScore ?? "—"}</div>
              </div>
            </div>
            <div className="list-item">
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                <Code2 size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12 }}>Roadmap Progress</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{snapshot.learningProgress ?? 0}%</div>
              </div>
            </div>
            <div className="list-item">
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                <User size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12 }}>Interviews</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{snapshot.interviewCount ?? 0}</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="list-item">
      <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div className="muted" style={{ fontSize: 12 }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{value || "—"}</div>
      </div>
    </div>
  );
}
