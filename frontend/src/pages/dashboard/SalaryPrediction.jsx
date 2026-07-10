import { useState } from "react";
import { BadgeDollarSign, TrendingUp, MapPin, Briefcase, IndianRupee, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Card, CardHead, Badge, Button, Input } from "../../components/common";
import BarChart from "../../components/charts/BarChart";

export default function SalaryPrediction() {
  const [form, setForm] = useState({ role: "", location: "", experience: "" });
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const predict = async () => {
    setBusy(true);
    try {
      const d = await api.post("/salary", {
        role: form.role,
        location: form.location,
        experience: form.experience ? Number(form.experience) : 0,
      });
      setResult(d);
    } catch {
      toast.error("Failed to predict salary");
    } finally {
      setBusy(false);
    }
  };

  const lpa = (() => {
    const m = result?.prediction?.match(/([\d.,]+)\s*–\s*([\d.,]+)/);
    if (m) return { min: m[1], max: m[2] };
    return null;
  })();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Salary Prediction</h1>
          <p>Estimated compensation based on your profile and market data.</p>
        </div>
        {result && <Badge variant="primary">{result.prediction}</Badge>}
      </div>

      <div className="grid grid-3">
        <Card className="center">
          <CardHead title="Predicted Salary" icon={<BadgeDollarSign size={18} />} />
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", marginTop: 10 }}>
            {result ? result.prediction : "—"}
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Based on your inputs</p>
          {result && (
            <div className="row" style={{ gap: 8, justifyContent: "center", marginTop: 10 }}>
              <TrendingUp size={16} color="var(--success)" />
              <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>Personalized</span>
            </div>
          )}
        </Card>

        <Card className="span-2">
          <CardHead title="Your Details" icon={<Briefcase size={18} />} />
          <div className="grid grid-2">
            <Input label="Target Role" value={form.role} onChange={set("role")} placeholder="e.g. Frontend Developer" />
            <Input label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Bengaluru" />
            <Input label="Years of Experience" type="number" value={form.experience} onChange={set("experience")} />
          </div>
          <Button className="mt-2" onClick={predict} disabled={busy}><RefreshCw size={16} /> Predict Salary</Button>
        </Card>
      </div>

      {lpa && (
        <Card className="mt-3">
          <CardHead title="Expected Range" icon={<IndianRupee size={18} />} />
          <BarChart
            data={[
              { name: "Min", value: parseFloat(lpa.min) },
              { name: "Max", value: parseFloat(lpa.max) },
            ]}
            xKey="name"
            dataKey="value"
            color="#16a34a"
          />
          <div className="row between muted" style={{ fontSize: 12, marginTop: 6 }}>
            <span>Min ₹{lpa.min}L</span>
            <span>Max ₹{lpa.max}L</span>
          </div>
        </Card>
      )}
    </div>
  );
}
