import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Droplets, BatteryLow, WifiOff, MapPin, Eye, Trash2, Cpu } from 'lucide-react';

const AlertsPage = () => {
  // 1. Les States pour les données dynamiques
  const [alerts, setAlerts] = useState([]);
  const [chargement, setChargement] = useState(true);

  // 2. Appel à l'API FastAPI au chargement de la page
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/alertes-recentes')
      .then((response) => {
        setAlerts(response.data);
        setChargement(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des alertes :", error);
        setChargement(false);
      });
  }, []);

  // Fonction pour supprimer de l'affichage (Plus tard, on pourra lier ça à un DELETE FastAPI)
  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // 3. Fonction pour attribuer la bonne icône selon le texte de l'anomalie
  const getIcon = (type) => {
    const typeMin = type.toLowerCase();
    if (typeMin.includes('fuite') || typeMin.includes('débit')) return <Droplets size={24} />;
    if (typeMin.includes('batterie')) return <BatteryLow size={24} />;
    if (typeMin.includes('signal') || typeMin.includes('wifi')) return <WifiOff size={24} />;
    if (typeMin.includes('ia') || typeMin.includes('yolo') || typeMin.includes('index')) return <Cpu size={24} />;
    return <AlertCircle size={24} />; // Icône par défaut
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
            {chargement ? "Vérification des capteurs en cours..." : `${alerts.length} alertes actives nécessitant votre attention immédiate.`}
          </p>
        </div>
        {alerts.length > 0 && (
          <div className="badge badge-danger" style={{ padding: '10px 20px', fontSize: '1rem' }}>
            Système en Alerte
          </div>
        )}
      </div>

      {/* CHARGEMENT */}
      {chargement && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)' }}>⏳ Chargement des données depuis la base...</p>
        </div>
      )}

      {/* LISTE DES ALERTES */}
      {!chargement && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {alerts.map((alert) => {
            // Déterminer la couleur selon la sévérité (Haute/Critique = Rouge, le reste = Orange)
            const isCritique = alert.severite.toLowerCase() === 'critique' || alert.severite.toLowerCase() === 'haute';
            
            return (
              <div key={alert.id} className="card card-standard transition-smooth" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr auto', 
                alignItems: 'center', 
                gap: '20px',
                borderLeft: `6px solid ${isCritique ? 'var(--color-danger)' : '#f59e0b'}`
              }}>
                
                {/* ICÔNE DE TYPE */}
                <div style={{ 
                  backgroundColor: isCritique ? '#FEE2E2' : '#FEF3C7', 
                  color: isCritique ? 'var(--color-danger)' : '#92400E',
                  padding: '15px',
                  borderRadius: '12px'
                }}>
                  {getIcon(alert.type_anomalie)}
                </div>

                {/* CONTENU DE L'ALERTE */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    <h3 style={{ margin: 0 }}>{alert.type_anomalie}</h3>
                    <span className={`badge ${isCritique ? 'badge-danger' : 'badge-warning'}`}>
                      {alert.severite}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'gray', marginLeft: '10px' }}>
                      {alert.date}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: 'var(--color-text-dark)' }}>
                    Compteur : {alert.compteur_id} — {alert.compteur_nom}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    {alert.description}
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
            );
          })}

          {/* MESSAGE SI AUCUNE ALERTE */}
          {alerts.length === 0 && (
            <div className="card card-standard" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--color-success)' }}>
                ✅ Aucune alerte détectée. Le réseau fonctionne normalement.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;