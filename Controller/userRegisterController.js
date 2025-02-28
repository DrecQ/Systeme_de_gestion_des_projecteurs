import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserEmail, registerUser } from "../queries/userQueries.js";

// Inscription d'un utilisateur
export async function register(req, res) {
    try {
        const { email, password, role = 'etudiant' } = req.body;  // Ajout du role avec une valeur par défaut

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe requis !" });
        }
        // Vérification si l'utilisateur existe déjà
        const existingUser = await getUserEmail(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Cet email existe déjà" });
        }

         // Hachage du mot de passe avec bcrypt
         const hashedPassword = await bcrypt.hash(password, 10);

         // Enregistrer l'utilisateur en base de données
         const { success, message } = await registerUser(email, hashedPassword, role);
 
         if (!success) {
             return res.status(500).json({ success: false, message });
         }
 
         return res.status(201).json({ success: true, message: "Utilisateur inscrit avec succès" });
 
     } catch (err) {
         return res.status(500).json({ success: false, error: err.message });
     }
}
