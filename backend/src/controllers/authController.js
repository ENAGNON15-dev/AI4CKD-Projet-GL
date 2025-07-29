const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Import de jsonwebtoken
require('dotenv').config(); // Pour accéder à process.env.JWT_SECRET

// Fonction utilitaire pour générer un JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Le token expire après 1 heure
  });
};

// Contrôleur pour l'enregistrement d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si un utilisateur avec cet email existe déjà
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà avec cet email.' });
    }

    // Crée un nouvel utilisateur (le hachage du mot de passe est géré par le hook du modèle)
    const user = await User.create({ email, password });

    // Génère un token JWT pour l'utilisateur nouvellement enregistré
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      email: user.email,
      token, // Renvoie le token à l'utilisateur
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.', error: error.message });
  }
};

// Contrôleur pour la connexion d'un utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cherche l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Compare le mot de passe fourni avec le mot de passe haché stocké
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Génère un token JWT pour l'utilisateur connecté
    const token = generateToken(user.id);

    res.status(200).json({
      id: user.id,
      email: user.email,
      token, // Renvoie le token à l'utilisateur
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.', error: error.message });
  }
};