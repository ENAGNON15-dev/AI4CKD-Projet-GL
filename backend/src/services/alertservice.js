const Alert = require('../models/alert');
const Patient = require('../models/patient');
const Consultation = require('../models/consultation');

// Règles d'alerte configurables (exemple)
const alertRules = {
  creatinine: {
    seuilHomme: 1.3, // mg/dL
    seuilFemme: 1.0, // mg/dL
    message: (valeur, sexe) => `La créatinine (${valeur} mg/dL) est élevée pour un(e) ${sexe}.`,
  },
  tensionArterielle: {
    seuilSys: 140, // mmHg
    seuilDia: 90, // mmHg
    message: (sys, dia) => `La tension artérielle (${sys}/${dia} mmHg) est élevée.`,
  },
  poidsRapide: {
    pourcentageChute: 0.05, // 5% de chute de poids
    periodeJours: 30, // sur 30 jours
    message: (chute) => `Chute de poids rapide (${(chute * 100).toFixed(2)}%) détectée.`,
  }
  // Ajoutez d'autres règles ici
};

async function checkAndGenerateAlerts(consultation) {
  const patient = await Patient.findByPk(consultation.patientId);
  if (!patient) return;

  const { creatinine, tensionArterielle, poids, dateConsultation } = consultation;
  const generatedAlerts = [];

  // Alerte créatinine
  if (creatinine) {
    const seuil = patient.sexe === 'Homme' ? alertRules.creatinine.seuilHomme : alertRules.creatinine.seuilFemme;
    if (creatinine > seuil) {
      const alert = await Alert.create({
        patientId: patient.id,
        consultationId: consultation.id,
        type: 'Créatinine Élevée',
        message: alertRules.creatinine.message(creatinine, patient.sexe),
      });
      generatedAlerts.push(alert);
    }
  }

  // Alerte tension artérielle
  if (tensionArterielle && tensionArterielle.includes('/')) {
    const [sys, dia] = tensionArterielle.split('/').map(Number);
    if (sys > alertRules.tensionArterielle.seuilSys || dia > alertRules.tensionArterielle.seuilDia) {
      const alert = await Alert.create({
        patientId: patient.id,
        consultationId: consultation.id,
        type: 'Tension Artérielle Élevée',
        message: alertRules.tensionArterielle.message(sys, dia),
      });
      generatedAlerts.push(alert);
    }
  }

  // Alerte perte de poids rapide (nécessite l'historique des consultations)
  if (poids) {
    const previousConsultations = await Consultation.findAll({
      where: {
        patientId: patient.id,
        dateConsultation: {
          [require('sequelize').Op.lt]: dateConsultation, // antérieures à la consultation actuelle
          [require('sequelize').Op.gte]: new Date(dateConsultation.getTime() - alertRules.poidsRapide.periodeJours * 24 * 60 * 60 * 1000) // dans la période définie
        }
      },
      order: [['dateConsultation', 'DESC']],
      limit: 1
    });

    if (previousConsultations.length > 0) {
      const lastWeight = previousConsultations[0].poids;
      if (lastWeight && poids < lastWeight) {
        const dropPercentage = (lastWeight - poids) / lastWeight;
        if (dropPercentage > alertRules.poidsRapide.pourcentageChute) {
          const alert = await Alert.create({
            patientId: patient.id,
            consultationId: consultation.id,
            type: 'Perte de Poids Rapide',
            message: alertRules.poidsRapide.message(dropPercentage),
          });
          generatedAlerts.push(alert);
        }
      }
    }
  }

  return generatedAlerts;
}

module.exports = { checkAndGenerateAlerts };