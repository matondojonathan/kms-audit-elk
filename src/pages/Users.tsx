import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";

import {
    Search,
    UserCheck,
    UserX,
    Shield,
    UserPlus,
    Users as UsersIcon,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { Badge } from "../components/ui/badge";

type Utilisateur = {
    id_utilisateur: number;
    nom_utilisateur: string;
    email: string;
    role: string;
    statut: string;
    date_creation?: string;
};

function roleLabel(role: string) {
    if (role === "administrateur") return "Administrateur";
    if (role === "gestionnaire_cles") return "Gestionnaire de clés";
    if (role === "auditeur") return "Auditeur";
    return role;
}

function roleClass(role: string) {
    if (role === "administrateur") return "bg-purple-600 text-white";
    if (role === "gestionnaire_cles") return "bg-blue-600 text-white";
    if (role === "auditeur") return "bg-green-600 text-white";
    return "bg-slate-600 text-white";
}

export default function Users() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [erreur, setErreur] = useState("");
    const [recherche, setRecherche] = useState("");

    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [role, setRole] = useState("auditeur");
    const [message, setMessage] = useState("");

    const chargerUtilisateurs = () => {
        apiRequest("/utilisateurs")
            .then((data) => {
                setUtilisateurs(data.utilisateurs || data.users || []);
            })
            .catch((error) => {
                setErreur(error.message);
                setUtilisateurs([]);
            });
    };

    useEffect(() => {
        chargerUtilisateurs();
    }, []);

    const utilisateursFiltres = useMemo(() => {
        return utilisateurs.filter((user) => {
            return (
                user.nom_utilisateur.toLowerCase().includes(recherche.toLowerCase()) ||
                user.email.toLowerCase().includes(recherche.toLowerCase()) ||
                user.role.toLowerCase().includes(recherche.toLowerCase())
            );
        });
    }, [utilisateurs, recherche]);

    const creerUtilisateur = async (e: React.FormEvent) => {
        e.preventDefault();
        setErreur("");
        setMessage("");

        try {
            await apiRequest("/utilisateurs", {
                method: "POST",
                body: JSON.stringify({
                    nom_utilisateur: nom,
                    email,
                    mot_de_passe: motDePasse,
                    role,
                    statut: "actif",
                }),
            });

            setMessage("Utilisateur créé avec succès.");
            setNom("");
            setEmail("");
            setMotDePasse("");
            setRole("auditeur");
            chargerUtilisateurs();
        } catch (error: any) {
            setErreur(error.message);
        }
    };

    const totalActifs = utilisateurs.filter((u) => u.statut === "actif").length;
    const totalInactifs = utilisateurs.filter((u) => u.statut === "inactif").length;

    return (
        <div className="space-y-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Utilisateurs
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Gestion des accès, rôles et comptes du système.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Badge className="bg-green-600 text-white px-4 py-2">
                        {totalActifs} actifs
                    </Badge>

                    <Badge className="bg-slate-600 text-white px-4 py-2">
                        {totalInactifs} inactifs
                    </Badge>
                </div>
            </div>

            {erreur && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl">
                    {erreur}
                </div>
            )}

            {message && (
                <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded-xl">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <Card className="bg-slate-900 border border-slate-800 xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Shield className="text-blue-400" />
                            Rôles disponibles
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-500/10 border border-purple-500 rounded-xl p-4">
                            <h3 className="text-purple-300 font-semibold mb-2">Administrateur</h3>
                            <p className="text-slate-400 text-sm">
                                Accès complet à toutes les fonctionnalités.
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-4">
                            <h3 className="text-blue-300 font-semibold mb-2">Gestionnaire de clés</h3>
                            <p className="text-slate-400 text-sm">
                                Création, consultation et révocation des clés.
                            </p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500 rounded-xl p-4">
                            <h3 className="text-green-300 font-semibold mb-2">Auditeur</h3>
                            <p className="text-slate-400 text-sm">
                                Consultation des journaux et supervision.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 mb-2">Total utilisateurs</p>
                            <h2 className="text-4xl font-bold text-white">
                                {utilisateurs.length}
                            </h2>
                        </div>

                        <UsersIcon className="text-blue-400" size={42} />
                    </CardContent>
                </Card>

            </div>

            <Card className="bg-slate-900 border border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                        <UserPlus className="text-green-400" />
                        Ajouter un utilisateur
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={creerUtilisateur} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Nom utilisateur"
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            required
                        />

                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            required
                        />

                        <input
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="Mot de passe"
                            type="password"
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                            required
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                        >
                            <option value="administrateur">Administrateur</option>
                            <option value="gestionnaire_cles">Gestionnaire de clés</option>
                            <option value="auditeur">Auditeur</option>
                        </select>

                        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3">
                            Ajouter
                        </button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border border-slate-800">
                <CardContent className="p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-4 text-slate-500" size={18} />

                        <input
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Rechercher un utilisateur..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border border-slate-800 overflow-hidden">
                <CardContent className="p-0 overflow-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-slate-300">
                            <tr>
                                <th className="p-5">Nom</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Rôle</th>
                                <th className="p-5">Statut</th>
                                <th className="p-5">Date création</th>
                                <th className="p-5">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {utilisateursFiltres.map((user) => (
                                <tr key={user.id_utilisateur} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="p-5 text-white font-medium">{user.nom_utilisateur}</td>
                                    <td className="p-5 text-slate-300">{user.email}</td>
                                    <td className="p-5">
                                        <Badge className={roleClass(user.role)}>
                                            {roleLabel(user.role)}
                                        </Badge>
                                    </td>
                                    <td className="p-5">
                                        <Badge className={user.statut === "actif" ? "bg-green-600 text-white" : "bg-slate-600 text-white"}>
                                            {user.statut === "actif" ? "Actif" : "Inactif"}
                                        </Badge>
                                    </td>
                                    <td className="p-5 text-slate-400">
                                        {user.date_creation
                                            ? new Date(user.date_creation).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-4">
                                            {user.statut === "actif" ? (
                                                <UserX className="text-red-400" size={20} />
                                            ) : (
                                                <UserCheck className="text-green-400" size={20} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {utilisateursFiltres.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

        </div>
    );
}