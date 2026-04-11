import React, { useState } from 'react';
import axios from 'axios';

const ProfessionalFleetControl = () => {
  // Liste de flotte simulée pour 20 compteurs
  const [meters, setMeters] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: `MTR-${String(i + 1).padStart(3, '0')}`,
      zone: `Secteur ${String.fromCharCode(65 + (i % 4))} - Ras Jbal`,
      status: 'Actif', // Actif | Hors Ligne | Erreur
      frequency: 'jour',
      lastSeen: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }))
  );

  const [loadingMeters, setLoadingMeters] = useState({});

  // Fonction 1 : Changer la fréquence (Envoi au serveur)
  const updateFrequency = async (meterId, newFreq) => {
    try {
      await axios.post('http://localhost:8000/admin/update-planning', {
        counter_id: meterId,
        frequency: newFreq
      });
      // Mise à jour de l'état local après succès
      setMeters(meters.map(m => m.id === meterId ? { ...m, frequency: newFreq } : m));
    } catch (e) {
      console.error(e);
      alert('Erreur réseau. Le serveur Python est-il lancé ?');
    }
  };

  // Fonction 2 : Capture Manuelle
  const triggerCapture = async (meterId) => {
    setLoadingMeters({ ...loadingMeters, [meterId]: true });
    try {
      await axios.post('http://localhost:8000/admin/force-capture', { counter_id: meterId });
      // Simuler l'attente du polling de l'ESP32
      setTimeout(() => {
        setLoadingMeters({ ...loadingMeters, [meterId]: false });
      }, 5000); // 5 secondes d'attente fictive
    } catch (e) {
      console.error(e);
      setLoadingMeters({ ...loadingMeters, [meterId]: false });
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER PROFESSIONNEL */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
        <div>
          <h1 style={{ color: '#1a2a3a', margin: 0, fontWeight: 700 }}>Flotte Connectée WICMIC</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Gestionnaire de relevés intelligents et contrôles caméras.</p>
        </div>
        <button style={{ backgroundColor: '#2c3e50', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold' }}>
          + Ajouter Unité
        </button>
      </header>

      {/* TABLEAU DE CONTRÔLE PRINCIPAL (Le design "Pro") */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          
          {/* En-tête du tableau (Gris Ardoise) */}
          <thead style={{ backgroundColor: '#1a2a3a', color: 'white', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <tr>
              <th style={{ padding: '15px 25px' }}>ID Compteur</th>
              <th style={{ padding: '15px 25px' }}>Localisation</th>
              <th style={{ padding: '15px 25px' }}>État</th>
              <th style={{ padding: '15px 25px' }}>Fréquence Auto</th>
              <th style={{ padding: '15px 25px' }}>Dernier Polling</th>
              <th style={{ padding: '15px 25px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          
          {/* Corps du tableau (Les données) */}
          <tbody style={{ fontSize: '0.9rem', color: '#333' }}>
            {meters.map(meter => (
              <tr key={meter.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.2s' }}>
                
                {/* ID & Zone */}
                <td style={{ padding: '20px 25px', fontWeight: 'bold', color: '#2c3e50' }}>{meter.id}</td>
                <td style={{ padding: '20px 25px', color: '#7f8c8d' }}>{meter.zone}</td>
                
                {/* Badge d'État */}
                <td style={{ padding: '20px 25px' }}>
                  <span style={{ 
                    backgroundColor: meter.status === 'Actif' ? '#e8f5e9' : '#ffebee', 
                    color: meter.status === 'Actif' ? '#2e7d32' : '#c62828', 
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
                  }}>
                    {meter.status}
                  </span>
                </td>
                
                {/* SÉLECTEUR DE FRÉQUENCE (Intégré) */}
                <td style={{ padding: '20px 25px' }}>
                  <select 
                    value={meter.frequency} 
                    onChange={(e) => updateFrequency(meter.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #dcdde1', width: '140px', fontSize: '0.85rem' }}
                  >
                    <option value="jour">Chaque Jour</option>
                    <option value="semaine">Chaque Semaine</option>
                    <option value="mois">Chaque Mois</option>
                    <option value="3_mois">Tous les 3 Mois</option>
                  </select>
                </td>
                
                {/* Temps */}
                <td style={{ padding: '20px 25px', color: '#7f8c8d', fontSize: '0.85rem' }}>Aujourd'hui, {meter.lastSeen}</td>
                
                {/* BOUTON D'ACTION (Intégré) */}
                <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                  <button 
                    onClick={() => triggerCapture(meter.id)}
                    disabled={loadingMeters[meter.id]}
                    style={{ 
                      backgroundColor: loadingMeters[meter.id] ? '#bdc3c7' : '#ffffff', 
                      color: loadingMeters[meter.id] ? 'white' : '#2c3e50', 
                      padding: '8px 16px', borderRadius: '6px', 
                      border: '1px solid #2c3e50', 
                      cursor: loadingMeters[meter.id] ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold', fontSize: '0.85rem' 
                    }}
                  >
                    {loadingMeters[meter.id] ? '⏳ Commande...' : '📸 Capture Live'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfessionalFleetControl;