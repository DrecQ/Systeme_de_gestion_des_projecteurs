import pool from "../Config/dbConnexion.js";

// Vérifier la disponibilité d'un projecteur
export async function checkProjectorAvailability(projectorId) {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT * FROM reservations WHERE projector_id = ? AND status = 'reserved'`;
        const [rows] = await connection.query(sql, [projectorId]);

        connection.release();
        return rows.length === 0; // Si aucune réservation n'est trouvée, c'est disponible
    } catch (err) {
        console.error("Erreur lors de la vérification de la disponibilité :", err.message);
        return false;
    }
}

// Réserver un projecteur
export async function reserveProjector(req, res) {
    const { projectorId, userId, reservationDate } = req.body;

    // Vérifier la disponibilité du projecteur
    const isAvailable = await checkProjectorAvailability(projectorId);

    if (!isAvailable) {
        return res.status(400).json({ success: false, message: "Le projecteur est déjà réservé." });
    }

    try {
        const connection = await pool.getConnection();

        // Enregistrer la réservation
        const sql = `INSERT INTO reservations (projector_id, user_id, reservation_date, status) VALUES (?, ?, ?, 'reserved')`;
        const [result] = await connection.query(sql, [projectorId, userId, reservationDate]);

        connection.release();
        return res.status(200).json({ success: true, message: "Réservation réussie", reservationId: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la réservation du projecteur :", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}
