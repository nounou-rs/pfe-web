import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, Battery, Wifi, Activity, Cpu } from 'lucide-react';

const MetersPage = () => {
  // 1. States pour les données dynamiques
  const [meters, setMeters] = useState([]);
  const [chargement, setChargement] = useState(true);

  // 2. Appel à l'API au chargement
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/compteurs')
      .then((response) => {
        setMeters(response.data);
        setChargement(false);
      })
      .catch((error) => {
        console.error("Erreur API compteurs :", error);
        setChargement(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* HEADER AVEC RECHERCHE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={32} color="var(--color-primary)" /> Parc des Compteurs
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>Gestion et monitoring des unités de télérelève</p>
        </div>
        <button className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={20} /> Ajouter un compteur
        </button>
      </div>

      {/* BARRE D'OUTILS (RECHERCHE & FILTRES) */}
      <div className="card card-compact" style={{ marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: 'white', padding: '10px 20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Rechercher par ID, zone ou type..." 
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button className="btn btn-secondary" style={{ gap: '8px' }}>
          <Filter size={18} /> Filtres
        </button>
      </div>

      {/* CHARGEMENT */}
      {chargement ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)' }}>⏳ Chargement de votre parc de compteurs...</p>
        </div>
      ) : (
        /* TABLEAU DES COMPTEURS */
        <div className="card" style={{ overflow: 'hidden', backgroundColor: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '15px' }}>ID Compteur</th>
                <th style={{ padding: '15px' }}>Zone / Emplacement</th>
                <th style={{ padding: '15px' }}>Statut</th>
                <th style={{ padding: '15px' }}>IoT Stats</th>
                <th style={{ padding: '15px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {meters.map((meter) => (
                <tr key={meter.id} style={{ borderBottom: '1px solid var(--color-border)', transition: '0.2s' }} className="transition-smooth">
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>{meter.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{meter.type || 'Standard'}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>{meter.localisation_atelier || 'Non assignée'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {/* Utilisation de meter.actif de SQL Server pour déterminer En ligne / Hors ligne */}
                    <span className={`badge ${meter.actif ? 'badge-success' : 'badge-danger'}`}>
                      {meter.actif ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'gray' }}>
                        <Battery size={14} /> N/A
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'gray' }}>
                        <Wifi size={14} /> N/A
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '5px' }} title="Voir les détails">
                      <Activity size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {meters.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>
                    Aucun compteur enregistré dans la base de données.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOTER / PAGINATION */}
      {!chargement && meters.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Affichage de {meters.length} compteurs</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="btn btn-secondary btn-sm">Précédent</button>
            <button className="btn btn-primary btn-sm">1</button>
            <button className="btn btn-secondary btn-sm">Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetersPage;