import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/api'; // Import des fonctions d'API

// Crée le contexte d'authentification
const AuthContext = createContext(null);

// Fournisseur d'authentification pour envelopper l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const [token, setToken] = useState(null); // État pour stocker le token JWT
  const [loading, setLoading] = useState(true); // État pour gérer le chargement initial

  // Effet pour charger le token et l'utilisateur depuis le stockage local au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Stockez aussi l'email de l'utilisateur ou son ID si nécessaire

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // Parse l'objet utilisateur
    }
    setLoading(false); // Le chargement initial est terminé
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token, id, email: userEmail } = response.data; // Destructure la réponse
      localStorage.setItem('token', token); // Stocke le token
      localStorage.setItem('user', JSON.stringify({ id, email: userEmail })); // Stocke l'utilisateur
      setToken(token);
      setUser({ id, email: userEmail });
      return true; // Indique le succès
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data?.message || error.message);
      return false; // Indique l'échec
    }
  };

  // Fonction d'inscription
  const register = async (email, password) => {
    try {
      const response = await registerUser({ email, password });
      const { token, id, email: userEmail } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email: userEmail }));
      setToken(token);
      setUser({ id, email: userEmail });
      return true; // Indique le succès
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data?.message || error.message);
      return false; // Indique l'échec
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token'); // Supprime le token
    localStorage.removeItem('user'); // Supprime l'utilisateur
    setToken(null);
    setUser(null);
  };

  // Le contexte fournit l'utilisateur, le token, les fonctions de connexion/déconnexion et l'état de chargement
  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};
