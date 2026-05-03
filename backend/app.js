import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "./config/database.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ==========================
// ROUTE D'ACCUEIL
// ==========================
app.get("/", (req, res) => {
  res.json({
    message: "API KMS Audit ELK opérationnelle",
  });
});

// ==========================
// TEST CONNEXION MYSQL
// ==========================
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS date_serveur");

    res.json({
      message: "Connexion MySQL réussie",
      date_serveur: rows[0].date_serveur,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur de connexion à MySQL",
      erreur: error.message,
    });
  }
});

// ==========================
// CONNEXION UTILISATEUR
// ==========================
app.post("/api/auth/login", async (req, res) => {
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
      await db.query(
        `INSERT INTO journaux_audit 
        (id_utilisateur, action, type_cible, id_cible, adresse_ip, resultat, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          utilisateur.id_utilisateur,
          "connexion",
          "utilisateur",
          utilisateur.id_utilisateur,
          req.ip,
          "echec",
          "Mot de passe incorrect",
        ]
      );

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

    await db.query(
      `INSERT INTO journaux_audit 
      (id_utilisateur, action, type_cible, id_cible, adresse_ip, resultat, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateur.id_utilisateur,
        "connexion",
        "utilisateur",
        utilisateur.id_utilisateur,
        req.ip,
        "succes",
        "Connexion réussie",
      ]
    );

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
});

// ==========================
// CREATION D'UNE CLE AES-256
// ==========================
app.post("/api/cles", async (req, res) => {
  try {
    const { nom_cle, usage_prevu, id_utilisateur } = req.body;

    if (!nom_cle || !usage_prevu || !id_utilisateur) {
      return res.status(400).json({
        message: "nom_cle, usage_prevu et id_utilisateur sont obligatoires",
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

    await db.query(
      `INSERT INTO journaux_audit
      (id_utilisateur, action, type_cible, id_cible, adresse_ip, resultat, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_utilisateur,
        "creation_cle",
        "cle",
        idCleCreee,
        req.ip,
        "succes",
        `Clé ${nom_cle} créée`,
      ]
    );

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
      valeur_cle_generee: cle,
      avertissement:
        "Cette valeur ne doit normalement pas être affichée en clair en production.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la clé",
      erreur: error.message,
    });
  }
});

// ==========================
// LISTE DES CLES
// ==========================
app.get("/api/cles", async (req, res) => {
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
      INNER JOIN utilisateurs u
      ON c.cree_par = u.id_utilisateur
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
});

// ==========================
// REVOCATION D'UNE CLE
// ==========================
app.put("/api/cles/:id/revoquer", async (req, res) => {
  try {
    const id_cle = req.params.id;
    const { id_utilisateur } = req.body;

    if (!id_utilisateur) {
      return res.status(400).json({
        message: "id_utilisateur obligatoire",
      });
    }

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

    await db.query(
      `INSERT INTO journaux_audit
      (id_utilisateur, action, type_cible, id_cible, adresse_ip, resultat, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_utilisateur,
        "revocation_cle",
        "cle",
        id_cle,
        req.ip,
        "succes",
        `Clé ${cle.nom_cle} révoquée`,
      ]
    );

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
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});