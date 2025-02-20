import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Création d'un pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Vérification la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
    return;
  }
  console.log('Connexion à MySQL réussie !');
  connection.release();
});

// Fonction asynchrone pour vérifier si la base de données existe déjà
async function verifDtabase() {
  const dbName = process.env.DB_NAME;
  try {
    // Vérifier si la base de données existe
    const [rows] = await pool.promise().query(
      "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [dbName]
    );

    // Création de la base de données si elle n'existe pas
    if (rows[0].count === 0) {
      console.log('Base de données en cours de création');
      await pool.promise().query(`CREATE DATABASE ${dbName}`);
      console.log('Base de données créée');
    } else {
      console.log('La base de données existe déjà');
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des instances de base de données existantes :', err.message);
  }
}

// Appel de la fonction de vérification
verifDtabase();

export default pool;
