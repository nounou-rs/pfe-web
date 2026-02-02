import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    } else {
      // User de test automatique pour développement
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      setUser(mockUser);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const r = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      localStorage.setItem('token', r.data.token);
      setUser(r.data.user);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.message || 'Erreur' };
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
