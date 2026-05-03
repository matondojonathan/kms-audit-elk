import { useState } from "react";
import { Search, Download, BarChart3, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const auditData = [
  { user: "admin@kms.com", action: "Création de clé", targetType: "Clé", targetId: "api-key-prod-2026", ip: "192.168.1.10", result: "Succès", timestamp: "24/04/2026 14:32:15", details: "Nouvelle clé RSA-2048 générée" },
  { user: "user.martin@kms.com", action: "Consultation", targetType: "Clé", targetId: "encryption-key-01", ip: "192.168.1.45", result: "Succès", timestamp: "24/04/2026 14:28:42", details: "Consultation métadonnées" },
  { user: "admin@kms.com", action: "Révocation", targetType: "Clé", targetId: "legacy-key-2025", ip: "192.168.1.10", result: "Succès", timestamp: "24/04/2026 14:15:30", details: "Clé obsolète révoquée" },
  { user: "user.dupont@kms.com", action: "Tentative consultation", targetType: "Clé", targetId: "admin-key-master", ip: "192.168.1.67", result: "Échec", timestamp: "24/04/2026 14:10:18", details: "Permissions insuffisantes" },
  { user: "auditor@kms.com", action: "Export journal", targetType: "Audit", targetId: "audit-log-april", ip: "192.168.1.22", result: "Succès", timestamp: "24/04/2026 13:55:09", details: "Export CSV des logs" },
  { user: "user.martin@kms.com", action: "Modification rôle", targetType: "Utilisateur", targetId: "user.dupont@kms.com", ip: "192.168.1.45", result: "Succès", timestamp: "24/04/2026 12:30:45", details: "Rôle changé: Auditeur → Gestionnaire" },
  { user: "admin@kms.com", action: "Création utilisateur", targetType: "Utilisateur", targetId: "user.nouveau@kms.com", ip: "192.168.1.10", result: "Succès", timestamp: "24/04/2026 11:15:22", details: "Nouveau compte créé" },
  { user: "user.dupont@kms.com", action: "Tentative connexion", targetType: "Authentification", targetId: "login-attempt", ip: "192.168.1.67", result: "Échec", timestamp: "24/04/2026 10:45:33", details: "Mot de passe incorrect" },
];

const chartData = [
  { date: "19 Avr", actions: 45, errors: 2 },
  { date: "20 Avr", actions: 52, errors: 1 },
  { date: "21 Avr", actions: 38, errors: 0 },
  { date: "22 Avr", actions: 67, errors: 4 },
  { date: "23 Avr", actions: 58, errors: 3 },
  { date: "24 Avr", actions: 73, errors: 2 },
];

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    result: "",
  });

  const filteredLogs = auditData.filter((log) => {
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
    if (filters.result && log.result !== filters.result) return false;
    return true;
  });

  const errorCount = auditData.filter(log => log.result === "Échec").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Journaux d'audit</h1>
        <p className="text-gray-600 mt-1">Surveillance et traçabilité des actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Actions par jour</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="actions" fill="#2563eb" />
              <Bar dataKey="errors" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Indicateurs</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total d'actions</p>
              <p className="text-2xl font-bold text-blue-600">{auditData.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Échecs / Erreurs</p>
              <p className="text-2xl font-bold text-orange-600">{errorCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux de succès</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(((auditData.length - errorCount) / auditData.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Utilisateur..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Action..."
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={filters.result}
            onChange={(e) => setFilters({ ...filters, result: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tous les résultats</option>
            <option value="Succès">Succès</option>
            <option value="Échec">Échec</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors">
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type cible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID cible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date et heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.targetType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{log.targetId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.result === "Succès"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
