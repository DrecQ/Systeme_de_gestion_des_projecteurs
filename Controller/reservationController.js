import * as queries from "../queries/reservationsQueries.js";
import pool from "../Config/dbConnexion.js";

// Ajouter une réservation
export async function addReservation(req, res) {
    try {
        let { user_id, projector_id, debut_emprunt, fin_emprunt } = req.body;

        // Vérification des champs obligatoires
        if (!user_id || !projector_id) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
        }

        // Si la date de début n'est pas fournie, on prend la date et l'heure actuelles
        if (!debut_emprunt) {
            debut_emprunt = new Date().toISOString();
        }

        // Par défaut, on implémente comme durée de validation d'un emprunt 4h de temps
        if (!fin_emprunt) {
            const debutDate = new Date(debut_emprunt);
            debutDate.setHours(debutDate.getHours() + 4);
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

        // Création de la réservation
        const result = await queries.createReservation(user_id, projector_id, debut_emprunt, fin_emprunt);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réservation :", error.message);
        return res.status(500).json({ success: false, message: "Une erreur est survenue." });
    }
}

// Vérifier la disponibilité du projecteur
async function checkProjectorAvailability(projector_id, debut_emprunt, fin_emprunt) {
    const query = `
        SELECT * FROM reservations
        WHERE projector_id = ? 
        AND (
            (debut_emprunt < ? AND fin_emprunt > ?) OR  -- Le début de la nouvelle réservation est avant la fin d'une réservation existante
            (debut_emprunt < ? AND fin_emprunt > ?)    -- La fin de la nouvelle réservation est après le début d'une réservation existante
        )
    `;
    console.log("Vérification disponibilité projecteur : ", projector_id, debut_emprunt, fin_emprunt);

    try {
        const result = await pool.query(query, [projector_id, debut_emprunt, debut_emprunt, fin_emprunt, fin_emprunt]);
        // console.log("Résultat de la vérification : ", result);  
        return result.length === 0;  
    } catch (error) {
        console.error("Erreur lors de la vérification de la disponibilité :", error.message);
        throw error;
    }
}

// Lister toutes les réservations
export async function listReservations(req, res) {
    try {
        const reservations = await queries.getAllReservations();
        if (reservations.length > 0) {
            return res.status(200).json(reservations);
        } else {
            return res.status(404).json({ success: false, message: "Aucune réservation trouvée" });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error.message);
        return res.status(500).json({ success: false, message: "Une erreur est survenue." });
    }
}

// Annuler une réservation
export async function cancelReservation(req, res) {
    try {
        const { id } = req.params;
        const result = await queries.deleteReservation(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error("Erreur lors de l'annulation de la réservation :", error.message);
        return res.status(500).json({ success: false, message: "Une erreur est survenue." });
    }
}

export default { addReservation, listReservations, cancelReservation };
