import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBarChart2,
  FiBookOpen,
  FiCpu,
  FiGrid,
  FiMessageCircle,
  FiHelpCircle,
  FiPlayCircle,
  FiShield,
  FiUser,
} from "react-icons/fi";

const studentItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/generate", label: "Generate Path", icon: FiCpu },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser },
  { to: "/chat", label: "Chat with Admin", icon: FiMessageCircle },
  { to: "/quiz", label: "Take Quiz", icon: FiPlayCircle },
  { to: "/assistant", label: "AI Assistant", icon: FiHelpCircle },
];

const adminItems = [
  { to: "/admin", label: "Student Overview", icon: FiShield },
  { to: "/profile", label: "Admin Profile", icon: FiUser },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const items = user?.role === "admin" ? adminItems : studentItems;
  return (
    <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/70 p-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 text-xl font-semibold text-white">
        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-2">
          <FiBookOpen className="text-violet-300" />
        </div>
        LearnMind AI
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
