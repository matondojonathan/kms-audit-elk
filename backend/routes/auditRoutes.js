import express from "express";
import { listerJournauxAudit } from "../controllers/auditController.js";
import { verifierToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifierToken, listerJournauxAudit);

export default router;