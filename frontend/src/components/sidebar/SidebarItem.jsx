import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function SidebarItem({ item, icon: Icon }) {
  const [active, setActive] = useState(false);

  if (item && item.path) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `menu ${isActive ? "active" : ""}`}
        onClick={() => setActive((a) => !a)}
      >
        {Icon && <Icon size={20} />}
        <span>{item.name}</span>
      </NavLink>
    );
  }

  return (
    <div className={`menu ${active ? "active" : ""}`} onClick={() => setActive((a) => !a)}>
      {Icon && <Icon size={20} />}
      <span>{item?.name || "Item"}</span>
    </div>
  );
}
