const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'enregistrement d'un nouvel utilisateur
router.post('/register', authController.registerUser);

// Route pour la connexion d'un utilisateur existant
router.post('/login', authController.loginUser);

module.exports = router;
