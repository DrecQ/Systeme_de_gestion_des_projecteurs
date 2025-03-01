import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { getUserEmail } from "../queries/userQueries.js";

dotenv.config();

export async function loginUser(req, res) {
    try {
        // Récupération de l'email et du mot de passe
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
        }

        // Vérification de l'existence de l'utilisateur 
        const user = await getUserEmail(email);

        if (!user) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // Comparaison des mots de passe (bcrypt pour des raisons de sécurité)
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // Vérification si JWT_SECRET est défini
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Erreur serveur : clé JWT non définie" });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.user_id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(200).json({ success: true, token });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}


export default {loginUser};