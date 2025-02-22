//Requêtes

export const addProjectorQuery =  `INSERT INTO projectors(nom_proj, batiment, etat) WHERE(?, ?, ?, ?)`;

export const getProjectorByIdQuery = `SELECT * FROM projectors WHERE id = ?`;

export const updateProjectorQuery = `UPDATE projectors SET nom_proj = ?, batiment = ?, etat = ? WHERE id = ?`;

export const deleteProjectorQuery = `DELETE FROM projectors WHERE id = ?`;