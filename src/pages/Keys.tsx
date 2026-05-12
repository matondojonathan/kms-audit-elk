import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { Link } from "react-router-dom";

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

    const chargerCles = () => {
        apiRequest("/cles")
            .then((data) => setCles(data.cles))
            .catch(console.error);
    };

    useEffect(() => {
        chargerCles();
    }, []);

    const revoquerCle = async (id: number) => {
        await apiRequest(`/cles/${id}/revoquer`, {
            method: "PUT",
            body: JSON.stringify({ id_utilisateur: 1 }),
        });

        chargerCles();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Clés cryptographiques</h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-4">Nom</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Algorithme</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cles.map((cle) => (
                            <tr key={cle.id_cle} className="border-b">
                                <td className="p-4">{cle.nom_cle}</td>
                                <td className="p-4">{cle.type_cle}</td>
                                <td className="p-4">{cle.algorithme}</td>
                                <td className="p-4">{cle.usage_prevu}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${cle.statut === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {cle.statut}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <Link className="text-blue-600" to={`/app/keys/${cle.id_cle}`}>
                                        Voir
                                    </Link>
                                    {cle.statut === "active" && (
                                        <button
                                            onClick={() => revoquerCle(cle.id_cle)}
                                            className="text-red-600"
                                        >
                                            Révoquer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}