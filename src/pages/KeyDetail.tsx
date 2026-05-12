import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

import {
    ArrowLeft,
    Calendar,
    Eye,
    EyeOff,
    KeyRound,
    Shield,
    ShieldAlert,
    User,
    Activity,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { Badge } from "../components/ui/badge";

type Cle = {
    id_cle: number;
    nom_cle: string;
    type_cle: string;
    algorithme: string;
    usage_prevu: string;
    statut: string;
    cree_par: string;
    date_creation: string;
    date_revocation?: string | null;
};

type Journal = {
    id_journal: number;
    nom_utilisateur?: string;
    action: string;
    type_cible: string;
    id_cible: number;
    adresse_ip: string;
    resultat: string;
    details: string;
    horodatage: string;
};

export default function KeyDetail() {
    const { id } = useParams();

    const [cles, setCles] = useState<Cle[]>([]);
    const [journaux, setJournaux] = useState<Journal[]>([]);
    const [showValue, setShowValue] = useState(false);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        Promise.all([
            apiRequest("/cles"),
            apiRequest("/audit"),
        ])
            .then(([clesData, auditData]) => {
                setCles(clesData.cles || []);
                setJournaux(auditData.journaux || auditData.logs || []);
            })
            .catch((error) => {
                setErreur(error.message);
            });
    }, []);

    const cle = useMemo(() => {
        return cles.find((item) => String(item.id_cle) === String(id));
    }, [cles, id]);

    const historique = useMemo(() => {
        return journaux.filter(
            (journal) =>
                String(journal.id_cible) === String(id) &&
                journal.type_cible === "cle"
        );
    }, [journaux, id]);

    if (erreur) {
        return (
            <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl">
                {erreur}
            </div>
        );
    }

    if (!cle) {
        return (
            <div className="space-y-6">
                <Link to="/app/keys" className="text-blue-400 flex items-center gap-2">
                    <ArrowLeft size={18} />
                    Retour aux clés
                </Link>

                <Card className="bg-slate-900 border border-slate-800">
                    <CardContent className="p-8 text-center text-slate-400">
                        Clé introuvable ou chargement en cours.
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>
                <Link to="/app/keys" className="text-blue-400 flex items-center gap-2 mb-4">
                    <ArrowLeft size={18} />
                    Retour à la liste des clés
                </Link>

                <h1 className="text-4xl font-bold text-white mb-2">
                    Détail de la clé
                </h1>

                <p className="text-slate-400 text-lg">
                    Analyse complète de la clé cryptographique sélectionnée.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-6">

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <KeyRound className="text-blue-400" />
                                Informations générales
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <p className="text-slate-400 mb-2">Nom de la clé</p>
                                <p className="text-white font-mono text-lg">{cle.nom_cle}</p>
                            </div>

                            <div>
                                <p className="text-slate-400 mb-2">Type</p>
                                <Badge className={cle.type_cle === "symetrique" ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}>
                                    {cle.type_cle === "symetrique" ? "Symétrique" : "Asymétrique"}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-slate-400 mb-2">Algorithme</p>
                                <p className="text-white">{cle.algorithme}</p>
                            </div>

                            <div>
                                <p className="text-slate-400 mb-2">Usage prévu</p>
                                <p className="text-white">{cle.usage_prevu}</p>
                            </div>

                            <div>
                                <p className="text-slate-400 mb-2">Statut</p>
                                <Badge className={cle.statut === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                    {cle.statut === "active" ? "Active" : "Révoquée"}
                                </Badge>
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <Shield className="text-yellow-400" />
                                Valeur protégée
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-slate-300">
                                        Valeur de la clé / clé privée protégée
                                    </p>

                                    <button
                                        onClick={() => setShowValue(!showValue)}
                                        className="text-blue-400 flex items-center gap-2"
                                    >
                                        {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
                                        {showValue ? "Masquer" : "Afficher"}
                                    </button>
                                </div>

                                {showValue ? (
                                    <p className="text-xs font-mono text-slate-400 bg-slate-950 p-4 rounded-lg break-all">
                                        ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                                    </p>
                                ) : (
                                    <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-4 text-yellow-300">
                                        La valeur réelle de la clé est masquée pour éviter toute fuite sensible.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <Activity className="text-green-400" />
                                Historique des actions
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 overflow-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-slate-300">
                                    <tr>
                                        <th className="p-4">Action</th>
                                        <th className="p-4">Utilisateur</th>
                                        <th className="p-4">Résultat</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {historique.map((item) => (
                                        <tr key={item.id_journal} className="border-b border-slate-800">
                                            <td className="p-4 text-white">{item.action}</td>
                                            <td className="p-4 text-slate-300">{item.nom_utilisateur || "Système"}</td>
                                            <td className="p-4">
                                                <Badge className={item.resultat === "succes" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                                    {item.resultat}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-slate-400">
                                                {new Date(item.horodatage).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}

                                    {historique.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-6 text-center text-slate-500">
                                                Aucun historique disponible pour cette clé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-6">

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <Calendar className="text-green-400" />
                                Dates importantes
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-slate-400 mb-1">Création</p>
                                <p className="text-white">
                                    {new Date(cle.date_creation).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 mb-1">Révocation</p>
                                <p className="text-red-300">
                                    {cle.date_revocation
                                        ? new Date(cle.date_revocation).toLocaleString()
                                        : "Non révoquée"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <User className="text-blue-400" />
                                Créateur
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-slate-400 mb-1">Créée par</p>
                            <p className="text-white">{cle.cree_par}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardContent className="p-6 flex gap-4">
                            <ShieldAlert className="text-yellow-400 shrink-0" />
                            <p className="text-slate-300 text-sm">
                                Une clé révoquée ne doit plus être utilisée pour protéger de nouvelles données.
                            </p>
                        </CardContent>
                    </Card>

                </div>

            </div>

        </div>
    );
}