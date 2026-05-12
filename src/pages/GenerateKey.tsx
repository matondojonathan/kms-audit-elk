import { useState } from "react";
import { apiRequest } from "../services/api";

import {
    KeyRound,
    ShieldCheck,
    ShieldAlert,
    LockKeyhole,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import { Badge } from "../components/ui/badge";

export default function GenerateKey() {
    const [nomCle, setNomCle] = useState("");
    const [usagePrevu, setUsagePrevu] = useState("");

    const [typeCle, setTypeCle] = useState<"symetrique" | "asymetrique">("symetrique");
    const [algorithme, setAlgorithme] = useState("AES-256");

    const [message, setMessage] = useState("");
    const [erreur, setErreur] = useState("");

    const changerTypeCle = (type: "symetrique" | "asymetrique") => {
        setTypeCle(type);

        if (type === "symetrique") {
            setAlgorithme("AES-256");
        } else {
            setAlgorithme("RSA-2048");
        }
    };

    const genererCle = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");
        setErreur("");

        try {
            const data = await apiRequest("/cles", {
                method: "POST",
                body: JSON.stringify({
                    nom_cle: nomCle,
                    usage_prevu: usagePrevu,
                    type_cle: typeCle,
                    algorithme: algorithme,
                }),
            });

            setMessage(
                `Clé créée avec succès : ${data.cle.nom_cle} (${data.cle.type_cle} - ${data.cle.algorithme})`
            );

            setNomCle("");
            setUsagePrevu("");
            setTypeCle("symetrique");
            setAlgorithme("AES-256");
        } catch (error: any) {
            setErreur(error.message);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Génération de clés
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Création sécurisée de clés symétriques et asymétriques.
                    </p>
                </div>

                <Badge className="bg-blue-600 text-white px-4 py-2">
                    KMS sécurisé
                </Badge>
            </div>

            {message && (
                <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded-xl">
                    {message}
                </div>
            )}

            {erreur && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-xl">
                    {erreur}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border border-slate-800 xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <KeyRound className="text-blue-400" />
                            Nouvelle clé cryptographique
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={genererCle} className="space-y-6">
                            <div>
                                <label className="block text-slate-300 mb-3">
                                    Nom de la clé
                                </label>

                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500"
                                    value={nomCle}
                                    onChange={(e) => setNomCle(e.target.value)}
                                    placeholder="ex: cle_signature_api_2026"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-3">
                                    Usage prévu
                                </label>

                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500"
                                    value={usagePrevu}
                                    onChange={(e) => setUsagePrevu(e.target.value)}
                                    placeholder="ex: signature API, chiffrement données..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-3">
                                    Type de clé
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => changerTypeCle("symetrique")}
                                        className={`p-5 rounded-xl border text-left transition-all ${typeCle === "symetrique"
                                                ? "bg-blue-600/20 border-blue-500"
                                                : "bg-slate-800 border-slate-700 hover:border-slate-500"
                                            }`}
                                    >
                                        <p className="text-white font-semibold">Symétrique</p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Même clé pour chiffrer et déchiffrer.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changerTypeCle("asymetrique")}
                                        className={`p-5 rounded-xl border text-left transition-all ${typeCle === "asymetrique"
                                                ? "bg-purple-600/20 border-purple-500"
                                                : "bg-slate-800 border-slate-700 hover:border-slate-500"
                                            }`}
                                    >
                                        <p className="text-white font-semibold">Asymétrique</p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Paire logique clé publique / privée.
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 mb-3">
                                    Algorithme
                                </label>

                                <select
                                    value={algorithme}
                                    onChange={(e) => setAlgorithme(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white"
                                >
                                    {typeCle === "symetrique" ? (
                                        <option value="AES-256">AES-256</option>
                                    ) : (
                                        <>
                                            <option value="RSA-2048">RSA-2048</option>
                                            <option value="ECC">ECC</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                                <p className="text-slate-300 text-sm">
                                    Type sélectionné :{" "}
                                    <span className="text-white font-semibold">
                                        {typeCle === "symetrique" ? "Symétrique" : "Asymétrique"}
                                    </span>{" "}
                                    — Algorithme :{" "}
                                    <span className="text-white font-semibold">{algorithme}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
                            >
                                <LockKeyhole size={22} />
                                Générer la clé
                            </button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <ShieldCheck className="text-green-400" />
                                Sécurité
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="bg-slate-800 rounded-xl p-4">
                                <p className="text-slate-300 text-sm">
                                    Les clés générées sont masquées côté interface.
                                </p>
                            </div>

                            <div className="bg-slate-800 rounded-xl p-4">
                                <p className="text-slate-300 text-sm">
                                    Chaque génération est enregistrée dans les journaux d’audit.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <ShieldAlert className="text-yellow-400" />
                                Algorithmes
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">AES-256</span>
                                <Badge className="bg-green-600 text-white">Symétrique</Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">RSA-2048</span>
                                <Badge className="bg-blue-600 text-white">Asymétrique</Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">ECC</span>
                                <Badge className="bg-purple-600 text-white">Asymétrique</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}