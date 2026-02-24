import React from "react";
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  UserRound
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard },
  { label: "Results", to: "/practice", Icon: Code2 },
  { label: "History", to: "/assessments", Icon: ClipboardList },
  { label: "Resources", to: "/resources", Icon: BookOpen },
  { label: "Profile", to: "/profile", Icon: UserRound }
];

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navItems.map(({ label, to, Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
              end={to === "/dashboard"}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-area">
        <header className="dashboard-header">
          <h1>Placement Prep</h1>
          <div className="avatar-placeholder" aria-label="User avatar">
            U
          </div>
        </header>
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
