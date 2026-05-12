import db from "../config/database.js";

export async function listerJournauxAudit(req, res) {
    try {
        const [journaux] = await db.query(
            `SELECT 
        j.id_journal,
        j.action,
        j.type_cible,
        j.id_cible,
        j.adresse_ip,
        j.resultat,
        j.details,
        j.horodatage,
        u.nom_utilisateur
      FROM journaux_audit j
      LEFT JOIN utilisateurs u ON j.id_utilisateur = u.id_utilisateur
      ORDER BY j.horodatage DESC`
        );

        res.json({
            message: "Journaux d’audit récupérés avec succès",
            total: journaux.length,
            journaux,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des journaux d’audit",
            erreur: error.message,
        });
    }
}