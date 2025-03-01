
import { getUserEmail, registerUser } from "../queries/userQueries.js";

// Recuperation de l'email et du mot de passe 
export async function register(req, res) {
    try {

        // Ajout du role avec etudiant par défaut
        const { email, password, role = 'etudiant' } = req.body;  

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe requis !" });
        }
        // Vérification si l'utilisateur existe déjà
        const existingUser = await getUserEmail(email);

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Cet email existe déjà" });
        }


        // Sauvegarde de l'utilisateur avec le mot de passe hacher dans la base de données 
        await registerUser(email, password, role);

        return res.status(201).json({ success: true, message: "Utilisateur inscrit avec succès" });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export default register;

