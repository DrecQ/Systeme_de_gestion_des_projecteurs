import express from "express";
import { authenticateToken } from "../Middlewares/authMiddleware.js"; // Assure-toi que le token est validé
import { isAdmin } from "../Middlewares/roleMiddleware.js"; // Vérifie si l'utilisateur est administrateur
import { deleteUser } from "../queries/userQueries.js"; // Exemple de fonction pour supprimer un utilisateur

const router = express.Router();

// Route protégée pour supprimer un utilisateur, uniquement accessible aux administrateurs
router.delete("/admin/user/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const userIdToDelete = req.params.id;

        // Supprime l'utilisateur
        const result = await deleteUser(userIdToDelete);
        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }

        return res.status(200).json({ success: true, message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
