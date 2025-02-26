import express from "express";
import register from "../Controller/userRegisterController.js";
import loginUser from "../Controller/userLoginController.js";


const Router = express.Router();

// Route pour l'inscription
Router.post('/register', register);

// Route pour la connexion
Router.post('/login', loginUser); 

export default Router;
