import express from 'express';
import dotenv from 'dotenv';
import {createProjectorTable} from './Models/projectorModel.js';
import {createUserTable} from './Models/usersModel.js';
import { createReservationTable } from './Models/reservationModel.js';
import { authenticate } from './Middlewares/authMiddleware.js';
import Router from './Routes/routes.js';

//Utilisation des variables d'environnement
dotenv.config();

//Initialisation de notre application avec express
const app = express();

//Middlewares
app.use(express.json());


//Fonctions pour créer la base de données et les tables 
 
  async function initDatabase()
  {
      //Fonction pour la creation de la table [users]
      await createUserTable();

      //Fonction pour la creation de la table [projectors]
      await createProjectorTable();

      //Fonction pour la creation de la table [reservations]
      await createReservationTable();
  }

  initDatabase();

//Routes 
//Route pour tester l'etat du serveur
app.get('/', (req, res) => {
  res.status(200).send('Serveur en cours d\'execution');
});

//Route pour l'inscription et la connexion
app.use('/register', Router);
app.use('/login', Router);


// Routes protégées (nécessitent un token JWT)
app.use('/profile', authenticate);
app.use('/reservations', authenticate);



app.use('/', Router);
/**
 * Pour l'inscription [POST /api/register]
 * Pour la connexion [POST /api/login]
 */




 



//Gestion du port 
const port = process.env.PORT || 3000;

// starts a simple http server locally on port 3000
app.listen(port, '127.0.0.1', () => {
  console.log('Notre application a bien démarré : 127.0.0.1:3000');
});

// run with `node server.mjs`
