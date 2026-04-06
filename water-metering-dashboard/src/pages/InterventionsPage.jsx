import React, { useState } from 'react';
import { Wrench, MapPin, Calendar, Clock, User, CheckCircle, AlertCircle, Plus, Filter } from 'lucide-react';

const InterventionsPage = () => {
  // Liste des interventions (basée sur les objectifs fonctionnels du CDC)
  const [interventions] = useState([
    {
      id: "INT-2026-001",
      type: "Réparation Fuite",
      meter: "MTR-001234",
      technician: "Ahmed Ben Salah",
      date: "07/04/2026",
      status: "En cours",
      priority: "Haute",
      location: "Zone A - Ras Jbal"
    },
    {
      id: "INT-2026-002",
      type: "Remplacement Batterie",
      meter: "MTR-008912",
      technician: "Sami Mansour",
      date: "08/04/2026",
      status: "Planifié",
      priority: "Moyenne",
      location: "Zone B - Usine"
    }
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* HEADER AVEC ACTIONS ADMIN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wrench size={32} color="var(--color-primary)" /> Suivi des Interventions
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>Gestion des techniciens et maintenance terrain</p>
        </div>
        <button className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={20} /> Nouvelle Intervention
        </button>
      </div>

      {/* FILTRES RAPIDES */}
      <div className="card card-compact" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: 'white' }}>
        <Filter size={18} style={{ marginLeft: '10px' }} />
        <button className="btn btn-secondary btn-sm">Toutes</button>
        <button className="btn btn-secondary btn-sm">En cours</button>
        <button className="btn btn-secondary btn-sm">Terminées</button>
      </div>

      {/* GRILLE DES MISSIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
        {interventions.map((task) => (
          <div key={task.id} className="card card-standard transition-smooth" style={{ borderTop: `4px solid ${task.priority === 'Haute' ? 'var(--color-danger)' : 'var(--color-primary)'}` }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-text-light)' }}>{task.id}</span>
              <span className={`badge ${task.status === 'En cours' ? 'badge-warning' : 'badge-primary'}`}>
                {task.status}
              </span>
            </div>

            <h3 style={{ marginBottom: '15px' }}>{task.type}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span>{task.location} (Compteur {task.meter})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <User size={16} color="var(--color-primary)" />
                <span>Technicien : <strong>{task.technician}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <Calendar size={16} color="var(--color-primary)" />
                <span>Prévu le : {task.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Détails</button>
              <button className="btn btn-success btn-sm" style={{ flex: 1, gap: '5px' }}>
                <CheckCircle size={16} /> Clôturer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION RÉSUMÉ (KPIs) */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="card card-compact" style={{ textAlign: 'center', backgroundColor: '#ECFDF5' }}>
          <p className="text-label" style={{ marginBottom: '5px' }}>Taux de Résolution</p>
          <p className="text-value" style={{ color: 'var(--color-success)', fontSize: '1.5rem' }}>92%</p>
        </div>
        <div className="card card-compact" style={{ textAlign: 'center', backgroundColor: '#FFF7ED' }}>
          <p className="text-label" style={{ marginBottom: '5px' }}>Moyenne d'Intervention</p>
          <p className="text-value" style={{ color: '#C2410C', fontSize: '1.5rem' }}>4.2h</p>
        </div>
        <div className="card card-compact" style={{ textAlign: 'center', backgroundColor: '#EFF6FF' }}>
          <p className="text-label" style={{ marginBottom: '5px' }}>Missions ce mois</p>
          <p className="text-value" style={{ color: 'var(--color-primary)', fontSize: '1.5rem' }}>24</p>
        </div>
      </div>
    </div>
  );
};

export default InterventionsPage;