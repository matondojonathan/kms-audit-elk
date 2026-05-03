import { useState } from "react";
import { KeyRound, Info } from "lucide-react";
import { toast } from "sonner";

export default function GenerateKey() {
  const [formData, setFormData] = useState({
    name: "",
    type: "symmetric",
    algorithm: "AES-256",
    usage: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Clé cryptographique générée avec succès");
    setFormData({ name: "", type: "symmetric", algorithm: "AES-256", usage: "" });
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      algorithm: type === "symmetric" ? "AES-256" : "RSA-2048",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Générer une clé</h1>
        <p className="text-gray-600 mt-1">Création d'une nouvelle clé cryptographique</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la clé
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: api-key-prod-2026"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de clé
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTypeChange("symmetric")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.type === "symmetric"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">Symétrique</p>
                  <p className="text-xs text-gray-600 mt-1">Même clé pour chiffrement et déchiffrement</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("asymmetric")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.type === "asymmetric"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">Asymétrique</p>
                  <p className="text-xs text-gray-600 mt-1">Paire de clés publique/privée</p>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 mb-2">
                Algorithme
              </label>
              <select
                id="algorithm"
                value={formData.algorithm}
                onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formData.type === "symmetric" ? (
                  <>
                    <option value="AES-256">AES-256</option>
                    <option value="AES-128">AES-128</option>
                    <option value="ChaCha20">ChaCha20</option>
                  </>
                ) : (
                  <>
                    <option value="RSA-2048">RSA-2048</option>
                    <option value="RSA-4096">RSA-4096</option>
                    <option value="ECDSA-256">ECDSA-256</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-2">
                Usage prévu
              </label>
              <input
                id="usage"
                type="text"
                value={formData.usage}
                onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ex: Signature API, Chiffrement données, etc."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-5 h-5" />
              Générer la clé
            </button>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Information importante</p>
            <p className="text-sm text-blue-800 mt-1">
              Chaque génération de clé est automatiquement enregistrée dans les journaux d'audit.
              Les clés générées sont stockées de manière sécurisée et chiffrées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
