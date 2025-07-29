import React, { useState } from 'react';

function PatientForm({ onSubmit, initialData = {} }) {
  const [patient, setPatient] = useState({
    nom: initialData.nom || '',
    prenom: initialData.prenom || '',
    dateNaissance: initialData.dateNaissance || '',
    sexe: initialData.sexe || '',
    antecedents: initialData.antecedents || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(patient);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom:</label>
        <input type="text" name="nom" value={patient.nom} onChange={handleChange} required />
      </div>
      <div>
        <label>Prénom:</label>
        <input type="text" name="prenom" value={patient.prenom} onChange={handleChange} required />
      </div>
      <div>
        <label>Date de Naissance:</label>
        <input type="date" name="dateNaissance" value={patient.dateNaissance} onChange={handleChange} required />
      </div>
      <div>
        <label>Sexe:</label>
        <select name="sexe" value={patient.sexe} onChange={handleChange} required>
          <option value="">Sélectionner</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
      <div>
        <label>Antécédents (optionnel):</label>
        <textarea name="antecedents" value={patient.antecedents} onChange={handleChange}></textarea>
      </div>
      <button type="submit">Enregistrer Patient</button>
    </form>
  );
}

export default PatientForm;