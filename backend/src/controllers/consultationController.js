const Consultation = require('../models/consultation');
const Patient = require('../models/patient');
const { checkAndGenerateAlerts } = require('../services/alertService');

exports.createConsultation = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.body.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }

    const consultation = await Consultation.create(req.body);

    // Déclenchement du système d'alertes après chaque enregistrement de consultation
    const generatedAlerts = await checkAndGenerateAlerts(consultation);

    res.status(201).json({ consultation, alerts: generatedAlerts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConsultationsByPatientId = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: { patientId: req.params.patientId },
      order: [['dateConsultation', 'DESC']],
    });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... autres méthodes pour update et delete consultation si nécessaire