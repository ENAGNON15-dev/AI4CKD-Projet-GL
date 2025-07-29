const Patient = require('../models/patient');
const Consultation = require('../models/consultation');
const Alert = require('../models/alert');

exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        { model: Consultation, order: [['dateConsultation', 'DESC']] },
        { model: Alert, order: [['declencheeA', 'DESC']] }
      ]
    });
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ message: 'Patient non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const [updated] = await Patient.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPatient = await Patient.findByPk(req.params.id);
      res.status(200).json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient non trouvé.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Patient non trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};