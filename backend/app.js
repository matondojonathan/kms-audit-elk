import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import keyRoutes from "./routes/keyRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API KMS Audit ELK opérationnelle",
    environnement: process.env.NODE_ENV || "development",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const db = (await import("./config/database.js")).default;
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

app.use("/api/auth", authRoutes);
app.use("/api/cles", keyRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/utilisateurs", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});