import express from 'express';
import dotenv from 'dotenv';


import {createProjectorTable} from './Models/projectorModel.js';
import {createUserTable} from './Models/usersModel.js';
import { createReservationTable } from './Models/reservationModel.js';
import router from './Routes/routes.js';



//Utilisation des variables d'environnement
dotenv.config();

//Initialisation de notre application avec express
const app = express();

//Middlewares
app.use(express.json());



//Fonctions pour créer la base de données et les tables 
 
  async function initDatabase()
  {
      //Creation de la table users
      await createUserTable();

      //Creation de la table projectors 
      await createProjectorTable();

      //Création de la table reservations 
      await createReservationTable();
  }

  initDatabase();

//Routes 
app.get('/', (req, res) => {
  res.status(200).send('Serveur en cours d\'execution');
});


 
// Route d'inscription
app.post('/register', register);

// Route de connexion
app.post('/login', login);

// Routes pour les projecteurs
app.post('/projectors', addProjector);
app.get('/projectors', listProjectors);
app.put('/projectors/:id', modifyProjector);
app.delete('/projectors/:id', removeProjector);

// Routes pour les réservations
app.post('/reservations', addReservation);
app.get('/reservations', listReservations);
app.delete('/reservations/:id', cancelReservation)

//Gestion du port 
const port = process.env.PORT || 3000;

// starts a simple http server locally on port 3000
app.listen(port, '127.0.0.1', () => {
  console.log('Notre application a bien démarré : 127.0.0.1:3000');
});

// run with `node server.mjs`

