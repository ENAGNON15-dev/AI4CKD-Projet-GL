const Patient = require('../models/patient');
const Consultation = require('../models/consultation');
const Alert = require('../models/alert');
const pdf = require('html-pdf'); // Ou puppeteer pour une génération plus robuste
const path = require('path');
const fs = require('fs');

exports.generatePatientSummaryPdf = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findByPk(patientId, {
      include: [
        { model: Consultation, order: [['dateConsultation', 'DESC']] },
        { model: Alert, order: [['declencheeA', 'DESC']] }
      ]
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }

    // Création du contenu HTML pour le PDF
    let htmlContent = `
      <h1>Synthèse du Dossier Patient</h1>
      <hr>
      <h2>Identité du Patient</h2>
      <p><strong>Nom:</strong> ${patient.nom}</p>
      <p><strong>Prénom:</strong> ${patient.prenom}</p>
      <p><strong>Date de Naissance:</strong> ${new Date(patient.dateNaissance).toLocaleDateString()}</p>
      <p><strong>Sexe:</strong> ${patient.sexe}</p>
      <p><strong>Antécédents:</strong> ${patient.antecedents || 'N/A'}</p>

      <h2>Liste des Consultations</h2>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tension Artérielle</th>
            <th>Créatinine</th>
            <th>Poids</th>
            <th>Glycémie</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (patient.Consultations && patient.Consultations.length > 0) {
      patient.Consultations.forEach(consultation => {
        htmlContent += `
          <tr>
            <td>${new Date(consultation.dateConsultation).toLocaleString()}</td>
            <td>${consultation.tensionArterielle || 'N/A'}</td>
            <td>${consultation.creatinine || 'N/A'}</td>
            <td>${consultation.poids || 'N/A'}</td>
            <td>${consultation.glycemie || 'N/A'}</td>
            <td>${consultation.notes || 'N/A'}</td>
          </tr>
        `;
      });
    } else {
      htmlContent += `<tr><td colspan="6">Aucune consultation enregistrée.</td></tr>`;
    }
    htmlContent += `
        </tbody>
      </table>

      <h2>Résumé des Alertes Déclenchées</h2>
      <table border="1" style="width:100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th>Type d'Alerte</th>
            <th>Message</th>
            <th>Date</th>
            <th>Résolue</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (patient.Alerts && patient.Alerts.length > 0) {
      patient.Alerts.forEach(alert => {
        htmlContent += `
          <tr>
            <td>${alert.type}</td>
            <td>${alert.message}</td>
            <td>${new Date(alert.declencheeA).toLocaleString()}</td>
            <td>${alert.resolue ? 'Oui' : 'Non'}</td>
          </tr>
        `;
      });
    } else {
      htmlContent += `<tr><td colspan="4">Aucune alerte déclenchée.</td></tr>`;
    }
    htmlContent += `
        </tbody>
      </table>
    `;

    // Options pour la génération PDF (design sobre et lisible)
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '1cm',
      footer: {
        height: '10mm',
        contents: {
          default: '<span style="color: #444; float: right;">{{page}}/{{pages}}</span>',
        }
      }
    };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error('Erreur lors de la génération du PDF:', err);
        return res.status(500).json({ message: 'Erreur lors de la génération du PDF.' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=dossier_patient_${patient.nom}_${patient.prenom}.pdf`);
      res.send(buffer);
    });

  } catch (error) {
    console.error('Erreur dans generatePatientSummaryPdf:', error);
    res.status(500).json({ error: error.message });
  }
};