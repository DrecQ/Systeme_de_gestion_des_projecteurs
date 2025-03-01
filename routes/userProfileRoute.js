import express from "express";
import {authMiddleware } from "../Middlewares/authMiddleware.js"; // Chemin vers ton middleware d'authentification
import { getUserById } from "../queries/userQueries.js"; // Import de la fonction pour récupérer un utilisateur par ID

const router = express.Router();

// Route protégée pour récupérer les informations de l'utilisateur authentifié
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // L'ID de l'utilisateur est dans le token décrypté (req.user)
        
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Retourne les informations de l'utilisateur (sans le mot de passe)
        const { email, role, created_at } = user;
        return res.status(200).json({
            success: true,
            user: { email, role, created_at }
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
