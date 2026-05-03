import { Key, ShieldOff, Users, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Clés actives", value: "142", icon: Key, color: "bg-green-500", textColor: "text-green-600" },
  { label: "Clés révoquées", value: "28", icon: ShieldOff, color: "bg-orange-500", textColor: "text-orange-600" },
  { label: "Utilisateurs actifs", value: "15", icon: Users, color: "bg-blue-500", textColor: "text-blue-600" },
  { label: "Actions auditées", value: "1,247", icon: Activity, color: "bg-purple-500", textColor: "text-purple-600" },
];

const activityData = [
  { date: "19 Avr", actions: 45 },
  { date: "20 Avr", actions: 52 },
  { date: "21 Avr", actions: 38 },
  { date: "22 Avr", actions: 67 },
  { date: "23 Avr", actions: 58 },
  { date: "24 Avr", actions: 73 },
];

const recentActions = [
  { user: "admin@kms.com", action: "Création de clé", target: "api-key-prod-2026", result: "Succès", date: "24/04/2026 14:32" },
  { user: "user.martin@kms.com", action: "Consultation", target: "encryption-key-01", result: "Succès", date: "24/04/2026 14:28" },
  { user: "admin@kms.com", action: "Révocation", target: "legacy-key-2025", result: "Succès", date: "24/04/2026 14:15" },
  { user: "user.dupont@kms.com", action: "Tentative consultation", target: "admin-key-master", result: "Échec", date: "24/04/2026 14:10" },
  { user: "auditor@kms.com", action: "Export journal", target: "audit-log-april", result: "Succès", date: "24/04/2026 13:55" },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme KMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Activités récentes</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actions" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Alertes de sécurité</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-medium text-orange-900">Tentative d'accès non autorisé</p>
              <p className="text-xs text-orange-700 mt-1">user.dupont@kms.com - 24/04/2026 14:10</p>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900">Clé proche de l'expiration</p>
              <p className="text-xs text-yellow-700 mt-1">backup-key-2025 - Expire le 30/04/2026</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">Système opérationnel</p>
              <p className="text-xs text-green-700 mt-1">Tous les services fonctionnent normalement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dernières actions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActions.map((action, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{action.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{action.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{action.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      action.result === "Succès"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {action.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{action.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
