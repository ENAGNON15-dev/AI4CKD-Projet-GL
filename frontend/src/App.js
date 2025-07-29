import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatientPage from './pages/PatientPage';
import LoginPage from './pages/LoginPage'; // <-- Nouveau: Import de la page de connexion
import RegisterPage from './pages/RegisterPage'; // <-- Nouveau: Import de la page d'inscription
import PrivateRoute from './components/PrivateRoute'; // <-- Nouveau: Import du composant de route privée
import { AuthProvider, useAuth } from './context/AuthContext'; // <-- Nouveau: Import du fournisseur et du hook d'authentification
import './App.css'; // Pour le style global

// Composant de navigation avec bouton de déconnexion
function AppNavbar() {
  const { user, logout } = useAuth(); // Récupère l'utilisateur et la fonction de déconnexion

  return (
    <nav>
      <Link to="/">Accueil</Link>
      {user ? (
        <>
          <span className="welcome-message">Bienvenue, {user.email}</span>
          <button onClick={logout} className="logout-button">Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Enveloppe toute l'application avec le fournisseur d'authentification */}
        <AppNavbar /> {/* La barre de navigation est maintenant à l'intérieur du AuthProvider */}
        <div className="container">
          <Routes>
            {/* Routes d'authentification (accessibles sans être connecté) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes protégées (nécessitent une connexion) */}
            <Route element={<PrivateRoute />}> {/* Utilise PrivateRoute pour protéger les routes enfants */}
              <Route path="/" element={<HomePage />} />
              <Route path="/patient/:id" element={<PatientPage />} />
            </Route>
            {/* Ajoutez d'autres routes protégées ici si nécessaire */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
