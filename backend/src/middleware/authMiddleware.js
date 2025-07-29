const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  // Vérifie si le token est présent dans les en-têtes de la requête (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrait le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifie le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupère l'utilisateur sans le mot de passe
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

      if (!req.user) {
        return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé.' });
      }

      next(); // Passe au middleware/contrôleur suivant
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      res.status(401).json({ message: 'Non autorisé, token invalide ou expiré.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token.' });
  }
};

module.exports = { protect };
