import db from "../config/database.js";

export async function enregistrerAudit({
    id_utilisateur,
    action,
    type_cible,
    id_cible = null,
    adresse_ip,
    resultat,
    details,
}) {
    await db.query(
        `INSERT INTO journaux_audit
    (id_utilisateur, action, type_cible, id_cible, adresse_ip, resultat, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id_utilisateur,
            action,
            type_cible,
            id_cible,
            adresse_ip,
            resultat,
            details,
        ]
    );
}