import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const MetersContext = createContext();

export const MetersProvider = ({ children }) => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour rafraîchir les données depuis l'API
  const refreshMeters = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/compteurs');
      // On garde uniquement ceux qui ont des coordonnées GPS
      const withGPS = response.data.filter(m => m.latitude && m.longitude);
      setMeters(withGPS);
    } catch (error) {
      console.error("Erreur Context Meters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    refreshMeters();
  }, []);

  return (
    <MetersContext.Provider value={{ meters, refreshMeters, loading }}>
      {children}
    </MetersContext.Provider>
  );
};

export const useMeters = () => useContext(MetersContext);