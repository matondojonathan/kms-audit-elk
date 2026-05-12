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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API KMS Audit ELK opérationnelle",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cles", keyRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/utilisateurs", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});