import {
  Radar,
  RadarChart as ReRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RadarChart({ data, dataKey = "value", nameKey = "skill" }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ReRadar data={data} outerRadius={90}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey={nameKey} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar dataKey={dataKey} stroke="#e53935" fill="#e53935" fillOpacity={0.35} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </ReRadar>
    </ResponsiveContainer>
  );
}
