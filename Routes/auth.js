const express = require('express');
const bcrypt = require('bcryptjs');
import pool from '../Config/dbconnexion.js';
import * as queries from '../queries/userQueries.js'; 

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [user] = await pool.query(queries.getUserByIdQuery, [email]); // Utilisation de la requête pour récupérer un utilisateur par email

    if (user.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données avec un rôle par défaut ('etudiant')
    const result = await pool.query(queries.addUserQuery, [email, hashedPassword, 'etudiant']);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
