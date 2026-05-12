import { useState } from "react";
import { apiRequest } from "../services/api";

export default function GenerateKey() {
    const [nomCle, setNomCle] = useState("");
    const [usagePrevu, setUsagePrevu] = useState("");
    const [message, setMessage] = useState("");

    const genererCle = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const data = await apiRequest("/cles", {
            method: "POST",
            body: JSON.stringify({
                nom_cle: nomCle,
                usage_prevu: usagePrevu,
                id_utilisateur: 1,
            }),
        });

        setMessage(`Clé créée avec succès : ${data.cle.nom_cle}`);
        setNomCle("");
        setUsagePrevu("");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Générer une clé</h1>

            <form onSubmit={genererCle} className="bg-white p-8 rounded-xl shadow max-w-xl space-y-5">
                <div>
                    <label className="block mb-2 font-medium">Nom de la clé</label>
                    <input
                        className="w-full border p-3 rounded-lg"
                        value={nomCle}
                        onChange={(e) => setNomCle(e.target.value)}
                        placeholder="ex: cle_factures_2026"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Usage prévu</label>
                    <input
                        className="w-full border p-3 rounded-lg"
                        value={usagePrevu}
                        onChange={(e) => setUsagePrevu(e.target.value)}
                        placeholder="ex: chiffrement des factures"
                        required
                    />
                </div>

                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                    Algorithme utilisé : AES-256
                </div>

                {message && <p className="text-green-700">{message}</p>}

                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                    Générer la clé
                </button>
            </form>
        </div>
    );
}