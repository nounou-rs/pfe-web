import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Vérification sécurisée au démarrage (Refresh/F5)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('wicmicToken');
        const storedUser = localStorage.getItem('wicmicUser');

        // SÉCURITÉ : On vérifie que les données existent ET ne sont pas la chaîne "undefined"
        if (token && storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        } else {
          // Nettoyage automatique si les données sont incomplètes ou corrompues
          localStorage.removeItem('wicmicToken');
          localStorage.removeItem('wicmicUser');
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture de la session :", error);
        localStorage.clear();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 2. Fonction de connexion alignée sur ton Backend FastAPI
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', { 
        email: email, 
        password: password 
      });
      
      const data = response.data;
      
      if (data.success) {
        // On crée l'objet utilisateur à partir des clés renvoyées par ton FastAPI
        const userData = {
          nom: data.user_name,
          id: data.user_id,
          role: data.role
        };

        // Sauvegarde dans le localStorage
        localStorage.setItem('wicmicToken', data.access_token); // access_token = clé FastAPI
        localStorage.setItem('wicmicUser', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, error: "Erreur de connexion inattendue" };

    } catch (error) {
      console.error("Erreur API Login :", error);
      
      // Gestion des messages d'erreur du backend
      if (error.response) {
        if (error.response.status === 401) {
          return { success: false, error: "Email ou mot de passe incorrect" };
        }
        if (error.response.status === 403) {
          return { success: false, error: "Veuillez valider votre e-mail avant de vous connecter" };
        }
        return { success: false, error: error.response.data.detail || "Erreur serveur" };
      }
      
      return { success: false, error: 'Impossible de contacter le serveur. Vérifiez que FastAPI est lancé.' };
    }
  };

  // 3. Déconnexion
  const logout = () => {
    localStorage.removeItem('wicmicToken');
    localStorage.removeItem('wicmicUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {/* On n'affiche l'app que quand la vérification initiale est terminée */}
      {!loading && children}
    </AuthContext.Provider>
  );
};