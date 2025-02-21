import pool from "../Config/dbconnexion.js";

//Creation de la table Utilisateurs

export async function createUserTable(){

    try
    {
        const connection = await pool.getConnection();

        await connection.query(`USE \`${process.env.DB_NAME}\`;`)
        await connection.query(
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('administrateur', 'etudiant', 'enseignement') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
        );

        console.log('La Table [users] a été crée avec succès !');
        connection.release();
    }catch(err){
        console.error('Erreur lors de la creation de la table :', err.message);
    }

}

export default {createUserTable};