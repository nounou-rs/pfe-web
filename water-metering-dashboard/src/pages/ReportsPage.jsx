import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, PieChart, Calendar, Filter, CheckCircle } from 'lucide-react';

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulation des rapports récents disponibles
  const reports = [
    { id: 1, name: "Bilan Consommation Mensuel - Mars 2026", date: "01/04/2026", type: "PDF", size: "1.2 MB" },
    { id: 2, name: "Analyse des Fuites - Secteur Nord", date: "03/04/2026", type: "Excel", size: "450 KB" },
    { id: 3, name: "Prédictions Trimestrielles Q2", date: "05/04/2026", type: "PDF", size: "2.8 MB" }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={32} color="var(--color-primary)" /> Rapports & Exportations
        </h1>
        <p style={{ color: 'var(--color-text-light)' }}>Générez des analyses détaillées de votre parc de compteurs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* CONFIGURATION DU RAPPORT */}
        <div className="card card-standard">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} /> Nouveau Rapport
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Type de données</label>
              <select className="input">
                <option>Consommation Globale</option>
                <option>Détection d'Anomalies (Fuites)</option>
                <option>Performance des Batteries IoT</option>
                <option>Prédictions IA (Prophet/LSTM)</option>
              </select>
            </div>

            <div>
              <label>Période</label>
              <select className="input">
                <option>Derniers 30 jours</option>
                <option>Dernier trimestre</option>
                <option>Année complète</option>
                <option>Personnalisé...</option>
              </select>
            </div>

            <div>
              <label>Format de sortie</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, gap: '5px' }}>
                  <FileText size={16} /> PDF
                </button>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, gap: '5px' }}>
                  <FileSpreadsheet size={16} /> Excel
                </button>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ marginTop: '10px' }} 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Génération en cours..." : "Générer le rapport"}
            </button>
          </div>
        </div>

        {/* LISTE DES RAPPORTS GÉNÉRÉS */}
        <div className="card card-standard">
          <h3 style={{ marginBottom: '20px' }}>Archives Récentes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--color-text-light)' }}>Nom du fichier</th>
                <th style={{ padding: '12px', color: 'var(--color-text-light)' }}>Date</th>
                <th style={{ padding: '12px', color: 'var(--color-text-light)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {report.type === 'PDF' ? <FileText size={18} color="#EF4444" /> : <FileSpreadsheet size={18} color="#10B981" />}
                      <span style={{ fontWeight: '500' }}>{report.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{report.date}</td>
                  <td style={{ padding: '12px' }}>
                    <button className="btn btn-secondary btn-sm" title="Télécharger">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION ANALYSE RAPIDE */}
      <div style={{ marginTop: '30px' }} className="card card-standard">
        <h3 style={{ marginBottom: '20px' }}><PieChart size={20} style={{ marginRight: '8px' }} /> Statistiques de Synthèse</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p className="text-label">Total Relevés</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>1,245</p>
            <small style={{ color: 'var(--color-success)' }}>+12% ce mois</small>
          </div>
          <div style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p className="text-label">Précision OCR</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>94.2%</p>
            <small style={{ color: 'var(--color-primary)' }}>Modèle Deep Learning</small>
          </div>
          <div style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p className="text-label">Économie Estimée</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>15%</p>
            <small style={{ color: 'var(--color-accent-green)' }}>Grâce à l'IA</small>
          </div>
          <div style={{ padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <p className="text-label">Alertes Résolues</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>88%</p>
            <small style={{ color: 'var(--color-text-light)' }}>Workflow actif</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;