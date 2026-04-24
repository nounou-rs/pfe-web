import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Search, Eye, Calendar, Database, Hash, ExternalLink } from 'lucide-react';

const HistoryPage = () => {
  const [releves, setReleves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // RÉCUPÉRATION DES DONNÉES
  const fetchReleves = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/releves');
      setReleves(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleves();
  }, []);

  // FILTRAGE SÉCURISÉ (Correction du bug toLowerCase)
  const filteredData = releves.filter(r => {
    const meterId = (r.compteur_id || "").toString().toLowerCase();
    const search = searchTerm.toLowerCase();
    return meterId.includes(search);
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 'bold', margin: 0 }}>
            <Clock size={32} color="#2563eb" /> Historique des Relevés
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Journal de télérelève et analyses de l'assistant IA</p>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>
          {filteredData.length} enregistrements trouvés
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '450px' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Rechercher par ID compteur (ex: WIC-001)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 45px', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              outline: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        border: '1px solid #f1f5f9',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Date & Heure</th>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Compteur</th>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Index (m³)</th>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Débit (m³/h)</th>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Confiance IA</th>
              <th style={{ padding: '18px 20px', color: '#475569', fontWeight: '600', fontSize: '0.9rem', textAlign: 'center' }}>Preuve</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                  Chargement de l'historique...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                  Aucun relevé ne correspond à votre recherche.
                </td>
              </tr>
            ) : filteredData.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '16px 20px' }}>
                <span style={{ fontWeight: '700', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Hash size={14} /> 
                    {/* On affiche le NOM du compteur récupéré via la jointure SQL */}
                    {r.compteur_nom} 
                </span>
                <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>ID: {r.compteur_id}</div>
                </td>
                <td style={{ padding: '16px 20px', color: '#1e293b', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#94a3b8" />
                    {/* On utilise la date ISO envoyée par le backend */}
                    {r.releve_timestamp ? new Date(r.releve_timestamp).toLocaleString('fr-FR') : "Date inconnue"}
                </div>
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>
                  {r.index_m3 ? r.index_m3.toFixed(2) : '0.00'}
                </td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>
                  {r.debit_m3h ? `${r.debit_m3h} m³/h` : '—'}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    fontWeight: '700',
                    display: 'inline-block',
                    backgroundColor: r.confiance_yolo > 0.9 ? '#dcfce7' : '#fef9c3',
                    color: r.confiance_yolo > 0.9 ? '#166534' : '#854d0e',
                    border: `1px solid ${r.confiance_yolo > 0.9 ? '#bbf7d0' : '#fef08a'}`
                  }}>
                    {(r.confiance_yolo * 100).toFixed(1)}%
                  </div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <button 
                    onClick={() => r.image_url && window.open(r.image_url, '_blank')}
                    style={{ 
                      background: '#f1f5f9', 
                      border: 'none', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      color: '#64748b',
                      transition: 'all 0.2s'
                    }}
                    title="Voir la capture originale"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSS interne pour l'effet de survol (optionnel) */}
      <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;