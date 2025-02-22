//Requêtes 

export const addUserQuery = `INSERT INTO into users(email, password, role) WHERE(?, ?, ?, ?)`;

export const getUserByIdQuery = `SELECT id, email FROM users WHERE id = ?`;

export const updateUserQuery = `UPDATE users SET email = ?, password = ? WHERE id = ?`;

export const deleteUserQuery = `DELETE FROM users WHERE id = ?`;