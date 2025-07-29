import React, { useState } from 'react';

function ConsultationForm({ patientId, onSubmit }) {
  const [consultation, setConsultation] = useState({
    patientId: patientId,
    tensionArterielle: '',
    creatinine: '',
    poids: '',
    glycemie: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(consultation);
    setConsultation({ // Réinitialiser le formulaire après soumission
      patientId: patientId,
      tensionArterielle: '',
      creatinine: '',
      poids: '',
      glycemie: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nouvelle Consultation</h3>
      <div>
        <label>Tension Artérielle (ex: 120/80):</label>
        <input type="text" name="tensionArterielle" value={consultation.tensionArterielle} onChange={handleChange} />
      </div>
      <div>
        <label>Créatinine (mg/dL):</label>
        <input type="number" step="0.01" name="creatinine" value={consultation.creatinine} onChange={handleChange} />
      </div>
      <div>
        <label>Poids (kg):</label>
        <input type="number" step="0.1" name="poids" value={consultation.poids} onChange={handleChange} />
      </div>
      <div>
        <label>Glycémie (mg/dL):</label>
        <input type="number" step="0.1" name="glycemie" value={consultation.glycemie} onChange={handleChange} />
      </div>
      <div>
        <label>Notes:</label>
        <textarea name="notes" value={consultation.notes} onChange={handleChange}></textarea>
      </div>
      <button type="submit">Enregistrer Consultation</button>
    </form>
  );
}

export default ConsultationForm;