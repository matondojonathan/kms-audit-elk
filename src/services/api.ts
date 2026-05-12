const API_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        throw new Error("Session expirée ou accès refusé");
    }

    if (!response.ok) {
        throw new Error(data.message || "Erreur API");
    }

    return data;
}