import dbConnexion from './Config/dbconnexion.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

//Initialisation de notre application avec express
const app = express();

//Middlewares
app.use(express.json());

//Routes 
app.get('/', (req, res) => {
  res.status(200).send('Serveur en cours d\'execution');
});

app.get('/db', async (req, res) => {
    try {
      const [rows] = await dbConnexion.query('SELECT 1');
      res.json({ message: 'Connexion MySQL réussie !', result: rows });
    } catch (error) {
      res.status(500).json({ error: 'Erreur de connexion à MySQL', details: error.message});
    }
  });

 



//Gestion du port 
const port = process.env.PORT || 3000;

// starts a simple http server locally on port 3000
app.listen(port, '127.0.0.1', () => {
  console.log('Notre application a bien démarré : 127.0.0.1:3000');
});

// run with `node server.mjs`
