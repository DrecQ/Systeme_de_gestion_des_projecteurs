import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../Config/dbConnexion.js";

dotenv.config();

// Fonction pour vérifier et décoder le token
export const authenticateToken = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Accès non autorisé, token manquant");
    }

    const token = authHeader.split(" ")[1];

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("Token invalide ou expiré");
    }
};

// Middleware d'authentification
export const authMiddleware = async (req, res, next) => {
    try {
        // Vérifier et décoder le token
        const decoded = authenticateToken(req);

        // Récupérer l'utilisateur depuis la base de données
        const connection = await pool.getConnection();
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);
        const [users] = await connection.query("SELECT * FROM users WHERE user_id = ?", [decoded.user_id]);
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        req.user = users[0]; // Attacher l'utilisateur à la requête
        next(); // Passer au contrôleur suivant

    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};


