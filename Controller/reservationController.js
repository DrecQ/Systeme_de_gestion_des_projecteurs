import * as queries from "../Models/reservationModel.js";

// Ajouter une réservation
export async function addReservation(req, res) {
    const { user_id, projector_id, debut_emprunt, fin_emprunt } = req.body;

    if (!user_id || !projector_id || !debut_emprunt || !fin_emprunt) {
        return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    const result = await queries.createReservation(user_id, projector_id, debut_emprunt, fin_emprunt);
    
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
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

    const result = await queries.deleteReservation(id);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(404).json(result);
    }
}

export default { addReservation, listReservations, cancelReservation };
