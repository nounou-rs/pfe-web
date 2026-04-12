import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification du token au démarrage de l'application (Refresh/F5)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('wicmicToken');
      const storedUser = localStorage.getItem('wicmicUser');

      if (token && storedUser) {
        // En attendant d'avoir une route '/me', on restaure les infos sauvegardées localement
        setUser(JSON.parse(storedUser));
      } else {
        // Nettoyage par sécurité s'il manque des données
        localStorage.removeItem('wicmicToken');
        localStorage.removeItem('wicmicUser');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // VRAI APPEL API vers ton backend FastAPI
      // Note : on mappe ton champ "email" de l'interface vers le champ "nom" attendu par FastAPI
      const response = await axios.post('http://127.0.0.1:8000/login', { 
        nom: email, 
        mot_de_passe: password 
      });
      
      // Si FastAPI répond avec un succès (Code 200) :
      const realToken = response.data.token;
      const realUser = response.data.utilisateur;
      
      // On sauvegarde la vraie session
      localStorage.setItem('wicmicToken', realToken);
      localStorage.setItem('wicmicUser', JSON.stringify(realUser));
      setUser(realUser);
      
      return { success: true };

    } catch (error) {
      // Si FastAPI renvoie une erreur (ex: Code 401 pour mauvais mot de passe)
      console.error("Erreur API Login :", error);
      if (error.response && error.response.status === 401) {
        return { success: false, error: "Nom d'utilisateur ou mot de passe incorrect" };
      }
      return { success: false, error: 'Erreur de communication avec le serveur (Vérifiez FastAPI)' };
    }
  };

  const logout = () => {
    // Déconnexion réelle
    localStorage.removeItem('wicmicToken');
    localStorage.removeItem('wicmicUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};