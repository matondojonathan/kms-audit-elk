import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import { enregistrerAudit } from "../services/auditService.js";

export async function login(req, res) {
    try {
        const { nom_utilisateur, mot_de_passe } = req.body;

        if (!nom_utilisateur || !mot_de_passe) {
            return res.status(400).json({
                message: "Nom d'utilisateur et mot de passe obligatoires",
            });
        }

        const [utilisateurs] = await db.query(
            "SELECT * FROM utilisateurs WHERE nom_utilisateur = ? LIMIT 1",
            [nom_utilisateur]
        );

        if (utilisateurs.length === 0) {
            return res.status(401).json({
                message: "Identifiants incorrects",
            });
        }

        const utilisateur = utilisateurs[0];

        if (utilisateur.statut !== "actif") {
            return res.status(403).json({
                message: "Compte utilisateur inactif",
            });
        }

        const motDePasseValide = await bcrypt.compare(
            mot_de_passe,
            utilisateur.mot_de_passe_hache
        );

        if (!motDePasseValide) {
            await enregistrerAudit({
                id_utilisateur: utilisateur.id_utilisateur,
                action: "connexion",
                type_cible: "utilisateur",
                id_cible: utilisateur.id_utilisateur,
                adresse_ip: req.ip,
                resultat: "echec",
                details: "Mot de passe incorrect",
            });

            return res.status(401).json({
                message: "Identifiants incorrects",
            });
        }

        const token = jwt.sign(
            {
                id_utilisateur: utilisateur.id_utilisateur,
                nom_utilisateur: utilisateur.nom_utilisateur,
                role: utilisateur.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        await enregistrerAudit({
            id_utilisateur: utilisateur.id_utilisateur,
            action: "connexion",
            type_cible: "utilisateur",
            id_cible: utilisateur.id_utilisateur,
            adresse_ip: req.ip,
            resultat: "succes",
            details: "Connexion réussie",
        });

        res.json({
            message: "Connexion réussie",
            token,
            utilisateur: {
                id_utilisateur: utilisateur.id_utilisateur,
                nom_utilisateur: utilisateur.nom_utilisateur,
                email: utilisateur.email,
                role: utilisateur.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la connexion",
            erreur: error.message,
        });
    }
}