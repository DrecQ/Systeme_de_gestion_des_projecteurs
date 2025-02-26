import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
<<<<<<< HEAD
import { getUserEmail } from "../queries/userQueries.js";
=======
import { getUserEmail } from "../queries/userQueries";
>>>>>>> 841d8fc16a47fa2379c7b0ac7b68fc710ae2e3d4


dotenv.config();


export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
        }

        const user = await getUserEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Comparaison des mots de passe avec bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Mot de passe incorrect." });
        }

        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ success: true, token });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
<<<<<<< HEAD

export default loginUser;
=======
>>>>>>> 841d8fc16a47fa2379c7b0ac7b68fc710ae2e3d4
