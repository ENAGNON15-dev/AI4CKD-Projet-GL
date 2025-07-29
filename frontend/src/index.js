import React from 'react';
import ReactDOM from 'react-dom/client'; // Notez le /client pour React 18+
import './index.css'; // Importe le fichier CSS global
import App from './App'; // Importe le composant App

// Crée une racine React et rend l'application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);