import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification du token au démarrage de l'application
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Si tu as ton backend prêt, décommente la ligne suivante :
          // const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
          // setUser(response.data);
          
          // En attendant le backend, on restaure la session si un token existe
          setUser({ id: 1, email: 'user@wicmic.com', name: 'Utilisateur Connecté' }); 
        } catch (error) {
          console.error("Session expirée", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulation d'appel API (À remplacer par ton vrai appel axios.post)
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      
      // Simulation de succès pour le développement
      console.log(`Tentative de connexion pour : ${email}`);
      
      if (email) {
         const fakeUser = { 
           id: 1, 
           email: email, 
           name: 'Admin WICMIC', 
           role: 'admin' 
         };
         
         const fakeToken = "jwt_token_simulé_123456";
         
         localStorage.setItem('token', fakeToken);
         setUser(fakeUser);
         return { success: true };
      }
      
      return { success: false, error: "Email invalide" };

    } catch (e) {
      return { success: false, error: e.response?.data?.message || 'Erreur de connexion' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 