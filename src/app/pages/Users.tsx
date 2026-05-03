import { UserCheck, UserX, Edit3 } from "lucide-react";

const usersData = [
  {
    id: "1",
    username: "admin@kms.com",
    email: "admin@kms.com",
    role: "Administrateur",
    status: "Actif",
    createdAt: "01/01/2025 08:00",
  },
  {
    id: "2",
    username: "user.martin@kms.com",
    email: "user.martin@kms.com",
    role: "Gestionnaire de clés",
    status: "Actif",
    createdAt: "15/01/2025 10:30",
  },
  {
    id: "3",
    username: "user.dupont@kms.com",
    email: "user.dupont@kms.com",
    role: "Gestionnaire de clés",
    status: "Actif",
    createdAt: "20/02/2025 14:15",
  },
  {
    id: "4",
    username: "auditor@kms.com",
    email: "auditor@kms.com",
    role: "Auditeur",
    status: "Actif",
    createdAt: "05/03/2025 09:00",
  },
  {
    id: "5",
    username: "user.ancien@kms.com",
    email: "user.ancien@kms.com",
    role: "Gestionnaire de clés",
    status: "Inactif",
    createdAt: "10/12/2024 16:45",
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Administrateur":
      return "bg-purple-100 text-purple-800";
    case "Gestionnaire de clés":
      return "bg-blue-100 text-blue-800";
    case "Auditeur":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Users() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="text-gray-600 mt-1">Gestion des accès et des rôles</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Rôles disponibles</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h3 className="font-medium text-purple-900">Administrateur</h3>
            <p className="text-sm text-purple-700 mt-1">
              Accès complet à toutes les fonctionnalités. Gestion des utilisateurs et des clés.
            </p>
          </div>
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium text-blue-900">Gestionnaire de clés</h3>
            <p className="text-sm text-blue-700 mt-1">
              Création, consultation et révocation des clés cryptographiques.
            </p>
          </div>
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-medium text-green-900">Auditeur</h3>
            <p className="text-sm text-green-700 mt-1">
              Consultation des journaux d'audit et export des rapports uniquement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom d'utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "Actif"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      {user.status === "Actif" ? (
                        <button className="text-orange-600 hover:text-orange-800 flex items-center gap-1">
                          <UserX className="w-4 h-4" />
                          Désactiver
                        </button>
                      ) : (
                        <button className="text-green-600 hover:text-green-800 flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          Activer
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Edit3 className="w-4 h-4" />
                        Modifier rôle
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
