import express from 'express';
import dotenv from 'dotenv';

import { login } from './Controller/userLoginController.js';
import { register } from './Controller/userRegisterController.js';
import { addProjector, listProjectors, modifyProjector, removeProjector } from './Controller/projectorController.js';
import { addReservation, listReservations, cancelReservation } from './Controller/reservationController.js';
import {createProjectorTable} from './Models/projectorModel.js';
import {createUserTable} from './Models/usersModel.js';
import { createReservationTable } from './Models/reservationModel.js';

import { authenticate } from './Middlewares/authMiddleware.js';
import router from './Routes/routes.js';

//Utilisation des variables d'environnement
dotenv.config();

//Initialisation de notre application avec express
const app = express();

//Middlewares
app.use(express.json());
app.use("/api", userProfileRoute);
app.use("/api",adminRoute);


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
app.use('/register', router);
app.use('/login', router);


// Routes protégées (nécessitent un token JWT)
app.use('/profile', authenticate);
app.use('/reservations', authenticate);



app.use('/', router);
/**
 * Pour l'inscription [POST /api/register]
 * Pour la connexion [POST /api/login]
 */




 
// // Route d'inscription
// app.post('/register', register);

// // Route de connexion
// app.post('/login', login);

// // Routes pour les projecteurs
// app.post('/projectors', addProjector);
// app.get('/projectors', listProjectors);
// app.put('/projectors/:id', modifyProjector);
// app.delete('/projectors/:id', removeProjector);

// // Routes pour les réservations
// app.post('/reservations', addReservation);
// app.get('/reservations', listReservations);
// app.delete('/reservations/:id', cancelReservation)

//Gestion du port 
const port = process.env.PORT || 3000;

// starts a simple http server locally on port 3000
app.listen(port, '127.0.0.1', () => {
  console.log('Notre application a bien démarré : 127.0.0.1:3000');
});

// run with `node server.mjs`

