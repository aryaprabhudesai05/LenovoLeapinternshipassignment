import { useEffect, useState } from "react";
import { BarChart3, Users, FileText, MessageCircle } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton } from "../../components/common";
import LineChart from "../../components/charts/LineChart";
import RadarChart from "../../components/charts/RadarChart";
import BarChart from "../../components/charts/BarChart";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics").then(setData).catch(() => setData({}));
  }, []);

  if (!data) return <Skeleton height={320} />;

  const l = data.latest || {};
  const metrics = [
    { label: "Career Score", value: l.careerScore ?? "—" },
    { label: "ATS Score", value: l.atsScore ?? "—" },
    { label: "Interview", value: l.interviewScore ?? "—" },
    { label: "Learning", value: `${l.learningProgress ?? 0}%` },
  ];

  const radar = [
    { skill: "Career", value: l.careerScore ?? 0 },
    { skill: "ATS", value: l.atsScore ?? 0 },
    { skill: "Interview", value: l.interviewScore ?? 0 },
    { skill: "Learning", value: l.learningProgress ?? 0 },
    { skill: "Job Match", value: l.jobMatch ?? 0 },
  ];

  const resumeHistory = (data.resumeScoreHistory || []).map((r, i) => ({ name: `v${i + 1}`, value: r.score }));
  const atsHistory = (data.atsHistory || []).map((r, i) => ({ name: `v${i + 1}`, value: r.score }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Track your growth across all career metrics.</p>
        </div>
        <Badge variant="primary">Your data</Badge>
      </div>

      <div className="grid grid-4">
        {metrics.map((m) => (
          <Card key={m.label} className="stat">
            <div className="label">{m.label}</div>
            <div className="value">{m.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Resume & ATS Score History" icon={<BarChart3 size={18} />} />
          {resumeHistory.length || atsHistory.length ? (
            <LineChart
              data={resumeHistory.length ? resumeHistory : atsHistory}
              xKey="name"
              lines={[{ key: "value", color: "#e53935" }]}
            />
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>Upload a resume and run an ATS scan to populate history.</p>
          )}
        </Card>
        <Card>
          <CardHead title="Competency Radar" icon={<Users size={18} />} />
          <RadarChart data={radar} nameKey="skill" dataKey="value" />
        </Card>
      </div>

      <div className="grid grid-2 mt-3">
        <Card>
          <CardHead title="Interview Performance" icon={<MessageCircle size={18} />} />
          {(data.interviewPerformance || []).length ? (
            <BarChart data={data.interviewPerformance} xKey="label" dataKey="score" color="#16a34a" />
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>Complete mock interviews to see performance.</p>
          )}
        </Card>
        <Card>
          <CardHead title="Job Applications" icon={<FileText size={18} />} />
          {(data.jobApplications || []).length ? (
            <BarChart data={data.jobApplications} xKey="label" dataKey="count" color="#3b82f6" />
          ) : (
            <p className="muted" style={{ fontSize: 13 }}>Get job recommendations to track applications.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
