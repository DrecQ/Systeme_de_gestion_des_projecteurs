import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticate(req, res, next) {
    // Récupère le token après "Bearer"
    const token = req.headers.authorization?.split(" ")[1];

    // Vérifie si le token est présent
    if (!token) {
        return res.status(401).json({ success: false, message: "Accès refusé. Aucun token fourni." });
    }

    // Vérifie que la clé secrète existe dans l'environnement
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ success: false, message: "Clé secrète pour le JWT non définie." });
    }

    try {
        // Vérifie et décode le token avec la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ajoute les informations utilisateur (userId, role, etc.) à req.user
        req.user = decoded;

        next();  // Passe à la suite du traitement
    } catch (err) {
        // Log de l'erreur pour un meilleur debug en développement (ne pas exposer en prod)
        console.error("Erreur lors de la vérification du token:", err.message);
        return res.status(403).json({ success: false, message: "Token invalide ou expiré" });
    }
}

// Fonction pour vérifier les rôles autorisés
export function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        // Vérifie si le rôle de l'utilisateur est défini et s'il est inclus dans les rôles autorisés
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Accès refusé. Vous n'avez pas les droits pour effectuer cette action." });
        }

        // Si l'utilisateur a un rôle autorisé, on passe au middleware suivant
        next(); 
    };
}

export default {authenticate, authorizeRole};