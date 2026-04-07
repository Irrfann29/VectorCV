import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Sparkles, Target, Zap, History, Bookmark, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

const NAV = [
  { label:"Overview",       path:"overview",  icon:LayoutDashboard },
  { label:"Analyze Resume", path:"analyze",   icon:Sparkles,  badge:"AI" },
  { label:"Job Matches",    path:"matches",   icon:Target,    badge:"12" },
  { label:"Gap Analysis",   path:"gap",       icon:Zap },
  { label:"Past Analyses",  path:"history",   icon:History },
  { label:"Saved Jobs",     path:"saved",     icon:Bookmark,  badge:"4" },
  { label:"Settings",       path:"settings",  icon:Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-60 flex-shrink-0 bg-bg-2 border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="font-syne font-extrabold text-lg tracking-tight">
          Resume<span className="text-accent">IQ</span>
        </div>
        <div className="text-xs text-ink-3 mt-0.5">Career Intelligence Platform</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-4 py-2 text-xs text-ink-3 uppercase tracking-widest font-medium">Main</p>
        {NAV.slice(0, 4).map((item) => <NavItem key={item.path} {...item} />)}

        <p className="px-4 py-2 mt-3 text-xs text-ink-3 uppercase tracking-widest font-medium">History</p>
        {NAV.slice(4, 6).map((item) => <NavItem key={item.path} {...item} />)}

        <p className="px-4 py-2 mt-3 text-xs text-ink-3 uppercase tracking-widest font-medium">Account</p>
        {NAV.slice(6).map((item) => <NavItem key={item.path} {...item} />)}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-2 cursor-pointer group transition-colors">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/25 flex items-center justify-center text-xs font-semibold text-accent flex-shrink-0">
            {user?.name?.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-ink-3">Free Plan · 3/5 uses</div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-3 hover:text-red-400"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ label, path, icon: Icon, badge }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2.5 px-3.5 py-2 mx-2 my-0.5 rounded-lg text-sm transition-all",
          isActive
            ? "bg-accent/10 text-accent border border-accent/18"
            : "text-ink-2 hover:bg-surface-2 hover:text-ink"
        )
      }
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={clsx(
          "text-xs px-1.5 py-0.5 rounded-md font-medium",
          badge === "AI" ? "bg-accent-2/15 text-accent-2" : "bg-accent/15 text-accent"
        )}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}
