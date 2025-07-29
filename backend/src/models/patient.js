const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sexe: {
    type: DataTypes.ENUM('Homme', 'Femme', 'Autre'),
    allowNull: false,
  },
  antecedents: {
    type: DataTypes.TEXT, // Pour stocker les antécédents médicaux
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Patient;