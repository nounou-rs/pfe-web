import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Battery, Wifi, Activity, Cpu } from 'lucide-react';

const MetersPage = () => {
  // Liste des compteurs (Données simulées basées sur ton projet IoT)
  const [meters] = useState([
    { id: 'MTR-001234', type: 'Analogique', zone: 'Secteur Nord', status: 'En ligne', battery: '92%', signal: 'Excellent', lastUpdate: 'Il y a 5 min' },
    { id: 'MTR-008912', type: 'Numérique', zone: 'Secteur Sud', status: 'Hors ligne', battery: '15%', signal: 'Faible', lastUpdate: 'Hier' },
    { id: 'MTR-005544', type: 'Analogique', zone: 'Zone Industrielle', status: 'En ligne', battery: '88%', signal: 'Moyen', lastUpdate: 'Il y a 1h' },
    { id: 'MTR-002233', type: 'Analogique', zone: 'Secteur Nord', status: 'En ligne', battery: '45%', signal: 'Bon', lastUpdate: 'Il y a 10 min' },
  ]);

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

      {/* TABLEAU DES COMPTEURS */}
      <div className="card" style={{ overflow: 'hidden', backgroundColor: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '15px' }}>ID Compteur</th>
              <th style={{ padding: '15px' }}>Zone / Emplacement</th>
              <th style={{ padding: '15px' }}>Statut</th>
              <th style={{ padding: '15px' }}>IoT Stats</th>
              <th style={{ padding: '15px' }}>Dernier Relevé</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {meters.map((meter) => (
              <tr key={meter.id} style={{ borderBottom: '1px solid var(--color-border)', transition: '0.2s' }} className="transition-smooth">
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>{meter.id}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{meter.type}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>{meter.zone}</span>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span className={`badge ${meter.status === 'En ligne' ? 'badge-success' : 'badge-danger'}`}>
                    {meter.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      <Battery size={14} color={parseInt(meter.battery) < 20 ? 'var(--color-danger)' : 'var(--color-success)'} />
                      {meter.battery}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                      <Wifi size={14} color="var(--color-primary)" />
                      {meter.signal}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                  {meter.lastUpdate}
                </td>
                <td style={{ padding: '15px' }}>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '5px' }}>
                    <Activity size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Affichage de 4 compteurs sur 48</p>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-secondary btn-sm">Précédent</button>
          <button className="btn btn-primary btn-sm">1</button>
          <button className="btn btn-secondary btn-sm">Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default MetersPage;