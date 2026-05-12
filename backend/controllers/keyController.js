import crypto from "crypto";
import db from "../config/database.js";
import { enregistrerAudit } from "../services/auditService.js";

export async function creerCle(req, res) {
    try {
        const { nom_cle, usage_prevu } = req.body;
        const id_utilisateur = req.utilisateur.id_utilisateur;

        if (!nom_cle || !usage_prevu) {
            return res.status(400).json({
                message: "nom_cle et usage_prevu sont obligatoires",
            });
        }

        const cle = crypto.randomBytes(32).toString("hex");

        const [resultat] = await db.query(
            `INSERT INTO cles_cryptographiques
      (nom_cle, type_cle, algorithme, usage_prevu, valeur_cle_protegee, statut, cree_par)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nom_cle,
                "symetrique",
                "AES-256",
                usage_prevu,
                cle,
                "active",
                id_utilisateur,
            ]
        );

        const idCleCreee = resultat.insertId;

        await enregistrerAudit({
            id_utilisateur,
            action: "creation_cle",
            type_cible: "cle",
            id_cible: idCleCreee,
            adresse_ip: req.ip,
            resultat: "succes",
            details: `Clé ${nom_cle} créée`,
        });

        res.status(201).json({
            message: "Clé créée avec succès",
            cle: {
                id_cle: idCleCreee,
                nom_cle,
                type_cle: "symetrique",
                algorithme: "AES-256",
                usage_prevu,
                statut: "active",
            },
            avertissement:
                "La valeur réelle de la clé est masquée pour des raisons de sécurité.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de la clé",
            erreur: error.message,
        });
    }
}

export async function listerCles(req, res) {
    try {
        const [cles] = await db.query(
            `SELECT 
        c.id_cle,
        c.nom_cle,
        c.type_cle,
        c.algorithme,
        c.usage_prevu,
        c.statut,
        c.date_creation,
        c.date_revocation,
        u.nom_utilisateur AS cree_par
      FROM cles_cryptographiques c
      INNER JOIN utilisateurs u ON c.cree_par = u.id_utilisateur
      ORDER BY c.date_creation DESC`
        );

        res.json({
            message: "Liste des clés récupérée avec succès",
            total: cles.length,
            cles,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des clés",
            erreur: error.message,
        });
    }
}

export async function revoquerCle(req, res) {
    try {
        const id_cle = req.params.id;
        const id_utilisateur = req.utilisateur.id_utilisateur;

        const [cles] = await db.query(
            "SELECT * FROM cles_cryptographiques WHERE id_cle = ? LIMIT 1",
            [id_cle]
        );

        if (cles.length === 0) {
            return res.status(404).json({
                message: "Clé introuvable",
            });
        }

        const cle = cles[0];

        if (cle.statut === "revoquee") {
            return res.status(400).json({
                message: "Cette clé est déjà révoquée",
            });
        }

        await db.query(
            `UPDATE cles_cryptographiques
      SET statut = ?, date_revocation = NOW()
      WHERE id_cle = ?`,
            ["revoquee", id_cle]
        );

        await enregistrerAudit({
            id_utilisateur,
            action: "revocation_cle",
            type_cible: "cle",
            id_cible: id_cle,
            adresse_ip: req.ip,
            resultat: "succes",
            details: `Clé ${cle.nom_cle} révoquée`,
        });

        res.json({
            message: "Clé révoquée avec succès",
            id_cle,
            nom_cle: cle.nom_cle,
            nouveau_statut: "revoquee",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la révocation de la clé",
            erreur: error.message,
        });
    }
}