import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

type Utilisateur = {
    id_utilisateur: number;
    nom_utilisateur: string;
    email: string;
    role: string;
    statut: string;
};

export default function Users() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        apiRequest("/utilisateurs")
            .then((data) => {
                setUtilisateurs(data.utilisateurs || data.users || []);
            })
            .catch((error) => {
                setErreur(error.message);
                setUtilisateurs([]);
            });
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Utilisateurs</h1>

            {erreur && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {erreur}
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-4">Nom</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Rôle</th>
                            <th className="p-4">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateurs.map((user) => (
                            <tr key={user.id_utilisateur} className="border-b">
                                <td className="p-4">{user.nom_utilisateur}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.role}</td>
                                <td className="p-4">{user.statut}</td>
                            </tr>
                        ))}

                        {utilisateurs.length === 0 && (
                            <tr>
                                <td className="p-4 text-slate-500" colSpan={4}>
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}