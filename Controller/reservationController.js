import * as queries from "../queries/reservationsQueries.js";

// Ajouter une réservation
export async function addReservation(req, res) {
    let { user_id, projector_id, debut_emprunt, fin_emprunt } = req.body;

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

    // Créer la réservation
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
