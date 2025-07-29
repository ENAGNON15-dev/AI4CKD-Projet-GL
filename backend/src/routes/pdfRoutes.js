const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

router.get('/:patientId', pdfController.generatePatientSummaryPdf);

module.exports = router;