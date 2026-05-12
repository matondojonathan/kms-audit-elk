import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";

import {
    Search,
    KeyRound,
    ShieldCheck,
    ShieldAlert,
    Eye,
    Trash2,
    LockKeyhole,
} from "lucide-react";

import { Link } from "react-router-dom";

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
};

export default function Keys() {

    const [cles, setCles] = useState<Cle[]>([]);
    const [recherche, setRecherche] = useState("");
    const [filtre, setFiltre] = useState("toutes");

    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(true);

    const chargerCles = async () => {

        try {

            setChargement(true);

            const data = await apiRequest("/cles");

            setCles(data.cles || []);

        } catch (error: any) {

            setErreur(error.message);

        } finally {

            setChargement(false);

        }
    };

    useEffect(() => {
        chargerCles();
    }, []);

    const revoquerCle = async (id: number) => {

        try {

            await apiRequest(`/cles/${id}/revoquer`, {
                method: "PUT",
                body: JSON.stringify({
                    id_utilisateur: 1,
                }),
            });

            chargerCles();

        } catch (error: any) {

            setErreur(error.message);

        }
    };

    const clesFiltrees = useMemo(() => {

        return cles.filter((cle) => {

            const matchRecherche =
                cle.nom_cle.toLowerCase().includes(recherche.toLowerCase()) ||
                cle.algorithme.toLowerCase().includes(recherche.toLowerCase());

            const matchFiltre =
                filtre === "toutes"
                    ? true
                    : cle.statut === filtre;

            return matchRecherche && matchFiltre;
        });

    }, [cles, recherche, filtre]);

    const totalActives = cles.filter(
        (cle) => cle.statut === "active"
    ).length;

    const totalRevoquees = cles.filter(
        (cle) => cle.statut === "revoquee"
    ).length;

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Clés cryptographiques
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Gestion et supervision des clés KMS.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <Badge className="bg-green-600 text-white px-4 py-2">
                        {totalActives} actives
                    </Badge>

                    <Badge className="bg-red-600 text-white px-4 py-2">
                        {totalRevoquees} révoquées
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="bg-slate-900 border border-slate-800">

                    <CardContent className="p-6 flex items-center justify-between">

                        <div>
                            <p className="text-slate-400 mb-2">
                                Clés actives
                            </p>

                            <h2 className="text-4xl font-bold text-white">
                                {totalActives}
                            </h2>
                        </div>

                        <ShieldCheck className="text-green-400" size={40} />

                    </CardContent>

                </Card>

                <Card className="bg-slate-900 border border-slate-800">

                    <CardContent className="p-6 flex items-center justify-between">

                        <div>
                            <p className="text-slate-400 mb-2">
                                Clés révoquées
                            </p>

                            <h2 className="text-4xl font-bold text-white">
                                {totalRevoquees}
                            </h2>
                        </div>

                        <ShieldAlert className="text-red-400" size={40} />

                    </CardContent>

                </Card>

                <Card className="bg-slate-900 border border-slate-800">

                    <CardContent className="p-6 flex items-center justify-between">

                        <div>
                            <p className="text-slate-400 mb-2">
                                Total des clés
                            </p>

                            <h2 className="text-4xl font-bold text-white">
                                {cles.length}
                            </h2>
                        </div>

                        <KeyRound className="text-blue-400" size={40} />

                    </CardContent>

                </Card>

            </div>

            {/* FILTRES */}
            <Card className="bg-slate-900 border border-slate-800">

                <CardContent className="p-6">

                    <div className="flex flex-col lg:flex-row gap-4">

                        <div className="relative flex-1">

                            <Search
                                className="absolute left-4 top-4 text-slate-500"
                                size={18}
                            />

                            <input
                                type="text"
                                placeholder="Rechercher une clé..."
                                value={recherche}
                                onChange={(e) => setRecherche(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white"
                            />

                        </div>

                        <select
                            value={filtre}
                            onChange={(e) => setFiltre(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                        >
                            <option value="toutes">
                                Toutes
                            </option>

                            <option value="active">
                                Actives
                            </option>

                            <option value="revoquee">
                                Révoquées
                            </option>

                        </select>

                    </div>

                </CardContent>

            </Card>

            {/* TABLE */}
            <Card className="bg-slate-900 border border-slate-800 overflow-hidden">

                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                        <LockKeyhole className="text-blue-400" />
                        Liste des clés
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0 overflow-auto">

                    <table className="w-full text-left">

                        <thead className="bg-slate-800 text-slate-300">

                            <tr>
                                <th className="p-5">Nom</th>
                                <th className="p-5">Type</th>
                                <th className="p-5">Algorithme</th>
                                <th className="p-5">Usage</th>
                                <th className="p-5">Créée par</th>
                                <th className="p-5">Statut</th>
                                <th className="p-5">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {clesFiltrees.map((cle) => (

                                <tr
                                    key={cle.id_cle}
                                    className="border-b border-slate-800 hover:bg-slate-800/40 transition-all"
                                >

                                    <td className="p-5 text-white font-medium">
                                        {cle.nom_cle}
                                    </td>

                                    <td className="p-5">

                                        {cle.type_cle === "symetrique" ? (
                                            <Badge className="bg-blue-600 text-white">
                                                Symétrique
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-purple-600 text-white">
                                                Asymétrique
                                            </Badge>
                                        )}

                                    </td>

                                    <td className="p-5 text-slate-300">
                                        {cle.algorithme}
                                    </td>

                                    <td className="p-5 text-slate-300">
                                        {cle.usage_prevu}
                                    </td>

                                    <td className="p-5 text-slate-300">
                                        {cle.cree_par}
                                    </td>

                                    <td className="p-5">

                                        {cle.statut === "active" ? (
                                            <Badge className="bg-green-600 text-white">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-600 text-white">
                                                Révoquée
                                            </Badge>
                                        )}

                                    </td>

                                    <td className="p-5">

                                        <div className="flex items-center gap-4">

                                            <Link
                                                to={`/app/keys/${cle.id_cle}`}
                                                className="text-blue-400 hover:text-blue-300 transition-all"
                                            >
                                                <Eye size={20} />
                                            </Link>

                                            {cle.statut === "active" && (

                                                <button
                                                    onClick={() => revoquerCle(cle.id_cle)}
                                                    className="text-red-400 hover:text-red-300 transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                            )}

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            {!chargement && clesFiltrees.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="p-10 text-center text-slate-500"
                                    >
                                        Aucune clé trouvée.
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