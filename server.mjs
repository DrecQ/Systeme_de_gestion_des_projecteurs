import express from 'express';
import dotenv from 'dotenv';
import { createProjectorTable } from './Models/projectorModel.js';
import { createUserTable } from './Models/usersModel.js';
import { createReservationTable } from './Models/reservationModel.js';
import { authenticate } from './Middlewares/authMiddleware.js';
import router from './Routes/routes.js';

// Utilisation des variables d'environnement
dotenv.config();

// Initialisation de notre application avec express
const app = express();

// Middleware pour parser les requêtes en JSON
app.use(express.json());

// Fonction pour créer la base de données et les tables 
async function initDatabase() {
    try {
        // Création des tables
        await createUserTable();
        await createProjectorTable();
        await createReservationTable();
        console.log("Base de données et tables créées avec succès.");
    } catch (error) {
        console.error("Erreur lors de la création des tables :", error.message);
    }
}

// Initialisation de la base de données
initDatabase();

// Route d'accueil pour tester l'état du serveur
app.get('/', (req, res) => {
    res.status(200).send('Serveur en cours d\'exécution');
});

// Route d'aide pour l'utilisateur
app.get('/help', (req, res) => {
    res.status(200).json({
        message: 'Bienvenue dans l\'API ! Voici les routes disponibles :',
        routes: {
            '/register': {
                method: 'POST',
                description: 'Inscrire un nouvel utilisateur (fournir un nom, un email, et un mot de passe)',
            },
            '/login': {
                method: 'POST',
                description: 'Se connecter avec un utilisateur existant (fournir email et mot de passe)',
            },
            '/projectors': {
                method: 'GET',
                description: 'Lister tous les projecteurs disponibles.',
            },
            '/projectors': {
                method: 'POST',
                description: 'Ajouter un nouveau projecteur (nécessite un token d\'administrateur ou enseignant)',
            },
            '/reservations': {
                method: 'GET',
                description: 'Lister toutes les réservations.',
            },
            '/reservations': {
                method: 'POST',
                description: 'Faire une réservation de projecteur (nécessite un token d\'enseignant ou administrateur)',
            },
            '/reservations/:id': {
                method: 'DELETE',
                description: 'Annuler une réservation (nécessite un token d\'administrateur)',
            },
            '/profile': {
                method: 'GET',
                description: 'Obtenir le profil de l\'utilisateur connecté (nécessite un token valide)',
            },
        }
    });
});

// Routes pour l'inscription et la connexion
app.use('/register', router);  
app.use('/login', router);     

// Routes sécurisées nécessitant un middleware d'authentification
app.use('/profile', authenticate); 
app.use('/reservations', authenticate);

// Routes protégées pour les projecteurs et réservations
app.use("/projectors", authenticate);  
app.use("/reservations", authenticate); 

// Routes pour le reste de l'application (projecteurs, réservations, etc.)
app.use('/', router);

// Gestion du port
const port = process.env.PORT || 3000;

// Démarrage du serveur avec gestion d'erreur
app.listen(port, '127.0.0.1', (err) => {
    if (err) {
        console.error("Erreur lors du démarrage du serveur :", err.message);
    } else {
        console.log(`Notre application a bien démarré : http://127.0.0.1:${port}`);
    }
});

// Run avec `node server.mjs`
