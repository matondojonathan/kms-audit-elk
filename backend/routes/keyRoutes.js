import express from "express";
import { creerCle, listerCles, revoquerCle } from "../controllers/keyController.js";
import { verifierToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

function verifierRole(rolesAutorises) {
    return (req, res, next) => {
        const roles = Array.isArray(rolesAutorises) ? rolesAutorises : [rolesAutorises];

        if (!req.utilisateur || !roles.includes(req.utilisateur.role)) {
            return res.status(403).json({
                message: "Accès interdit : rôle insuffisant",
            });
        }

        next();
    };
}

router.get("/", verifierToken, listerCles);

router.post(
    "/",
    verifierToken,
    verifierRole(["administrateur", "gestionnaire_cles"]),
    creerCle
);

router.put(
    "/:id/revoquer",
    verifierToken,
    verifierRole(["administrateur", "gestionnaire_cles"]),
    revoquerCle
);

export default router;