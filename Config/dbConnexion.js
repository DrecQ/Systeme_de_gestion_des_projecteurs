import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Création d'un pool de connexions sans spécifier la base (pour pouvoir la créer)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Vérification de la connexion
export async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à MySQL réussie !');
    connection.release();
  } catch (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
  }
}

// Vérification et création de la base de données si elle n'existe pas
export async function verifDatabase() {
  const dbName = process.env.DB_NAME;
  try {
    const connection = await pool.getConnection();

    // Vérifier si la base existe
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [dbName]
    );

    if (rows[0].count === 0) {
      console.log(`Base de données '${dbName}' en cours de création...`);
      await connection.query(`CREATE DATABASE \`${dbName}\`;`);
      console.log(`Base de données '${dbName}' créée avec succès !`);
    } else {
      console.log(`La base de données '${dbName}' existe déjà.`);
    }

    connection.release();

  } catch (err) {
    console.error('Erreur lors de la vérification/création de la base de données :', err.message);
  }
}

// Appel des fonctions
await checkConnection();
await verifDatabase();

// Création d'un pool avec la base de données sélectionnée
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default dbPool;
