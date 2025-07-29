import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import du hook d'authentification
import { useNavigate } from 'react-router-dom'; // Pour la redirection
import '../App.css'; // Pour les styles généraux

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Pour afficher les messages d'erreur/succès
  const { register } = useAuth(); // Récupère la fonction d'inscription du contexte
  const navigate = useNavigate(); // Hook de navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Réinitialise le message

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    const success = await register(email, password); // Appelle la fonction d'inscription
    if (success) {
      setMessage('Inscription réussie ! Redirection...');
      navigate('/'); // Redirige vers la page d'accueil après inscription réussie
    } else {
      setMessage('Échec de l\'inscription. Veuillez réessayer.'); // Message générique, l'erreur détaillée est dans la console
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        {message && <p className="auth-message">{message}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default RegisterPage;
