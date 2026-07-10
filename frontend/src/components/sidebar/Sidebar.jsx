import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Target,
  GraduationCap,
  MessageCircle,
  Code2,
  Briefcase,
  BadgeDollarSign,
  Activity,
  ScanSearch,
  BarChart3,
  BookOpen,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS } from "../../utils/constants";

const ICONS = {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Target,
  GraduationCap,
  MessageCircle,
  Code2,
  Briefcase,
  BadgeDollarSign,
  Activity,
  ScanSearch,
  BarChart3,
  BookOpen,
  User,
  Settings,
};

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="logo lenovo">L</div>
        <div>
          <h2>Lenovo AI Mentor</h2>
          <span className="brand-sub">Career Mentor</span>
        </div>
      </div>

      <span className="section-label">Main</span>
      {NAV_ITEMS.slice(0, 1).map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      <span className="section-label">Career Tools</span>
      {NAV_ITEMS.slice(1, 11).map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      <span className="section-label">Account</span>
      {NAV_ITEMS.slice(11).map((item) => (
        <NavItem key={item.path} item={item} />
      ))}

      <div className="logout" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </div>
    </aside>
  );
}

function NavItem({ item }) {
  const Icon = ICONS[item.icon];
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `menu ${isActive ? "active" : ""}`}
    >
      <Icon size={20} />
      <span>{item.name}</span>
    </NavLink>
  );
}
