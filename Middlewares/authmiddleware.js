import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticate(req, res, next) {
    //console.log("Headers reçus :", req.headers); debug

    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Token extrait :", token); debug

    if (!token) {
        return res.status(401).json({ success: false, message: "Accès refusé. Aucun token fourni." });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: "Clé secrète pour le JWT non définie." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Utilisateur décodé :", decoded); debug

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Erreur lors de la vérification du token :", err.message);
        return res.status(403).json({ success: false, message: "Token invalide ou expiré" });
    }
}
