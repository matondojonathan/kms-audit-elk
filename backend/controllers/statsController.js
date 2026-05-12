import db from "../config/database.js";

export async function obtenirStatistiques(req, res) {
    try {
        const [[clesActives]] = await db.query(
            "SELECT COUNT(*) AS total FROM cles_cryptographiques WHERE statut = 'active'"
        );

        const [[clesRevoquees]] = await db.query(
            "SELECT COUNT(*) AS total FROM cles_cryptographiques WHERE statut = 'revoquee'"
        );

        const [[utilisateursActifs]] = await db.query(
            "SELECT COUNT(*) AS total FROM utilisateurs WHERE statut = 'actif'"
        );

        const [[actionsAuditees]] = await db.query(
            "SELECT COUNT(*) AS total FROM journaux_audit"
        );

        res.json({
            message: "Statistiques récupérées avec succès",
            statistiques: {
                cles_actives: clesActives.total,
                cles_revoquees: clesRevoquees.total,
                utilisateurs_actifs: utilisateursActifs.total,
                actions_auditees: actionsAuditees.total,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des statistiques",
            erreur: error.message,
        });
    }
}