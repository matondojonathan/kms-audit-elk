import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom_utilisateur: username,
                    mot_de_passe: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Erreur de connexion");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/app");
        } catch {
            setError("Impossible de contacter le serveur backend");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">

            {/* CONTENU PRINCIPAL */}
            <div className="flex items-center justify-center flex-1 p-4">
                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-white">KMS Audit ELK</h1>
                        <p className="text-blue-200 mt-2">
                            Plateforme sécurisée de gestion de clés cryptographiques
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-white mb-2">Nom d’utilisateur</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2">Mot de passe</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-300 text-sm text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Lock size={20} />
                                Se connecter
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="text-center text-blue-200 text-sm py-4">
                ©2026 KMS Audit ELK. Tous droits réservés
            </footer>

        </div>
    );
}