import bcrypt from "bcryptjs";
import db from "../config/database.js";
import { enregistrerAudit } from "../services/auditService.js";

export async function listerUtilisateurs(req, res) {
    try {
        const [utilisateurs] = await db.query(
            `SELECT 
        id_utilisateur,
        nom_utilisateur,
        email,
        role,
        statut,
        date_creation
      FROM utilisateurs
      ORDER BY date_creation DESC`
        );

        res.json({
            message: "Liste des utilisateurs récupérée avec succès",
            total: utilisateurs.length,
            utilisateurs,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs",
            erreur: error.message,
        });
    }
}

export async function creerUtilisateur(req, res) {
    try {
        const { nom_utilisateur, email, mot_de_passe, role, statut = "actif" } = req.body;
        const cree_par = req.utilisateur.id_utilisateur;

        if (!nom_utilisateur || !email || !mot_de_passe || !role) {
            return res.status(400).json({
                message: "nom_utilisateur, email, mot_de_passe et role sont obligatoires",
            });
        }

        const rolesValides = ["administrateur", "gestionnaire_cles", "auditeur"];
        const statutsValides = ["actif", "inactif"];

        if (!rolesValides.includes(role)) {
            return res.status(400).json({
                message: "Rôle invalide",
                roles_acceptes: rolesValides,
            });
        }

        if (!statutsValides.includes(statut)) {
            return res.status(400).json({
                message: "Statut invalide",
                statuts_acceptes: statutsValides,
            });
        }

        const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

        const [resultat] = await db.query(
            `INSERT INTO utilisateurs
      (nom_utilisateur, email, mot_de_passe_hache, role, statut)
      VALUES (?, ?, ?, ?, ?)`,
            [nom_utilisateur, email, motDePasseHache, role, statut]
        );

        const idUtilisateurCree = resultat.insertId;

        await enregistrerAudit({
            id_utilisateur: cree_par,
            action: "creation_utilisateur",
            type_cible: "utilisateur",
            id_cible: idUtilisateurCree,
            adresse_ip: req.ip,
            resultat: "succes",
            details: `Utilisateur ${nom_utilisateur} créé avec le rôle ${role}`,
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            utilisateur: {
                id_utilisateur: idUtilisateurCree,
                nom_utilisateur,
                email,
                role,
                statut,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de l'utilisateur",
            erreur: error.message,
        });
    }
}