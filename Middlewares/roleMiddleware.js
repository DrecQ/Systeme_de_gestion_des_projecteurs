export function isAdmin(req, res, next) {
    // Vérifie si l'utilisateur a un rôle d'administrateur
    if (req.user.role !== 'administrateur') {
        return res.status(403).json({ success: false, message: "Accès interdit, administrateur uniquement" });
    }
    next();
}
