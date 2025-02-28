import express from "express";
import register from "../Controller/userRegisterController.js";
import loginUser from "../Controller/userLoginController.js";
import * as projectorController from "../Controller/projectorController.js";
import * as reservationController from "../Controller/reservationController.js";
import { getUserProfile } from "../Controller/userProfileController.js"; 




const Router = express.Router();

// Route pour l'inscription
Router.post('/register', register);

// Route pour la connexion
Router.post('/login', loginUser); 

//Route pour les projecteurs
Router.post("/projectors", projectorController.addProjector); 
Router.get("/projectors", projectorController.listProjectors); 
Router.put("/projectors/:id", projectorController.modifyProjector); 
Router.delete("/projectors/:id", projectorController.removeProjector);

//Route pour les reservations
Router.post("/reservations", reservationController.addReservation); 
Router.get("/reservations", reservationController.listReservations);
Router.delete("/reservations/:id", reservationController.cancelReservation);

// Route protégée pour récupérer le profil de l'utilisateur
Router.get("/profile", authenticate, getUserProfile);


export default Router;
