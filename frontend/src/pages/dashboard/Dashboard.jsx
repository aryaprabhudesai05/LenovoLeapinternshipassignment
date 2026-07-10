import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ScanSearch, GraduationCap, Briefcase, ArrowRight, Activity, Bell } from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/cards/StatCard";
import CircularProgress from "../../components/ui/CircularProgress";
import { Card, CardHead, Skeleton, Badge, Button } from "../../components/common";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

const fmt = (v) => (v === null || v === undefined ? "—" : `${v}%`);

export default function Dashboard() {
  const [dash, setDash] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(setDash).catch(() => setDash({}));
    api.get("/analytics").then(setAnalytics).catch(() => setAnalytics(null));
  }, []);

  if (!dash)
    return (
      <div className="grid grid-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <Skeleton height={20} />
            <Skeleton height={40} width={120} />
          </Card>
        ))}
      </div>
    );

  const c = dash.candidate || {};
  const s = dash.scores || {};
  const cards = [
    { label: "Career Score", value: fmt(s.careerScore), icon: <Trophy size={20} />, color: "var(--primary)" },
    { label: "ATS Score", value: fmt(s.atsScore), icon: <ScanSearch size={20} />, color: "var(--info)" },
    { label: "Learning Progress", value: fmt(s.learningProgress), icon: <GraduationCap size={20} />, color: "var(--success)" },
    { label: "Job Match", value: fmt(s.jobMatch), icon: <Briefcase size={20} />, color: "var(--warning)" },
  ];

  const interviewPerf = analytics?.interviewPerformance || [];
  const resumeHistory = analytics?.resumeScoreHistory || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="hero">
        <div>
          <h1>Welcome back, {c.name || "Candidate"} 👋</h1>
          <p>
            {c.email}
            {c.targetRole ? ` · Targeting ${c.targetRole}` : ""}
          </p>
          <Link to="/dashboard/resume" className="btn btn-primary mt-2">
            Analyze Resume <ArrowRight size={16} />
          </Link>
        </div>
        <CircularProgress value={s.readiness ?? 0} label="Readiness" size={150} />
      </div>

      <div className="grid grid-4 mt-3">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Latest Learning Roadmap" icon={<GraduationCap size={18} />} action={<Link to="/dashboard/roadmap" className="badge primary">Open</Link>} />
          {dash.latestRoadmap ? (
            <>
              <p className="muted" style={{ fontSize: 13, marginBottom: 10 }}>{dash.latestRoadmap.goal}</p>
              <div className="list">
                {dash.latestRoadmap.steps.slice(0, 4).map((st, i) => (
                  <div key={i} className="list-item">
                    <Badge variant={st.status === "completed" ? "success" : "warning"}>{st.weeks}</Badge>
                    <span style={{ fontSize: 14 }}>{st.title}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>No roadmap yet. Generate one to get started.</p>
          )}
        </Card>

        <Card>
          <CardHead title="Latest Interview" icon={<Trophy size={18} />} action={<Link to="/dashboard/interview" className="badge primary">Practice</Link>} />
          {dash.latestInterview ? (
            <>
              <div className="row between" style={{ margin: "10px 0" }}>
                <div>
                  <h4 style={{ fontSize: 16 }}>{dash.latestInterview.company}</h4>
                  <p className="muted" style={{ fontSize: 13 }}>{dash.latestInterview.role}</p>
                </div>
                <CircularProgress value={dash.latestInterview.overallScore ?? 0} size={90} />
              </div>
              <p className="muted" style={{ fontSize: 13 }}>{dash.interviewCount} interview(s) completed</p>
            </>
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>No interviews yet. Start a mock interview.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Recent Activity" icon={<Activity size={18} />} />
          <div className="list">
            {(dash.activity || []).map((a, i) => (
              <div key={i} className="list-item">
                <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                  <Activity size={16} />
                </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{a.text}</div>
                <div className="muted" style={{ fontSize: 12 }}>{a.at ? new Date(a.at).toLocaleDateString() : "—"}</div>
              </div>
              </div>
            ))}
            {(dash.activity || []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>No activity yet.</p>}
          </div>
        </Card>

        <Card>
          <CardHead title="Notifications" icon={<Bell size={18} />} />
          <div className="list">
            {(dash.notifications || []).map((n) => (
              <div key={n.id} className="list-item">
                <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}>
                  <Bell size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{n.title || n.message}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{!n.read ? "New" : "Read"}</div>
                </div>
              </div>
            ))}
            {(dash.notifications || []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>No notifications.</p>}
          </div>
        </Card>
      </div>

      {analytics && (
        <div className="grid grid-2 mt-3">
          <Card>
            <CardHead title="Interview Performance" icon={<Trophy size={18} />} />
            {interviewPerf.length ? (
              <BarChart data={interviewPerf} xKey="label" dataKey="score" />
            ) : (
              <p className="muted" style={{ fontSize: 13 }}>Complete an interview to see performance.</p>
            )}
          </Card>
          <Card>
            <CardHead title="Resume Score History" icon={<ScanSearch size={18} />} />
            {resumeHistory.length ? (
              <LineChart data={resumeHistory.map((r, i) => ({ name: `v${i + 1}`, value: r.score }))} xKey="name" lines={[{ key: "value", color: "#e53935" }]} />
            ) : (
              <p className="muted" style={{ fontSize: 13 }}>Upload a resume to track your score.</p>
            )}
          </Card>
        </div>
      )}
    </motion.div>
  );
}
