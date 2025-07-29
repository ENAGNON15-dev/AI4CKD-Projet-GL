const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Patient = require('./patient');

const Consultation = sequelize.define('Consultation', {
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
  dateConsultation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  tensionArterielle: {
    type: DataTypes.STRING, // Ex: "120/80"
    allowNull: true,
  },
  creatinine: {
    type: DataTypes.FLOAT, // mg/dL ou µmol/L
    allowNull: true,
  },
  poids: {
    type: DataTypes.FLOAT, // kg
    allowNull: true,
  },
  glycemie: {
    type: DataTypes.FLOAT, // mg/dL ou mmol/L
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Patient.hasMany(Consultation, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Consultation.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = Consultation;