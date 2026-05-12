import express from "express";
import { obtenirStatistiques } from "../controllers/statsController.js";
import { verifierToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifierToken, obtenirStatistiques);

export default router;