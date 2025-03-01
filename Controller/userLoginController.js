import jwt from "jsonwebtoken";
import { getUserEmail } from "../queries/userQueries.js";
import dotenv from 'dotenv';
dotenv.config();

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
        }

        const user = await getUserEmail(email);

        if (!user) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // Comparaison des mots de passe 
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // Génération du token JWT
        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}