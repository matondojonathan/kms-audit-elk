import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";

import {
    Search,
    Download,
    BarChart3,
    AlertTriangle,
    FileText,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { Badge } from "../components/ui/badge";

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

export default function AuditLogs() {
    const [journaux, setJournaux] = useState<Journal[]>([]);
    const [erreur, setErreur] = useState("");

    const [filtreUser, setFiltreUser] = useState("");
    const [filtreAction, setFiltreAction] = useState("");
    const [filtreResultat, setFiltreResultat] = useState("");

    useEffect(() => {
        apiRequest("/audit")
            .then((data) => {
                setJournaux(data.journaux || data.logs || []);
            })
            .catch((error) => {
                setErreur(error.message);
                setJournaux([]);
            });
    }, []);

    const journauxFiltres = useMemo(() => {
        return journaux.filter((journal) => {
            const user = journal.nom_utilisateur || "Système";

            if (filtreUser && !user.toLowerCase().includes(filtreUser.toLowerCase())) {
                return false;
            }

            if (filtreAction && !journal.action.toLowerCase().includes(filtreAction.toLowerCase())) {
                return false;
            }

            if (filtreResultat && journal.resultat !== filtreResultat) {
                return false;
            }

            return true;
        });
    }, [journaux, filtreUser, filtreAction, filtreResultat]);

    const totalEchecs = journaux.filter((j) => j.resultat === "echec").length;
    const totalSucces = journaux.filter((j) => j.resultat === "succes").length;

    const exporterCSV = () => {
        const lignes = [
            ["Utilisateur", "Action", "Cible", "IP", "Résultat", "Date", "Détails"],
            ...journauxFiltres.map((j) => [
                j.nom_utilisateur || "Système",
                j.action,
                j.type_cible,
                j.adresse_ip,
                j.resultat,
                j.horodatage,
                j.details,
            ]),
        ];

        const csv = lignes.map((ligne) => ligne.join(";")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "journaux_audit_kms.csv";
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Journaux d’audit
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Surveillance, traçabilité et analyse des actions sensibles.
                    </p>
                </div>

                <button
                    onClick={exporterCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                    <Download size={18} />
                    Exporter CSV
                </button>
            </div>

            {erreur && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl">
                    {erreur}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="bg-slate-900 border border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 mb-2">Total actions</p>
                            <h2 className="text-4xl font-bold text-white">{journaux.length}</h2>
                        </div>

                        <FileText className="text-blue-400" size={40} />
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 mb-2">Succès</p>
                            <h2 className="text-4xl font-bold text-white">{totalSucces}</h2>
                        </div>

                        <BarChart3 className="text-green-400" size={40} />
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border border-slate-800">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 mb-2">Échecs</p>
                            <h2 className="text-4xl font-bold text-white">{totalEchecs}</h2>
                        </div>

                        <AlertTriangle className="text-red-400" size={40} />
                    </CardContent>
                </Card>

            </div>

            <Card className="bg-slate-900 border border-slate-800">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <div className="relative">
                            <Search className="absolute left-4 top-4 text-slate-500" size={18} />

                            <input
                                type="text"
                                placeholder="Utilisateur..."
                                value={filtreUser}
                                onChange={(e) => setFiltreUser(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Action..."
                            value={filtreAction}
                            onChange={(e) => setFiltreAction(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                        />

                        <select
                            value={filtreResultat}
                            onChange={(e) => setFiltreResultat(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                        >
                            <option value="">Tous les résultats</option>
                            <option value="succes">Succès</option>
                            <option value="echec">Échec</option>
                        </select>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-400">
                            {journauxFiltres.length} résultat(s)
                        </div>

                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border border-slate-800 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                        <FileText className="text-blue-400" />
                        Liste des événements
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0 overflow-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-slate-300">
                            <tr>
                                <th className="p-4">Utilisateur</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">Cible</th>
                                <th className="p-4">IP</th>
                                <th className="p-4">Résultat</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Détails</th>
                            </tr>
                        </thead>

                        <tbody>
                            {journauxFiltres.map((journal) => (
                                <tr key={journal.id_journal} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="p-4 text-white">
                                        {journal.nom_utilisateur || "Système"}
                                    </td>

                                    <td className="p-4 text-slate-300">
                                        {journal.action}
                                    </td>

                                    <td className="p-4 text-slate-300">
                                        {journal.type_cible} #{journal.id_cible || "-"}
                                    </td>

                                    <td className="p-4 text-slate-400 font-mono">
                                        {journal.adresse_ip}
                                    </td>

                                    <td className="p-4">
                                        <Badge className={journal.resultat === "succes" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                                            {journal.resultat}
                                        </Badge>
                                    </td>

                                    <td className="p-4 text-slate-400">
                                        {new Date(journal.horodatage).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-slate-400">
                                        {journal.details}
                                    </td>
                                </tr>
                            ))}

                            {journauxFiltres.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-slate-500">
                                        Aucun journal trouvé.
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