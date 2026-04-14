import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, X, Database, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MetersPage = () => {
  const [meters, setMeters] = useState([]);
  const [filteredMeters, setFilteredMeters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chargement, setChargement] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    localisation_atelier: '',
    type: 'Digital'
  });
  
  const { user } = useAuth();

  const fetchMeters = async () => {
    setChargement(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/compteurs');
      setMeters(response.data);
      setFilteredMeters(response.data);
    } catch (error) {
      console.error("Erreur API :", error);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, []);

  // Filtrage optimisé
  useEffect(() => {
    const results = meters.filter(m =>
      (m.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (m.localisation_atelier?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (m.id?.toString() || "").includes(searchTerm)
    );
    setFilteredMeters(results);
  }, [searchTerm, meters]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (meter) => {
    setFormData({
      id: meter.id,
      nom: meter.nom || '',
      localisation_atelier: meter.localisation_atelier || '',
      type: meter.type || 'Digital'
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le compteur ${id} ?`)) {
      try {
        await axios.delete(`http://127.0.0.1:8000/compteurs/${id}`);
        fetchMeters(); // Rafraîchit la liste après suppression
      } catch (error) {
        alert(error.response?.data?.detail || "Erreur lors de la suppression.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Envoi au PUT http://127.0.0.1:8000/compteurs/{id}
        await axios.put(`http://127.0.0.1:8000/compteurs/${formData.id}`, formData);
      } else {
        // Envoi au POST http://127.0.0.1:8000/compteurs
        await axios.post('http://127.0.0.1:8000/compteurs', { ...formData, actif: true });
      }
      setIsModalOpen(false);
      resetForm();
      fetchMeters();
    } catch (error) {
      // Affiche l'erreur précise venant de FastAPI (ex: ID déjà existant)
      alert(error.response?.data?.detail || "Erreur serveur.");
    }
  };

  const resetForm = () => {
    setFormData({ id: '', nom: '', localisation_atelier: '', type: 'Digital' });
    setIsEditMode(false);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', color: '#1e293b', fontWeight: 'bold' }}>
            <Database size={32} color="#2563eb" /> Parc Wicmic
          </h1>
          <p style={{ color: '#64748b' }}>Gestion des unités de télérelève</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            style={{ 
              backgroundColor: '#2563eb', color: 'white', border: 'none', 
              padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', 
              fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Plus size={20} /> Ajouter un compteur
          </button>
        )}
      </div>

      {/* RECHERCHE */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ position: 'relative', maxWidth: '500px', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', color: '#94a3b8', pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder="Filtrer par ID, Nom ou Atelier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 12px 12px 45px', outline: 'none', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Nom</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Atelier</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Type</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!chargement && filteredMeters.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#2563eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Hash size={14}/>{m.id}</div>
                </td>
                <td style={{ padding: '16px', color: '#1e293b', fontWeight: '500' }}>{m.nom}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                    {m.localisation_atelier}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#64748b' }}>{m.type}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  {user?.role === 'Admin' ? (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button 
                        onClick={() => handleEditClick(m)}
                        style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <Edit size={16} /> Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Lecture seule</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMeters.length === 0 && !chargement && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Aucun compteur trouvé.</div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>
                {isEditMode ? "Mise à jour compteur" : "Nouveau Compteur"}
              </h2>
              <X onClick={() => { setIsModalOpen(false); resetForm(); }} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>ID</label>
                <input 
                  type="text" name="id" value={formData.id} onChange={handleChange} 
                  disabled={isEditMode}
                  placeholder="ex: WIC-001"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: isEditMode ? '#f1f5f9' : 'white', outline: 'none' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom du compteur" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>Atelier / Zone</label>
                <input type="text" name="localisation_atelier" value={formData.localisation_atelier} onChange={handleChange} placeholder="ex: Atelier Teinture" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>Type de cadran</label>
                <select 
                  name="type" value={formData.type} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', outline: 'none' }}
                >
                  <option value="Digital">Digital (Rouleaux)</option>
                  <option value="Analogique">Analogique (Aiguilles)</option>
                </select>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                {isEditMode ? 'Enregistrer les modifications' : 'Ajouter au parc'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetersPage;