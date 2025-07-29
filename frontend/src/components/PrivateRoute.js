import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet pour rendre les enfants de la route
import { useAuth } from '../context/AuthContext'; // Import du hook d'authentification

function PrivateRoute() {
  const { user, loading } = useAuth(); // Récupère l'utilisateur et l'état de chargement du contexte

  if (loading) {
    return <p>Chargement de l'authentification...</p>; // Affiche un message de chargement pendant la vérification
  }

  // Si l'utilisateur est connecté, rend les composants enfants de la route
  // Sinon, redirige vers la page de connexion
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
