import express from "express";
import { creerUtilisateur, listerUtilisateurs } from "../controllers/userController.js";
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

router.get("/", verifierToken, listerUtilisateurs);

router.post(
    "/",
    verifierToken,
    verifierRole("administrateur"),
    creerUtilisateur
);

export default router;