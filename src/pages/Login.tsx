import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Lock,
    Shield,
    Eye,
    EyeOff,
    ShieldCheck,
    Database,
    Activity,
} from "lucide-react";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nom_utilisateur: username,
                        mot_de_passe: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(data.message || "Erreur de connexion");
                setLoading(false);

                return;
            }

            localStorage.setItem("token", data.token);

            navigate("/app");

        } catch {

            setError("Impossible de contacter le serveur backend");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">

            {/* BACKGROUND EFFECT */}
            <div className="absolute inset-0 opacity-10">

                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>

                <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>

            </div>

            {/* MAIN */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 w-full max-w-7xl">

                    {/* LEFT PANEL */}
                    <div className="hidden xl:flex flex-col justify-center">

                        <div className="mb-10">

                            <div className="flex items-center gap-4 mb-6">

                                <div className="bg-blue-600 p-4 rounded-2xl">
                                    <Shield className="w-12 h-12 text-white" />
                                </div>

                                <div>
                                    <h1 className="text-5xl font-bold text-white">
                                        KMS Audit ELK
                                    </h1>

                                    <p className="text-slate-400 mt-2 text-lg">
                                        Plateforme sécurisée de gestion de clés cryptographiques
                                    </p>
                                </div>

                            </div>

                            <p className="text-slate-300 text-lg leading-8">
                                Supervision centralisée, audit avancé,
                                gestion sécurisée des clés et architecture moderne cybersécurité.
                            </p>

                        </div>

                        <div className="space-y-5">

                            <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 flex gap-4">

                                <ShieldCheck className="text-green-400 mt-1" />

                                <div>
                                    <h3 className="text-white font-semibold mb-1">
                                        Authentification sécurisée
                                    </h3>

                                    <p className="text-slate-400 text-sm">
                                        JWT + bcrypt + contrôle RBAC.
                                    </p>
                                </div>

                            </div>

                            <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 flex gap-4">

                                <Database className="text-blue-400 mt-1" />

                                <div>
                                    <h3 className="text-white font-semibold mb-1">
                                        Gestion des clés
                                    </h3>

                                    <p className="text-slate-400 text-sm">
                                        AES-256, RSA-2048, ECC et supervision avancée.
                                    </p>
                                </div>

                            </div>

                            <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 flex gap-4">

                                <Activity className="text-purple-400 mt-1" />

                                <div>
                                    <h3 className="text-white font-semibold mb-1">
                                        Audit ELK
                                    </h3>

                                    <p className="text-slate-400 text-sm">
                                        Centralisation et traçabilité des événements sécurité.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* LOGIN CARD */}
                    <div className="flex items-center justify-center">

                        <div className="w-full max-w-md">

                            <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-2xl rounded-3xl shadow-2xl p-8">

                                <div className="text-center mb-8">

                                    <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-600/30">

                                        <Shield className="w-10 h-10 text-white" />

                                    </div>

                                    <h2 className="text-4xl font-bold text-white mb-2">
                                        Connexion
                                    </h2>

                                    <p className="text-slate-400">
                                        Accès sécurisé à la plateforme KMS.
                                    </p>

                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >

                                    {/* USERNAME */}
                                    <div>

                                        <label className="block text-slate-300 mb-3">
                                            Nom d’utilisateur
                                        </label>

                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="Entrez votre nom"
                                            required
                                        />

                                    </div>

                                    {/* PASSWORD */}
                                    <div>

                                        <label className="block text-slate-300 mb-3">
                                            Mot de passe
                                        </label>

                                        <div className="relative">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 pr-14 text-white focus:outline-none focus:border-blue-500 transition-all"
                                                placeholder="Entrez votre mot de passe"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-4 text-slate-400"
                                            >

                                                {showPassword ? (
                                                    <EyeOff size={22} />
                                                ) : (
                                                    <Eye size={22} />
                                                )}

                                            </button>

                                        </div>

                                    </div>

                                    {/* ERROR */}
                                    {error && (

                                        <div className="bg-red-500/10 border border-red-500 text-red-300 rounded-xl p-4 text-sm">
                                            {error}
                                        </div>

                                    )}

                                    {/* BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
                                    >

                                        <Lock size={22} />

                                        {loading
                                            ? "Connexion..."
                                            : "Se connecter"}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <footer className="relative z-10 text-center text-slate-500 text-sm py-5 border-t border-slate-800">

                © 2026 KMS Audit ELK — Plateforme cybersécurité sécurisée

            </footer>

        </div>
    );
}