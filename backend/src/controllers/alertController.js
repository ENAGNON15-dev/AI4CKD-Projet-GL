const Alert = require('../models/alert');
const Patient = require('../models/patient');

exports.getAlertsByPatientId = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { patientId: req.params.patientId },
      order: [['declencheeA', 'DESC']],
    });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... autres méthodes si nécessaire (ex: marquer une alerte comme résolue)