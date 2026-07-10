import { useState } from "react";
import toast from "react-hot-toast";
import { Bell, Moon, Globe, Shield, Download, Trash2, Palette } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Card, CardHead, Button, Badge } from "../../components/common";

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 30,
        border: "none",
        background: on ? "var(--primary)" : "var(--surface-2)",
        position: "relative",
        transition: "background .2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .2s",
        }}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState({
    notifications: true,
    emailAlerts: false,
    publicProfile: true,
    weeklyReport: true,
  });

  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Customize your experience and preferences.</p>
        </div>
        <Button onClick={() => toast.success("Settings saved")}>Save</Button>
      </div>

      <div className="grid grid-2">
        <Card>
          <CardHead title="Appearance" icon={<Moon size={18} />} />
          <Row label="Dark Mode" desc="Switch between light and dark themes">
            <Toggle on={theme === "dark"} onChange={toggleTheme} />
          </Row>
          <Row label="Accent Color" desc="Lenovo red theme">
            <span className="badge primary"><Palette size={13} /> Red</span>
          </Row>
        </Card>

        <Card>
          <CardHead title="Notifications" icon={<Bell size={18} />} />
          <Row label="Push Notifications" desc="Career alerts and updates">
            <Toggle on={prefs.notifications} onChange={set("notifications")} />
          </Row>
          <Row label="Email Alerts" desc="Weekly digest emails">
            <Toggle on={prefs.emailAlerts} onChange={set("emailAlerts")} />
          </Row>
          <Row label="Weekly Report" desc="Progress summary every Monday">
            <Toggle on={prefs.weeklyReport} onChange={set("weeklyReport")} />
          </Row>
        </Card>

        <Card>
          <CardHead title="Privacy" icon={<Shield size={18} />} />
          <Row label="Public Profile" desc="Allow recruiters to view profile">
            <Toggle on={prefs.publicProfile} onChange={set("publicProfile")} />
          </Row>
        </Card>

        <Card>
          <CardHead title="Account" icon={<Globe size={18} />} />
          <div className="row between" style={{ padding: "8px 0" }}>
            <span style={{ fontSize: 14 }}>Language</span>
            <Badge variant="primary">English</Badge>
          </div>
          <div className="row between" style={{ padding: "8px 0" }}>
            <span style={{ fontSize: 14 }}>Plan</span>
            <Badge variant="success">Free</Badge>
          </div>
          <div className="divider" />
          <Button variant="outline" className="mt-2" style={{ width: "100%" }}>
            <Download size={16} /> Export Data
          </Button>
        </Card>
      </div>

      <Card className="mt-3" style={{ borderColor: "rgba(239,68,68,0.4)" }}>
        <CardHead title="Danger Zone" icon={<Trash2 size={18} />} />
        <div className="row between" style={{ flexWrap: "wrap", gap: 12 }}>
          <span className="muted" style={{ fontSize: 13 }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </span>
          <Button variant="outline" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
            <Trash2 size={16} /> Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="row between" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
        <div className="muted" style={{ fontSize: 12 }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}
