import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import du hook d'authentification
import { useNavigate, Link } from 'react-router-dom'; // Pour la redirection et le lien vers l'inscription
import '../App.css'; // Pour les styles généraux

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Pour afficher les messages d'erreur/succès
  const { login } = useAuth(); // Récupère la fonction de connexion du contexte
  const navigate = useNavigate(); // Hook de navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Réinitialise le message

    const success = await login(email, password); // Appelle la fonction de connexion
    if (success) {
      setMessage('Connexion réussie ! Redirection...');
      navigate('/'); // Redirige vers la page d'accueil après connexion réussie
    } else {
      setMessage('Échec de la connexion. Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
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
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
      </p>
    </div>
  );
}

export default LoginPage;
