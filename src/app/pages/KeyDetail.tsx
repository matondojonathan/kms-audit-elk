import { useParams, Link } from "react-router";
import { ArrowLeft, Key, Shield, Calendar, User, XCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const keyDetailsData: Record<string, any> = {
  "1": {
    name: "api-key-prod-2026",
    type: "Asymétrique",
    algorithm: "RSA-2048",
    usage: "Signature API",
    status: "Active",
    createdBy: "admin@kms.com",
    createdAt: "24/04/2026 14:32:15",
    revokedAt: null,
    history: [
      { action: "Création de clé", user: "admin@kms.com", timestamp: "24/04/2026 14:32:15", result: "Succès" },
      { action: "Consultation", user: "user.martin@kms.com", timestamp: "24/04/2026 15:10:22", result: "Succès" },
    ],
  },
  "2": {
    name: "encryption-key-01",
    type: "Symétrique",
    algorithm: "AES-256",
    usage: "Chiffrement données",
    status: "Active",
    createdBy: "admin@kms.com",
    createdAt: "20/04/2026 10:15:30",
    revokedAt: null,
    history: [
      { action: "Création de clé", user: "admin@kms.com", timestamp: "20/04/2026 10:15:30", result: "Succès" },
      { action: "Consultation", user: "user.martin@kms.com", timestamp: "24/04/2026 14:28:42", result: "Succès" },
      { action: "Consultation", user: "auditor@kms.com", timestamp: "23/04/2026 11:45:18", result: "Succès" },
    ],
  },
  "3": {
    name: "legacy-key-2025",
    type: "Asymétrique",
    algorithm: "RSA-2048",
    usage: "Authentification",
    status: "Révoquée",
    createdBy: "user.martin@kms.com",
    createdAt: "15/03/2025 09:20:45",
    revokedAt: "24/04/2026 14:15:30",
    history: [
      { action: "Création de clé", user: "user.martin@kms.com", timestamp: "15/03/2025 09:20:45", result: "Succès" },
      { action: "Consultation", user: "admin@kms.com", timestamp: "10/04/2026 08:30:12", result: "Succès" },
      { action: "Révocation", user: "admin@kms.com", timestamp: "24/04/2026 14:15:30", result: "Succès" },
    ],
  },
};

export default function KeyDetail() {
  const { id } = useParams();
  const [showValue, setShowValue] = useState(false);
  const keyData = id ? keyDetailsData[id] : null;

  if (!keyData) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Clé non trouvée</p>
          <Link to="/app/keys" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Retour à la liste des clés
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/app/keys" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des clés
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Détails de la clé</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Informations générales</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nom de la clé</p>
                <p className="text-lg font-medium text-gray-900 font-mono">{keyData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="text-lg font-medium text-gray-900">{keyData.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Algorithme</p>
                <p className="text-lg font-medium text-gray-900">{keyData.algorithm}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Usage prévu</p>
                <p className="text-lg font-medium text-gray-900">{keyData.usage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  keyData.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}>
                  {keyData.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Valeur de la clé</h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Clé privée / Valeur chiffrée</p>
                <button
                  onClick={() => setShowValue(!showValue)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  {showValue ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Afficher
                    </>
                  )}
                </button>
              </div>
              {showValue ? (
                <p className="text-xs font-mono text-gray-500 bg-white p-3 rounded border border-gray-200 break-all">
                  ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
                </p>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Valeur protégée</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Masquée pour des raisons de sécurité. Seuls les administrateurs autorisés peuvent consulter la valeur réelle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Historique des actions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date et heure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keyData.history.map((entry: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{entry.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          entry.result === "Succès"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {entry.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900">Dates importantes</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de création</p>
                <p className="text-sm font-medium text-gray-900">{keyData.createdAt}</p>
              </div>
              {keyData.revokedAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date de révocation</p>
                  <p className="text-sm font-medium text-orange-600">{keyData.revokedAt}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Créateur</h2>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Créée par</p>
              <p className="text-sm font-medium text-gray-900">{keyData.createdBy}</p>
            </div>
          </div>

          {keyData.status === "Active" && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Révoquer cette clé
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
