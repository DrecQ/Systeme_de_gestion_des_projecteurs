import express from "express";
import { register } from "../Controller/userRegisterController.js";
import { loginUser } from "../Controller/userLoginController.js";
import * as projectorController from "../Controller/projectorController.js";
import * as reservationController from "../Controller/reservationController.js";
import { getUserProfile } from "../Controller/userProfileController.js";
import { authenticate } from "../Middlewares/authMiddleware.js"; // Vérifie l'authentification
import { authorizeRole } from "../Middlewares/roleMiddleware.js"; // Vérifie les rôles

const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', loginUser); 

// Routes pour la gestion des projecteurs (authentification + autorisation)
router.post("/projectors", authenticate, authorizeRole(['enseignant', 'administrateur']), projectorController.addProjector);
router.get("/projectors", projectorController.listProjectors);
router.put("/projectors/:id", authenticate, authorizeRole(['enseignant', 'administrateur']), projectorController.modifyProjector);
router.delete("/projectors/:id", authenticate, authorizeRole(['enseignant', 'administrateur']), projectorController.removeProjector);

// Route protégée pour récupérer le profil de l'utilisateur
router.get("/profile", authenticate, getUserProfile);

// Routes pour la gestion des réservations
router.get('/reservations', authenticate, reservationController.listReservations);
router.post('/reservations', authenticate, authorizeRole(['enseignant', 'administrateur']), reservationController.addReservation);
router.delete('/reservations/:id', authenticate, authorizeRole(['administrateur']), reservationController.cancelReservation);

export default router;
