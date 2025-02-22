import pool from "../Config/dbconnexion.js";
import dotenv from 'dotenv';
import * as queries from '../queries/projectorsQueries.js';

dotenv.config();

//Creation de la table Utilisateurs

export async function createProjectorTable(){

    try
    {
        const connection = await pool.getConnection();
        await connection.query(`USE \`${process.env.DB_NAME}\`;`)
        await connection.query(
            `CREATE TABLE IF NOT EXISTS projectors(
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom_proj VARCHAR(30) NOT NULL UNIQUE,
                batiment VARCHAR(255) NOT NULL,
                etat enum('fonctionnel', 'en panne', 'hors service') NOT NULL DEFAULT 'fonctionnel',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
        );

        console.log('La Table [projectors] a été crée avec succès !');
        connection.release();
    }catch(err){
        console.error('Erreur lors de la creation de la table :', err.message);
    }

}

//Fonction pour la creation
export async function addProjector(nom_proj, batiment, etat='fonctionnel')
{
    try
    {
        const [result] = await pool.query(queries.addProjectorQuery, [nom_proj, batiment, etat]);
        return result.insertId;

    }catch(err){
        console.error('Erreur au cours de l\'insertion du projecteur :', err.message)
    }
}

//Fonction pour la recuperation
export async function getProjecor(id) {

    try 
    {
        const [rows] = await pool.query(queries.getProjectorByIdQuery, [id]);
        return rows[0];
        
    } catch (err) {
        console.error('Erreur au cours de la recherche du projecteur :', err.message)
    }
    
}

//Fonction pour la modification 
export async function updateProjector(id, etat) {
    try 
    {
      await pool.query(queries.updateProjectorQuery, [id, etat]);
      console.log('Projecteur ${id} a été mise à jour : {$etat}');

    } catch (err) {
        console.error('Erreur au cours de la mise à jour :', err.message);
    }
}

//Fonction pour la suppression 

export async function deleteProjector(id) {

    try
    {
        await pool.query(queries.deleteProjectorQuery, [id]);
        console.log('Le projecteur ${id} a bien été supprimé');

    }catch(err){
        console.error('Erreur au cours de la suppression :', err.message);
    }
    
}


export default {
    createProjectorTable,
    addProjector,
    getProjecor,
    updateProjector,
    deleteProjector    
};