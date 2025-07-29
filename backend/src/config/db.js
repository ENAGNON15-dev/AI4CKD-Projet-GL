const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Désactive les logs SQL dans la console
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données PostgreSQL réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };