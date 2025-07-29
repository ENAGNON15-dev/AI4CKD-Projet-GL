const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/db');

// Import des modèles pour la synchronisation
require('./models/patient');
require('./models/consultation');
require('./models/alert');
require('./models/user'); // <-- Nouveau: Import du modèle User

const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const alertRoutes = require('./routes/alertRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- Nouveau: Import des routes d'authentification
const { protect } = require('./middleware/authMiddleware'); // <-- Nouveau: Import du middleware de protection

const app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes d'authentification (accessibles sans token)
app.use('/api/auth', authRoutes); // <-- Nouveau: Routes d'authentification

// Appliquer le middleware de protection à toutes les routes API existantes
// Cela signifie que toutes les routes ci-dessous nécessiteront un token JWT valide
app.use('/api/patients', protect, patientRoutes); // <-- Ajout de 'protect'
app.use('/api/consultations', protect, consultationRoutes); // <-- Ajout de 'protect'
app.use('/api/alerts', protect, alertRoutes); // <-- Ajout de 'protect'
app.use('/api/pdf', protect, pdfRoutes); // <-- Ajout de 'protect'

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  // Synchronise les modèles avec la base de données (crée les tables si elles n'existent pas)
  // 'alter: true' met à jour les tables existantes sans les supprimer si elles existent
  await sequelize.sync({ alter: true });
  console.log('Modèles de base de données synchronisés.');

  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
  });
};

startServer();
