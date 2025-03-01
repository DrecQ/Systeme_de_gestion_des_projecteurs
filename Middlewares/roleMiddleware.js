export function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        // console.log("Rôle de l'utilisateur :", req.user.role); debug
        // Vérifie si le rôle de l'utilisateur est défini et s'il est inclus dans les rôles autorisés
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Accès refusé. Vous n'avez pas les droits pour effectuer cette action." });
        }

        // Si l'utilisateur a un rôle autorisé, on passe au middleware suivant
        next(); 
    };
}
