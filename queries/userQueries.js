import pool from "../Config/dbConnexion.js";

//Ajouter un utilisateur (Register)
export async function registerUser(email, password, role) {
    try {
        const connection = await pool.getConnection();

        const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        const [result] = await connection.query(sql, [email, password, role]);

        connection.release();
        return { success: true, message: "Utilisateur enregistré avec succès", insertId: result.insertId };
    } catch (err) {
        console.error("Erreur lors de l'inscription :", err.message);
        return { success: false, error: err.message };
    }
}

//Récupérer tous les utilisateurs
export async function getAllUsers() {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT user_id, email, role, created_at FROM users`; // On ne récupère pas le mot de passe
        const [rows] = await connection.query(sql);

        connection.release();
        return rows;
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err.message);
        return [];
    }
}

//Récupérer un utilisateur par ID
export async function getUserById(user_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT user_id, email, role, created_at FROM users WHERE user_id = ?`;
        const [rows] = await connection.query(sql, [user_id]);

        connection.release();
        return rows.length ? rows[0] : null;
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
        return null;
    }
}

// Récupérer un utilisateur par email
export async function getUserEmail(email) {
    try {
        const connection = await pool.getConnection();

        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await connection.query(sql, [email]);

        connection.release();

        if (rows.length === 0) {
            return null;  // Aucun utilisateur trouvé
        }

        return rows[0];  // Retourner l'utilisateur trouvé
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
        throw new Error(err.message);
    }
}

//Mettre à jour un utilisateur (email et rôle)
export async function updateUser(user_id, email, role) {
    try {
        const connection = await pool.getConnection();
        const sql = `UPDATE users SET email = ?, role = ? WHERE user_id = ?`;
        const [result] = await connection.query(sql, [email, role, user_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Utilisateur mis à jour" : "Aucune modification effectuée" };
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err.message);
        return { success: false, error: err.message };
    }
}

//Supprimer un utilisateur
export async function deleteUser(user_id) {
    try {
        const connection = await pool.getConnection();
        const sql = `DELETE FROM users WHERE user_id = ?`;
        const [result] = await connection.query(sql, [user_id]);

        connection.release();
        return { success: result.affectedRows > 0, message: result.affectedRows > 0 ? "Utilisateur supprimé" : "Aucun utilisateur trouvé" };
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err.message);
        return { success: false, error: err.message };
    }
}

export default { registerUser, getAllUsers, getUserById, updateUser, deleteUser };
