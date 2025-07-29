const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/:patientId', alertController.getAlertsByPatientId);

module.exports = router;