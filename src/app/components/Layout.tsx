import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Key, KeyRound, FileText, Users, LogOut, Shield } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { path: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/app/keys", label: "Clés cryptographiques", icon: Key, exact: false },
    { path: "/app/generate", label: "Générer une clé", icon: KeyRound, exact: false },
    { path: "/app/audit", label: "Journaux d'audit", icon: FileText, exact: false },
    { path: "/app/users", label: "Utilisateurs", icon: Users, exact: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="font-bold text-lg">KMS Audit ELK</h2>
              <p className="text-xs text-blue-300">Sécurité & Audit</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
