import {
  PieChart as RePie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#e53935", "#3b82f6", "#16a34a", "#f59e0b", "#8b5cf6", "#06b6d4"];

export default function PieChart({ data, dataKey = "value", nameKey = "name" }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RePie innerRadius={55} outerRadius={90} paddingAngle={3}>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={55} outerRadius={90}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RePie>
    </ResponsiveContainer>
  );
}
