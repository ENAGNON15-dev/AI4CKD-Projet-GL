import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientById, createConsultation, generatePdf } from '../services/api';
import ConsultationForm from '../components/ConsultationForm';
import AlertDisplay from '../components/AlertDisplay';
import '../App.css'; // S'assurer que les styles généraux sont bien importés

function PatientPage() {
  const { id } = useParams(); // Récupère l'ID du patient depuis l'URL

  // États pour gérer les données du patient, le chargement, les erreurs et l'affichage du formulaire de consultation
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);

  // Fonction mémoisée pour récupérer les détails du patient.
  // Elle est recréée uniquement si 'id' change.
  const fetchPatientDetails = useCallback(async () => {
    try {
      setLoading(true); // Active l'état de chargement
      const response = await getPatientById(id); // Appel à l'API pour récupérer les données du patient
      setPatient(response.data); // Met à jour l'état du patient avec les données reçues
      setLoading(false); // Désactive l'état de chargement
    } catch (err) {
      setError('Patient non trouvé ou erreur de connexion.'); // Définit un message d'erreur
      setLoading(false); // Désactive l'état de chargement même en cas d'erreur
      console.error(err); // Affiche l'erreur dans la console du navigateur
    }
  }, [id]); // Dépendance: la fonction est recréée si 'id' change

  // useEffect pour appeler fetchPatientDetails au montage du composant
  // ou lorsque fetchPatientDetails elle-même change (ce qui arrive si 'id' change)
  useEffect(() => {
    fetchPatientDetails();
  }, [fetchPatientDetails]); // Dépendance: fetchPatientDetails (mémoisée par useCallback)

  // Gère la soumission du formulaire de nouvelle consultation
  const handleCreateConsultation = async (consultationData) => {
    try {
      const response = await createConsultation(consultationData); // Envoie les données de consultation au backend
      console.log('Consultation créée avec alertes:', response.data.alerts);
      fetchPatientDetails(); // Recharge les détails du patient pour afficher la nouvelle consultation et les alertes générées
      setShowConsultationForm(false); // Masque le formulaire de consultation après succès
    } catch (err) {
      console.error('Erreur lors de la création de la consultation:', err);
      // Affichage d'un message d'erreur personnalisé (remplace alert())
      const messageBox = document.createElement('div');
      messageBox.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; z-index: 1000; text-align: center;';
      messageBox.innerHTML = 'Erreur lors de la création de la consultation. Veuillez réessayer.<br><button onclick="this.parentNode.remove()" style="margin-top: 10px; background-color: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>';
      document.body.appendChild(messageBox);
    }
  };

  // Gère la génération et le téléchargement du PDF
  const handleGeneratePdf = async () => {
    try {
      const response = await generatePdf(id); // Appel à l'API pour générer le PDF
      const blob = new Blob([response.data], { type: 'application/pdf' }); // Crée un objet Blob à partir des données binaires
      const url = window.URL.createObjectURL(blob); // Crée une URL pour le Blob
      const a = document.createElement('a'); // Crée un élément <a> pour le téléchargement
      a.href = url;
      a.download = `dossier_patient_${patient.nom}_${patient.prenom}.pdf`; // Nom du fichier
      document.body.appendChild(a); // Ajoute le lien au DOM
      a.click(); // Simule un clic sur le lien pour déclencher le téléchargement
      a.remove(); // Supprime le lien du DOM
      window.URL.revokeObjectURL(url); // Libère l'URL du Blob
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      // Affichage d'un message d'erreur personnalisé (remplace alert())
      const messageBox = document.createElement('div');
      messageBox.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; z-index: 1000; text-align: center;';
      messageBox.innerHTML = 'Impossible de générer le PDF. Veuillez réessayer.<br><button onclick="this.parentNode.remove()" style="margin-top: 10px; background-color: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">Fermer</button>';
      document.body.appendChild(messageBox);
    }
  };

  // Affichage conditionnel pendant le chargement, en cas d'erreur ou si le patient n'est pas trouvé
  if (loading) return <p>Chargement du patient...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!patient) return <p>Patient non disponible.</p>;

  return (
    <div>
      <h1>Dossier de {patient.prenom} {patient.nom}</h1>
      {/* Bouton pour générer le PDF */}
      <button onClick={handleGeneratePdf}>Générer la synthèse PDF</button>
      <hr />

      <h2>Informations du Patient</h2>
      <p><strong>Date de Naissance:</strong> {new Date(patient.dateNaissance).toLocaleDateString()}</p>
      <p><strong>Sexe:</strong> {patient.sexe}</p>
      <p><strong>Antécédents:</strong> {patient.antecedents || 'Aucun'}</p>

      <hr />
      {/* Bouton pour afficher/masquer le formulaire de consultation */}
      <button onClick={() => setShowConsultationForm(!showConsultationForm)}>
        {showConsultationForm ? 'Masquer le formulaire' : 'Ajouter une nouvelle consultation'}
      </button>
      {/* Affichage conditionnel du formulaire de consultation */}
      {showConsultationForm && <ConsultationForm patientId={id} onSubmit={handleCreateConsultation} />}

      <hr />
      <h2>Historique des Consultations</h2>
      {patient.Consultations && patient.Consultations.length > 0 ? (
        <ul>
          {patient.Consultations.map(consultation => (
            <li key={consultation.id}>
              <strong>Date:</strong> {new Date(consultation.dateConsultation).toLocaleString()} <br />
              Tension Artérielle: {consultation.tensionArterielle || 'N/A'}, Créatinine: {consultation.creatinine || 'N/A'}, Poids: {consultation.poids || 'N/A'}, Glycémie: {consultation.glycemie || 'N/A'} <br />
              Notes: {consultation.notes || 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune consultation enregistrée pour ce patient.</p>
      )}

      <hr />
      {/* Affichage des alertes via le composant AlertDisplay */}
      {/* patient.Alerts est passé en prop au composant AlertDisplay */}
      {patient.Alerts && <AlertDisplay alerts={patient.Alerts} />}
    </div>
  );
}

export default PatientPage;
