import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, KeyRound, FileText, Users, LogOut, PlusCircle } from "lucide-react";

export default function Layout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="w-72 bg-slate-950 text-white p-6">
                <h1 className="text-2xl font-bold mb-2">KMS Audit ELK</h1>
                <p className="text-sm text-slate-400 mb-8">Gestion sécurisée des clés</p>

                <nav className="space-y-2">
                    <NavLink to="/app" end className={linkClass}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>

                    <NavLink to="/app/keys" className={linkClass}>
                        <KeyRound size={20} />
                        Clés cryptographiques
                    </NavLink>

                    <NavLink to="/app/generate" className={linkClass}>
                        <PlusCircle size={20} />
                        Générer une clé
                    </NavLink>

                    <NavLink to="/app/audit" className={linkClass}>
                        <FileText size={20} />
                        Journaux d’audit
                    </NavLink>

                    <NavLink to="/app/users" className={linkClass}>
                        <Users size={20} />
                        Utilisateurs
                    </NavLink>
                </nav>

                <button
                    onClick={logout}
                    className="mt-10 flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/30 w-full"
                >
                    <LogOut size={20} />
                    Déconnexion
                </button>
            </aside>

            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}