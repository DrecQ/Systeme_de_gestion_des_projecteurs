import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticate(req, res, next) {
    console.log("Headers reçus:", req.headers); // 🔍 Voir si Authorization est bien reçu
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Accès refusé. Aucun token fourni." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute userId et role à req.user
        console.log(token);
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Token invalide ou expiré" });
    }
}
