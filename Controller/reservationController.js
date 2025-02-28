import * as queries from "../queries/reservationsQueries.js";
import pool from "../Config/dbConnexion.js";


// Fonction pour vérifier les rôles autorisés
export function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Accès refusé. Vous n'avez pas les droits pour effectuer cette action." });
        }
        next(); 
    };
}

// Ajouter une réservation
export async function addReservation(req, res) {
    let { user_id, projector_id, debut_emprunt, fin_emprunt } = req.body;

    // Vérification des rôles (par exemple, autoriser seulement les enseignants et administrateurs)
    authorizeRole(['enseignant', 'administrateur'])(req, res, async () => {
        // Vérification des champs obligatoires
        if (!user_id || !projector_id) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
        }

        // Si la date de début n'est pas fournie, on prend la date et l'heure actuelle
        if (!debut_emprunt) {
            debut_emprunt = new Date().toISOString();
        }

        // Si la fin n'est pas fournie, on l'ajoute automatiquement 4 heures après le début
        if (!fin_emprunt) {
            const debutDate = new Date(debut_emprunt);
            debutDate.setHours(debutDate.getHours() + 4);  // Ajoute 4 heures à l'heure de début
            fin_emprunt = debutDate.toISOString();
        }

        // Validation des dates
        const debutDate = new Date(debut_emprunt);
        const finDate = new Date(fin_emprunt);
        
        if (isNaN(debutDate) || isNaN(finDate)) {
            return res.status(400).json({ success: false, message: "Les dates fournies sont invalides" });
        }

        if (finDate <= debutDate) {
            return res.status(400).json({ success: false, message: "La date de fin doit être après la date de début" });
        }

        // Vérification de la disponibilité du projecteur
        const isProjectorAvailable = await checkProjectorAvailability(projector_id, debut_emprunt, fin_emprunt);
        if (!isProjectorAvailable) {
            return res.status(400).json({ success: false, message: "Ce projecteur est déjà réservé pour la période sélectionnée." });
        }

        // Créer la réservation
        const result = await queries.createReservation(user_id, projector_id, debut_emprunt, fin_emprunt);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(500).json(result);
        }
    });
}

// Vérification de la disponibilité du projecteur
async function checkProjectorAvailability(projector_id, debut_emprunt, fin_emprunt) {
    const query = `
        SELECT * FROM reservations
        WHERE projector_id = ? 
        AND (
            (debut_emprunt BETWEEN ? AND ?) OR 
            (fin_emprunt BETWEEN ? AND ?) OR 
            (? BETWEEN debut_emprunt AND fin_emprunt) OR 
            (? BETWEEN debut_emprunt AND fin_emprunt)
        )
    `;

    try {
        const result = await pool.query(query, [projector_id, debut_emprunt, fin_emprunt, debut_emprunt, fin_emprunt, debut_emprunt, fin_emprunt]);
        // Si aucune réservation n'est trouvée, le projecteur est disponible
        return result.length === 0; 
    } catch (error) {
        console.error("Erreur lors de la vérification de la disponibilité du projecteur :", error.message);
        throw error;
    }
}

// Lister toutes les réservations
export async function listReservations(req, res) {
    const reservations = await queries.getAllReservations();

    if (reservations.length > 0) {
        res.status(200).json(reservations);
    } else {
        res.status(404).json({ success: false, message: "Aucune réservation trouvée" });
    }
}

// Annuler une réservation
export async function cancelReservation(req, res) {
    const { id } = req.params;

    // Vérification des rôles (par exemple, autoriser uniquement les administrateurs à annuler)
    authorizeRole(['administrateur'])(req, res, async () => {
        const result = await queries.deleteReservation(id);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    });
}

export default { addReservation, listReservations, cancelReservation };
