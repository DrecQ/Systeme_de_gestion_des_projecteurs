import pool from "../Config/dbConnexion.js";
import reservationModel from "../Models/reservationModel.js";

// Ajouter une réservation
export async function createReservation(user_id, projector_id, debut_emprunt, fin_emprunt) {
    try {
        // Si debut_emprunt n'est pas fourni, on prend la date actuelle
        if (!debut_emprunt) {
            debut_emprunt = new Date().toISOString();
        }

        // Si fin_emprunt n'est pas fourni, on ajoute 4 heures à debut_emprunt
        if (!fin_emprunt) {
            const debutDate = new Date(debut_emprunt);
            debutDate.setHours(debutDate.getHours() + 4);  // Ajoute 4 heures à debut_emprunt
            fin_emprunt = debutDate.toISOString();
        }

        const connection = await pool.getConnection();

        const sql = `
            INSERT INTO reservations (user_id, projector_id, debut_emprunt, fin_emprunt)
            VALUES (?, ?, ?, ?);
        `;
        const [result] = await connection.query(sql, [user_id, projector_id, debut_emprunt, fin_emprunt]);

        connection.release();
        return { success: true, message: "Réservation ajoutée avec succès", insertId: result.insertId };
    } catch (err) {
        console.error("Erreur lors de l'ajout de la réservation :", err.message);
        return { success: false, error: err.message };
    }
}

// Récupérer toutes les réservations
export async function getAllReservations() {
    try {
        const connection = await pool.getConnection();
        const sql = `
            SELECT r.id, u.email, p.nom_projector, r.debut_emprunt, r.fin_emprunt, r.created_at
            FROM reservations r
            JOIN users u ON r.user_id = u.user_id
            JOIN projectors p ON r.projector_id = p.projector_id;
        `;
        const [rows] = await connection.query(sql);

        connection.release();
        return rows;
    } catch (err) {
        console.error("Erreur lors de la récupération des réservations :", err.message);
        return [];
    }
}

// Récupérer une réservation par ID
export async function getReservationById(reservation_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `
            SELECT r.id, u.email, p.nom_projector, r.debut_emprunt, r.fin_emprunt, r.created_at
            FROM reservations r
            JOIN users u ON r.user_id = u.user_id
            JOIN projectors p ON r.projector_id = p.projector_id
            WHERE r.id = ?;
        `;
        const [rows] = await connection.query(sql, [reservation_id]);

        connection.release();
        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error("Erreur lors de la récupération de la réservation :", err.message);
        return null;
    }
}

// Mettre à jour une réservation
export async function updateReservation(reservation_id, debut_emprunt, fin_emprunt) {
    try {
        // Si fin_emprunt n'est pas fourni, on ajoute 4 heures à debut_emprunt
        if (!fin_emprunt) {
            const debutDate = new Date(debut_emprunt);
            debutDate.setHours(debutDate.getHours() + 4);  // Ajoute 4 heures à debut_emprunt
            fin_emprunt = debutDate.toISOString();
        }

        const connection = await pool.getConnection();
        const sql = `
            UPDATE reservations
            SET debut_emprunt = ?, fin_emprunt = ?
            WHERE id = ?;
        `;
        const [result] = await connection.query(sql, [debut_emprunt, fin_emprunt, reservation_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Réservation mise à jour" : "Aucune modification effectuée" };
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la réservation :", err.message);
        return { success: false, error: err.message };
    }
}

// Supprimer une réservation
export async function deleteReservation(reservation_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `DELETE FROM reservations WHERE id = ?;`;
        const [result] = await connection.query(sql, [reservation_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Réservation supprimée" : "Aucune réservation trouvée" };
    } catch (err) {
        console.error("Erreur lors de la suppression de la réservation :", err.message);
        return { success: false, error: err.message };
    }
}

export default { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation };
