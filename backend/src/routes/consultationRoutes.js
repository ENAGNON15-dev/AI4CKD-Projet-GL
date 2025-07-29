const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.post('/', consultationController.createConsultation);
router.get('/:patientId', consultationController.getConsultationsByPatientId);

module.exports = router;