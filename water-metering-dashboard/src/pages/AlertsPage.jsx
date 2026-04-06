import React, { useState } from 'react';
import { AlertCircle, Droplets, BatteryLow, WifiOff, MapPin, Eye, Trash2 } from 'lucide-react';

const AlertsPage = () => {
  // Simulation des alertes réelles venant du hardware IoT
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      type: 'Fuite Détectée', 
      severity: 'Critique', 
      meter: 'MTR-001234', 
      location: 'Secteur Nord - Zone A',
      details: 'Débit anormal de 0.8m³/h détecté sans interruption depuis 3h.',
      status: 'Non résolu',
      icon: <Droplets size={24} />
    },
    { 
      id: 2, 
      type: 'Batterie Critique', 
      severity: 'Moyen', 
      meter: 'MTR-008912', 
      location: 'Résidence El Hana',
      details: 'Niveau de batterie à 5%. Risque d\'arrêt de la transmission photo.',
      status: 'En attente',
      icon: <BatteryLow size={24} />
    },
    { 
      id: 3, 
      type: 'Perte de Signal', 
      severity: 'Critique', 
      meter: 'MTR-005544', 
      location: 'Zone Industrielle',
      details: 'Aucun signal reçu depuis 24h. Capteur potentiellement hors service.',
      status: 'Non résolu',
      icon: <WifiOff size={24} />
    }
  ]);

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* HEADER ALERTES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={32} /> Centre des Alertes
          </h1>
          <p style={{ color: 'var(--color-text-light)' }}>
            {alerts.length} alertes actives nécessitant votre attention immédiate.
          </p>
        </div>
        <div className="badge badge-danger" style={{ padding: '10px 20px', fontSize: '1rem' }}>
          Système en Alerte
        </div>
      </div>

      {/* LISTE DES ALERTES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {alerts.map(alert => (
          <div key={alert.id} className="card card-standard transition-smooth" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr auto', 
            alignItems: 'center', 
            gap: '20px',
            borderLeft: `6px solid ${alert.severity === 'Critique' ? 'var(--color-danger)' : '#f59e0b'}`
          }}>
            
            {/* ICÔNE DE TYPE */}
            <div style={{ 
              backgroundColor: alert.severity === 'Critique' ? '#FEE2E2' : '#FEF3C7', 
              color: alert.severity === 'Critique' ? 'var(--color-danger)' : '#92400E',
              padding: '15px',
              borderRadius: '12px'
            }}>
              {alert.icon}
            </div>

            {/* CONTENU DE L'ALERTE */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                <h3 style={{ margin: 0 }}>{alert.type}</h3>
                <span className={`badge ${alert.severity === 'Critique' ? 'badge-danger' : 'badge-warning'}`}>
                  {alert.severity}
                </span>
              </div>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: 'var(--color-text-dark)' }}>
                Compteur : {alert.meter} — {alert.location}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                {alert.details}
              </p>
            </div>

            {/* ACTIONS RAPIDES */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary btn-sm" title="Localiser sur la carte">
                <MapPin size={18} />
              </button>
              <button className="btn btn-primary btn-sm" title="Voir la dernière photo">
                <Eye size={18} />
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => deleteAlert(alert.id)}
                title="Ignorer l'alerte"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="card card-standard" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-success)' }}>
              ✅ Aucune alerte détectée. Le réseau fonctionne normalement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;