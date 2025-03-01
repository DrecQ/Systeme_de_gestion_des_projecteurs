import express from "express";
import {register} from "../Controller/userRegisterController.js";
import {loginUser} from "../Controller/userLoginController.js";
import * as projectorController from "../Controller/projectorController.js";
import * as reservationController from "../Controller/reservationController.js";
import { getUserProfile } from "../Controller/userProfileController.js";
import { authenticate } from "../Middlewares/authMiddleware.js";
import { authorizeRole } from "../Middlewares/authMiddleware.js";




const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', loginUser); 

//Route pour les projecteurs
router.post("/projectors", projectorController.addProjector); 
router.get("/projectors", projectorController.listProjectors); 
router.put("/projectors/:id", projectorController.modifyProjector); 
router.delete("/projectors/:id", projectorController.removeProjector);

// Route protégée pour récupérer le profil de l'utilisateur
router.get("/profile", authenticate, getUserProfile);

//Route pour les reservations
router.get('/reservations', reservationController.listReservations);

// Route pour ajouter une réservation (accessible uniquement par enseignants et administrateurs)
router.post('/reservations', authenticate, authorizeRole('enseignant', 'administrateur'), reservationController.addReservation);

// Route pour annuler une réservation (accessible uniquement par les administrateurs)
router.delete('/reservations/:id', authenticate, authorizeRole('administrateur'), reservationController.cancelReservation);


export default router;
