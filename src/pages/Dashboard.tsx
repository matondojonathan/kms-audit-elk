import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { KeyRound, ShieldAlert, Users, FileText } from "lucide-react";

type Stats = {
    cles_actives: number;
    cles_revoquees: number;
    utilisateurs_actifs: number;
    actions_auditees: number;
};

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        cles_actives: 0,
        cles_revoquees: 0,
        utilisateurs_actifs: 0,
        actions_auditees: 0,
    });

    const [erreur, setErreur] = useState("");

    useEffect(() => {
        apiRequest("/stats")
            .then((data) => {
                setStats({
                    cles_actives: data.statistiques?.cles_actives ?? 0,
                    cles_revoquees: data.statistiques?.cles_revoquees ?? 0,
                    utilisateurs_actifs: data.statistiques?.utilisateurs_actifs ?? 0,
                    actions_auditees: data.statistiques?.actions_auditees ?? 0,
                });
            })
            .catch((error) => {
                setErreur(error.message);
            });
    }, []);

    const cards = [
        { title: "Clés actives", value: stats.cles_actives, icon: KeyRound },
        { title: "Clés révoquées", value: stats.cles_revoquees, icon: ShieldAlert },
        { title: "Utilisateurs actifs", value: stats.utilisateurs_actifs, icon: Users },
        { title: "Actions auditées", value: stats.actions_auditees, icon: FileText },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
            <p className="text-slate-600 mb-8">
                Vue globale de la plateforme KMS Audit ELK.
            </p>

            {erreur && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {erreur}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.title} className="bg-white p-6 rounded-xl shadow">
                            <Icon className="text-blue-600 mb-4" size={32} />
                            <p className="text-slate-500">{card.title}</p>
                            <h2 className="text-3xl font-bold">{card.value}</h2>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}