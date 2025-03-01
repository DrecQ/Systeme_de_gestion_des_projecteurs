import { getUserById } from "../queries/userQueries.js";

// Récupérer le profil de l'utilisateur authentifié
export async function getUserProfile(req, res) {
    try {
        const user = await getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export default { getUserProfile };
