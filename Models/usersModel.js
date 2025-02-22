import pool from "../Config/dbconnexion.js";
import * as queries from '../queries/userQueries.js';

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
                role ENUM('administrateur', 'etudiant', 'enseignant') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
        );

        console.log('La Table [users] a été crée avec succès !');
        connection.release();
    }catch(err){
        console.error('Erreur lors de la creation de la table :', err.message);
    }

}

//Fonction pour la creation
export async function addUser(email, password, role ='etudiant')
{
    try
    {
        const [result] = await pool.query(queries.addUserQuery, [email, password, role]);
        return result.insertId;

    }catch(err){
        console.error('Erreur au cours de l\'insertion de l\'utilisateur :', err.message)
    }
}

//Fonction pour la recuperation
export async function getUsers(id) {

    try 
    {
        const [rows] = await pool.query(queries.getUserByIdQuery, [id]);
        return rows[0];
        
    } catch (err) {
        console.error('Erreur au cours de la recherche de l\'utilisateur :', err.message)
    }
    
}

//Fonction pour la modification 
export async function updateUser(id, email, password, role) {
    try 
    {
      await pool.query(queries.updateUserQuery, [id, email, password, role]);
      console.log('L\'utilisateur ${id} a été mise à jour : ${email}, ${password}, {$role}');
      
    } catch (err) {
        console.error('Erreur au cours de la mise à jour :', err.message);
    }
}

//Fonction pour la suppression 

export async function deleteUser(id) {

    try
    {
        await pool.query(queries.deleteUserQuery, [id]);
        console.log('L\'utilisateur ${id} a bien été supprimé');

    }catch(err){
        console.error('Erreur au cours de la suppression :', err.message);
    }
    
}



export default {createUserTable};