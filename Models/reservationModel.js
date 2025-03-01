import pool from "../Config/dbConnexion.js"; 
import dotenv from "dotenv";

dotenv.config();

// Création de la table de réservation
export async function createReservationTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                reservation_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                projector_id INT NOT NULL,
                reservation_date DATE NOT NULL,
                status ENUM('reserved', 'available') DEFAULT 'available',
                debut_emprunt DATETIME NOT NULL,
                fin_emprunt DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (projector_id) REFERENCES projectors(projector_id) ON DELETE CASCADE
            );`
        );

        console.log("La table [reservations] a été créée avec succès !");
    } catch (err) {
        console.error("Erreur lors de la création de la table :", err.message);
        throw err;
    }
}

export default {createReservationTable};