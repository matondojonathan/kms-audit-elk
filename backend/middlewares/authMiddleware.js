import jwt from "jsonwebtoken";

export function verifierToken(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                message: "Accès refusé : token manquant",
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Accès refusé : format du token invalide",
            });
        }

        const utilisateur = jwt.verify(token, process.env.JWT_SECRET);

        req.utilisateur = utilisateur;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Accès refusé : token invalide ou expiré",
        });
    }
}