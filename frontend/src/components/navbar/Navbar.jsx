import { Menu, Bell, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ onToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const name = user?.name || "Guest";
  const email = user?.email || "";
  const photo = user?.avatar || "";

  return (
    <header className="navbar">
      <div className="row" style={{ gap: 14 }}>
        <button
          className="icon-btn"
          onClick={onToggle}
          style={{ background: "var(--surface-2)" }}
        >
          <Menu size={20} />
        </button>
        <div className="search">
          <Search size={18} />
          <input type="text" placeholder="Search careers, skills, jobs..." />
        </div>
      </div>

      <div className="right">
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn">
          <Bell size={18} />
          <span className="dot" />
        </button>
        <ProfileMenu name={name} email={email} photo={photo} />
      </div>
    </header>
  );
}
