import pool from "../Config/dbConnexion.js"; 
import * as queries from "../queries/reservationsQueries.js"; 
import dotenv from "dotenv";

dotenv.config();

// Création de la table de réservation des projecteurs
export async function createReservationTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                projector_id INT NOT NULL,
                debut_emprunt DATETIME NOT NULL,
                fin_emprunt DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (projector_id) REFERENCES projectors(projector_id) ON DELETE CASCADE
            );
        `);

        console.log("La table [reservations] a été créée avec succès !");
    } catch (err) {
        console.error("Erreur lors de la création de la table :", err.message);
        throw err;
    }
}

// Fonction pour ajouter une réservation avec vérification de disponibilité
export async function addReservation(user_id, projector_id, debut_emprunt, fin_emprunt) {
    try {
        // Vérifier si le projecteur est déjà réservé à cette période
        const [existingReservations] = await pool.query(queries.checkAvailabilityQuery, [
            projector_id,
            debut_emprunt,
            fin_emprunt
        ]);

        if (existingReservations.length > 0) {
            console.error("Le projecteur est déjà réservé pour cette période.");
            return null; // On peut aussi lever une exception si nécessaire
        }

        const [result] = await pool.query(queries.addReservationQuery, [
            user_id,
            projector_id,
            debut_emprunt,
            fin_emprunt
        ]);
        return result.insertId;
    } catch (err) {
        console.error("Erreur lors de l'ajout de la réservation :", err.message);
        throw err;
    }
}

// Fonction pour récupérer une réservation par ID
export async function getReservation(id) {
    try {
        const [rows] = await pool.query(queries.getReservationByIdQuery, [id]);
        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error("Erreur lors de la récupération de la réservation :", err.message);
        throw err;
    }
}

// Fonction pour mettre à jour une réservation (modifier les dates)
export async function updateReservation(id, debut_emprunt, fin_emprunt) {
    try {
        await pool.query(queries.updateReservationQuery, [debut_emprunt, fin_emprunt, id]);
        console.log(`Réservation ${id} mise à jour : Début ${debut_emprunt}, Fin ${fin_emprunt}`);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la réservation :", err.message);
        throw err;
    }
}

// Fonction pour supprimer une réservation
export async function deleteReservation(id) {
    try {
        await pool.query(queries.deleteReservationQuery, [id]);
        console.log(`Réservation ${id} supprimée avec succès.`);
    } catch (err) {
        console.error("Erreur lors de la suppression de la réservation :", err.message);
        throw err;
    }
}

export default {
    addReservation,
    getReservation,
    updateReservation,
    deleteReservation
};
