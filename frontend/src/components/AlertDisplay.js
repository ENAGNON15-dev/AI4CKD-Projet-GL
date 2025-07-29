import React from 'react';
import './AlertDisplay.css'; // Pour le style (à créer)

function AlertDisplay({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return <p>Aucune alerte pour ce patient.</p>;
  }

  return (
    <div className="alert-list">
      <h3>Alertes Déclenchées</h3>
      {alerts.map(alert => (
        <div key={alert.id} className={`alert-item ${alert.resolue ? 'alert-resolved' : 'alert-active'}`}>
          <span className="alert-badge">{alert.resolue ? 'Résolue' : 'Active'}</span>
          <p><strong>Type:</strong> {alert.type}</p>
          <p><strong>Message:</strong> {alert.message}</p>
          <p><strong>Date:</strong> {new Date(alert.declencheeA).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default AlertDisplay;