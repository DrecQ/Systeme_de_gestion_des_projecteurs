import pool from "../Config/dbconnexion.js";
import dotenv from 'dotenv';

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
                identifiant_projecteur VARCHAR(30) NOT NULL UNIQUE,
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

export default {createProjectorTable};