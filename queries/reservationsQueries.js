
//Requêtes 

export const addReservationQuery = `INSERT INTO reservations (user_id, projector_id, debut_emprunt, fin_emprunt)
    VALUES (?, ?, ?, ?);`;

export const getReservationByIdQuery = ` SELECT * FROM reservations WHERE id = ?; `;

export const updateReservationQuery = ` UPDATE reservations SET debut_emprunt = ?, fin_emprunt = ? WHERE id = ?; `;

export const deleteReservationQuery = ` DELETE FROM reservations WHERE id = ?; `;
