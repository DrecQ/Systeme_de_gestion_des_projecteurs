import dbPool from "../Config/dbconnexion";


export const addProjectorQuery =  `INSERT INTO projectors(identifiant_projecteur, batiment, etat) WHERE(?, ?, ?, ?)`;

export const getProjectorByIdQuery = `SELECT * FROM projectors WHERE id = ?`;

export const updateProjectorQuery = `UPDATE projectors SET identifiant_projecteur = ?, batiment = ?, etat = ? WHERE id = ?`;

export const deleteProjectorQuery = `DELETE FROM projectors WHERE id = ?`;