export const formatNumber = (n) =>
  new Intl.NumberFormat("en-IN").format(n || 0);

export const formatCurrency = (n) =>
  "₹" + new Intl.NumberFormat("en-IN").format(n || 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const pct = (v) => `${Math.round(v)}%`;

export const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const scoreColor = (s) =>
  s >= 80 ? "var(--success)" : s >= 50 ? "var(--warning)" : "var(--danger)";
