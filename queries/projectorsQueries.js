import pool from "../Config/dbConnexion.js";

//Ajouter un projecteur
export async function createProjector(nom_projector, batiment, etat = "fonctionnel") {
    try {
        const connection = await pool.getConnection();
        const sql = `INSERT INTO projectors (nom_projector, batiment, etat) VALUES (?, ?, ?)`;
        const [result] = await connection.query(sql, [nom_projector, batiment, etat]);

        connection.release();
        return { success: true, message: "Projecteur ajouté avec succès", insertId: result.insertId };
    } catch (err) {
        console.error("Erreur lors de l'ajout du projecteur :", err.message);
        return { success: false, error: err.message };
    }
}

//Récupérer tous les projecteurs
export async function getAllProjectors() {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT * FROM projectors`;
        const [rows] = await connection.query(sql);

        connection.release();
        return rows;
    } catch (err) {
        console.error("Erreur lors de la récupération des projecteurs :", err.message);
        return [];
    }
}

//Récupérer un projecteur par ID
export async function getProjectorById(projector_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT * FROM projectors WHERE projector_id = ?`;
        const [rows] = await connection.query(sql, [projector_id]);

        connection.release();
        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error("Erreur lors de la récupération du projecteur :", err.message);
        return null;
    }
}

//Mettre à jour un projecteur
export async function updateProjector(projector_id, nom_projector, batiment, etat) {
    try {
        const connection = await pool.getConnection();
        const sql = `UPDATE projectors SET nom_projector = ?, batiment = ?, etat = ? WHERE projector_id = ?`;
        const [result] = await connection.query(sql, [nom_projector, batiment, etat, projector_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Projecteur mis à jour" : "Aucune modification effectuée" };
    } catch (err) {
        console.error("Erreur lors de la mise à jour du projecteur :", err.message);
        return { success: false, error: err.message };
    }
}

//Supprimer un projecteur
export async function deleteProjector(projector_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `DELETE FROM projectors WHERE projector_id = ?`;
        const [result] = await connection.query(sql, [projector_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Projecteur supprimé" : "Aucun projecteur trouvé" };
    } catch (err) {
        console.error("Erreur lors de la suppression du projecteur :", err.message);
        return { success: false, error: err.message };
    }
}

export default { createProjector, getAllProjectors, getProjectorById, updateProjector, deleteProjector };
