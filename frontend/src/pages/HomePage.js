import React, { useEffect, useState } from 'react';
import { getPatients, createPatient, deletePatient } from '../services/api';
import PatientForm from '../components/PatientForm';
import { Link } from 'react-router-dom';

function HomePage() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      await createPatient(patientData);
      fetchPatients();
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
      }
    }
  };

  return (
    <div>
      <h1>Gestion des Patients MRC</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Masquer le formulaire' : 'Ajouter un nouveau patient'}
      </button>
      {showForm && <PatientForm onSubmit={handleCreatePatient} />}

      <h2>Liste des Patients</h2>
      {patients.length === 0 ? (
        <p>Aucun patient enregistré.</p>
      ) : (
        <ul>
          {patients.map(patient => (
            <li key={patient.id}>
              <Link to={`/patient/${patient.id}`}>
                {patient.nom} {patient.prenom} ({new Date(patient.dateNaissance).toLocaleDateString()})
              </Link>
              <button onClick={() => handleDeletePatient(patient.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;