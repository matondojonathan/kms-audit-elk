import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Journaux d’audit</h1>

            {erreur && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {erreur}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-4">Utilisateur</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Cible</th>
                            <th className="p-4">Résultat</th>
                            <th className="p-4">IP</th>
                            <th className="p-4">Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {journaux.map((journal) => (
                            <tr key={journal.id_journal} className="border-b">
                                <td className="p-4">{journal.nom_utilisateur || "Système"}</td>
                                <td className="p-4">{journal.action}</td>
                                <td className="p-4">{journal.type_cible}</td>
                                <td className="p-4">{journal.resultat}</td>
                                <td className="p-4">{journal.adresse_ip}</td>
                                <td className="p-4">{journal.details}</td>
                            </tr>
                        ))}

                        {journaux.length === 0 && (
                            <tr>
                                <td className="p-4 text-slate-500" colSpan={6}>
                                    Aucun journal trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}