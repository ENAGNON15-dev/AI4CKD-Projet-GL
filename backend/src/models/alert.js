const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Patient = require('./patient');
const Consultation = require('./consultation');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: Patient,
      key: 'id',
    },
    allowNull: false,
  },
  consultationId: {
    type: DataTypes.UUID,
    references: {
      model: Consultation,
      key: 'id',
    },
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // Ex: "Créatinine Élevée", "Tension Artérielle Élevée", "Perte de Poids Rapide"
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  declencheeA: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  resolue: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

Patient.hasMany(Alert, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Alert.belongsTo(Patient, { foreignKey: 'patientId' });
Consultation.hasMany(Alert, { foreignKey: 'consultationId', onDelete: 'CASCADE' });
Alert.belongsTo(Consultation, { foreignKey: 'consultationId' });

module.exports = Alert;