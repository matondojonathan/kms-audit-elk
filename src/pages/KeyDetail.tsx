import { Link } from "react-router-dom";

export default function KeyDetail() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Détail de la clé</h1>

            <div className="bg-white p-8 rounded-xl shadow">
                <p className="text-slate-600 mb-4">
                    Cette page servira à afficher les détails d’une clé cryptographique.
                </p>

                <p className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
                    La valeur réelle de la clé ne doit pas être affichée en clair.
                </p>

                <Link to="/app/keys" className="text-blue-600">
                    Retour à la liste des clés
                </Link>
            </div>
        </div>
    );
}