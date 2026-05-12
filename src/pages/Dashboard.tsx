import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

import {
    KeyRound,
    ShieldAlert,
    Users,
    FileText,
    ShieldCheck,
    Activity,
    Server,
    LockKeyhole
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { Badge } from "../components/ui/badge";

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
        {
            title: "Clés actives",
            value: stats.cles_actives,
            icon: KeyRound,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },

        {
            title: "Clés révoquées",
            value: stats.cles_revoquees,
            icon: ShieldAlert,
            color: "text-red-400",
            bg: "bg-red-500/10",
        },

        {
            title: "Utilisateurs actifs",
            value: stats.utilisateurs_actifs,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },

        {
            title: "Actions auditées",
            value: stats.actions_auditees,
            icon: FileText,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
    ];

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Dashboard KMS
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Supervision sécurisée des clés cryptographiques et audit ELK.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                        React + Node.js
                    </Badge>

                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2">
                        Audit ELK
                    </Badge>

                    <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                        JWT Sécurisé
                    </Badge>

                </div>

            </div>

            {/* ERREUR */}
            {erreur && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl">
                    {erreur}
                </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <Card
                            key={card.title}
                            className="bg-slate-900 border border-slate-800 shadow-xl hover:border-blue-500 transition-all duration-300"
                        >

                            <CardContent className="p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className={`p-4 rounded-2xl ${card.bg}`}>
                                        <Icon className={card.color} size={32} />
                                    </div>

                                    <Badge variant="outline" className="text-slate-300 border-slate-700">
                                        LIVE
                                    </Badge>

                                </div>

                                <div>
                                    <p className="text-slate-400 mb-2">
                                        {card.title}
                                    </p>

                                    <h2 className="text-4xl font-bold text-white">
                                        {card.value}
                                    </h2>
                                </div>

                            </CardContent>

                        </Card>
                    );
                })}

            </div>

            {/* PANELS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ACTIVITÉ */}
                <Card className="bg-slate-900 border border-slate-800 xl:col-span-2">

                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Activity className="text-blue-400" />
                            Activité récente
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl">
                            <ShieldCheck className="text-green-400 mt-1" />

                            <div>
                                <p className="text-white font-medium">
                                    Connexion administrateur réussie
                                </p>

                                <p className="text-slate-400 text-sm">
                                    Audit enregistré dans le journal sécurité.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl">
                            <LockKeyhole className="text-blue-400 mt-1" />

                            <div>
                                <p className="text-white font-medium">
                                    Nouvelle clé AES-256 générée
                                </p>

                                <p className="text-slate-400 text-sm">
                                    Clé cryptographique sécurisée ajoutée.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-xl">
                            <ShieldAlert className="text-red-400 mt-1" />

                            <div>
                                <p className="text-white font-medium">
                                    Révocation d’une clé compromise
                                </p>

                                <p className="text-slate-400 text-sm">
                                    Journalisation automatique effectuée.
                                </p>
                            </div>
                        </div>

                    </CardContent>

                </Card>

                {/* ÉTAT SYSTÈME */}
                <Card className="bg-slate-900 border border-slate-800">

                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Server className="text-purple-400" />
                            État système
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-5">

                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                                API Backend
                            </span>

                            <Badge className="bg-green-600 text-white">
                                Opérationnel
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                                Base MySQL
                            </span>

                            <Badge className="bg-green-600 text-white">
                                Connectée
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                                Audit ELK
                            </span>

                            <Badge className="bg-yellow-600 text-white">
                                Simulé
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">
                                Sécurité JWT
                            </span>

                            <Badge className="bg-blue-600 text-white">
                                Active
                            </Badge>
                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}