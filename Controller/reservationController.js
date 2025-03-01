import { createReservation, getAllReservations, deleteReservation } from "../queries/reservationsQueries.js";
import { getProjectorById } from "../queries/projectorsQueries.js";

// Réserver un projecteur
export async function addReservation(req, res) {
    try {
        const { user_id, projector_id, debut_emprunt, fin_emprunt } = req.body;

        // Vérifier si le projecteur existe
        const projector = await getProjectorById(projector_id);
        if (!projector) {
            return res.status(400).json({ success: false, message: "Projecteur introuvable" });
        }

        // Vérifier si le projecteur est disponible (vous pouvez ajouter une logique de vérification de disponibilité ici)

        // Insérer la réservation
        const result = await createReservation(user_id, projector_id, debut_emprunt, fin_emprunt);
        if (result.success) {
            res.status(201).json({ success: true, message: result.message, id: result.insertId });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Lister les réservations
export async function listReservations(req, res) {
    try {
        const reservations = await getAllReservations();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Annuler une réservation
export async function cancelReservation(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteReservation(id);
        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, message: result.message });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}