import { Eye, XCircle, Search } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const keysData = [
  {
    id: "1",
    name: "api-key-prod-2026",
    type: "Asymétrique",
    algorithm: "RSA-2048",
    usage: "Signature API",
    status: "Active",
    createdBy: "admin@kms.com",
    createdAt: "24/04/2026 14:32",
  },
  {
    id: "2",
    name: "encryption-key-01",
    type: "Symétrique",
    algorithm: "AES-256",
    usage: "Chiffrement données",
    status: "Active",
    createdBy: "admin@kms.com",
    createdAt: "20/04/2026 10:15",
  },
  {
    id: "3",
    name: "legacy-key-2025",
    type: "Asymétrique",
    algorithm: "RSA-2048",
    usage: "Authentification",
    status: "Révoquée",
    createdBy: "user.martin@kms.com",
    createdAt: "15/03/2025 09:20",
  },
  {
    id: "4",
    name: "backup-key-2025",
    type: "Symétrique",
    algorithm: "AES-256",
    usage: "Backup système",
    status: "Active",
    createdBy: "admin@kms.com",
    createdAt: "01/01/2025 08:00",
  },
  {
    id: "5",
    name: "dev-test-key",
    type: "Asymétrique",
    algorithm: "RSA-2048",
    usage: "Environnement test",
    status: "Active",
    createdBy: "user.dupont@kms.com",
    createdAt: "18/04/2026 16:45",
  },
  {
    id: "6",
    name: "mobile-app-key",
    type: "Symétrique",
    algorithm: "AES-256",
    usage: "Application mobile",
    status: "Active",
    createdBy: "user.martin@kms.com",
    createdAt: "10/04/2026 11:30",
  },
];

export default function Keys() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredKeys = keysData.filter((key) =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.usage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clés cryptographiques</h1>
        <p className="text-gray-600 mt-1">Gestion des clés de sécurité</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la clé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage prévu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée par</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 font-mono">{key.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{key.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{key.algorithm}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{key.usage}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      key.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{key.createdBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{key.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/app/keys/${key.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Link>
                      {key.status === "Active" && (
                        <button className="text-orange-600 hover:text-orange-800 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          Révoquer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredKeys.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Aucune clé trouvée</p>
        </div>
      )}
    </div>
  );
}
