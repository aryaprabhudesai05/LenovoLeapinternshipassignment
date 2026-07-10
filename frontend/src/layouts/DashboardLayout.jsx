import { useState, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <div className="main">
        <Navbar onToggle={() => setOpen((o) => !o)} />
        <div className="page">
          <Suspense fallback={<div className="loading-screen"><div className="spinner" /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
