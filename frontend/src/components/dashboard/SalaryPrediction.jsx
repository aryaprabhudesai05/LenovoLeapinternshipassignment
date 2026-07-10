import { useEffect, useState } from "react";
import { BadgeDollarSign, TrendingUp } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Skeleton, ProgressBar } from "../../components/common";
import BarChart from "../../components/charts/BarChart";

export default function SalaryPrediction() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/salary").then(setData);
  }, []);

  if (!data) return <Skeleton height={360} />;

  const range = [
    { name: "Min", value: data.range[0] },
    { name: "Predicted", value: data.prediction },
    { name: "Max", value: data.range[1] },
  ];

  return (
    <Card>
      <CardHead
        title="Salary Prediction"
        icon={<BadgeDollarSign size={18} />}
        action={<Badge variant="primary">₹{data.prediction} LPA</Badge>}
      />

      <div className="row" style={{ gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
            ₹{data.prediction}
          </div>
          <p className="muted" style={{ fontSize: 13 }}>Lakhs per annum</p>
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            <TrendingUp size={16} color="var(--success)" />
            <span style={{ color: "var(--success)", fontSize: 13, fontWeight: 600 }}>+12% vs market</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <BarChart data={range} xKey="name" dataKey="value" color="#16a34a" />
        </div>
      </div>

      <div className="divider" />

      <div className="muted" style={{ fontSize: 12, marginBottom: 10, fontWeight: 600 }}>
        Influencing Factors
      </div>
      {data.factors.map((f) => (
        <div key={f.name} style={{ marginBottom: 12 }}>
          <div className="row between" style={{ fontSize: 13, marginBottom: 5 }}>
            <span>{f.name}</span>
            <span style={{ fontWeight: 700 }}>{f.value}%</span>
          </div>
          <ProgressBar value={f.value} color="var(--info)" />
        </div>
      ))}

      <div className="divider" />

      <div className="muted" style={{ fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
        Salary Growth
      </div>
      <BarChart
        data={data.history.map((h) => ({ name: String(h.year), value: h.salary }))}
        xKey="name"
        dataKey="value"
        color="#e53935"
      />
    </Card>
  );
}
