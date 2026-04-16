import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit, Trash2, X, Database, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react'; // Pour l'icône d'avertissement

const MetersPage = () => {
  const { t } = useTranslation();
  const [meters, setMeters] = useState([]);
  const [filteredMeters, setFilteredMeters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chargement, setChargement] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 1. L'état pour contrôler la boîte de dialogue de suppression
  const [deleteDialog, setDeleteDialog] = useState({ open: false, meterId: null, meterName: '' });

  // 2. Fonction pour OUVRIR la boîte (à appeler quand on clique sur le bouton "Supprimer" du tableau)
  const requestDeleteMeter = (id, nom) => {
    setDeleteDialog({ open: true, meterId: id, meterName: nom });
  };

  // 3. Fonction pour ANNULER et fermer la boîte
  const cancelDelete = () => {
    setDeleteDialog({ open: false, meterId: null, meterName: '' });
  };

  // 4. Fonction pour CONFIRMER la suppression (C'est ici que tu mets ton code Axios)
  const confirmDelete = async () => {
    try {
      // Remplace cette ligne par ton vrai appel API de suppression
      await axios.delete(`http://127.0.0.1:8000/compteurs/${deleteDialog.meterId}`);
      
      // Mettre à jour ta liste de compteurs ici (ex: fetchMeters() ou setMeters(...))
      
      // Fermer la boîte de dialogue
      setDeleteDialog({ open: false, meterId: null, meterName: '' });
      
      // Afficher un message de succès (si tu as un Snackbar)
      // setToast({ open: true, message: "Compteur supprimé avec succès", severity: "success" });
      
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      // Gérer l'erreur...
      setDeleteDialog({ open: false, meterId: null, meterName: '' });
    }
  };
  
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
            <Database size={32} color="#2563eb" /> {t('meters_title', 'Parc Wicmic')}
          </h1>
          <p style={{ color: '#64748b' }}>{t('meters_subtitle', 'Gestion des unités de télérelève')}</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            style={{ 
              backgroundColor: '#0284c7', color: 'white', border: 'none', 
              padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', 
              fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
            }}
          >
            <Plus size={20} /> {t('add_meter', 'Ajouter un compteur')}
          </button>
        )}
      </div>

      {/* RECHERCHE */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ position: 'relative', maxWidth: '500px', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', color: '#94a3b8', pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder={t('meter_search', 'Filtrer par ID, Nom ou Atelier...')}
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
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>{t('meter_id', 'ID')}</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>{t('meter_name', 'Nom')}</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>{t('meter_zone', 'Atelier')}</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>{t('meter_type', 'Type')}</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600', textAlign: 'center' }}>{t('actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {!chargement && filteredMeters.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#0284c7' }}>
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
                        style={{ backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <Edit size={16} /> {t('edit', 'Modifier')}
                      </button>
                      <button 
                        onClick={() => requestDeleteMeter(m.id, m.nom)}
                        style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <Trash2 size={16} /> {t('delete', 'Supprimer')}
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t('read_only', 'Lecture seule')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMeters.length === 0 && !chargement && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>{t('no_meter_found', 'Aucun compteur trouvé.')}</div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1e293b' }}>
                {isEditMode ? t('update_meter', 'Mise à jour compteur') : t('new_meter', 'Nouveau Compteur')}
              </h2>
              <X onClick={() => { setIsModalOpen(false); resetForm(); }} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>{t('meter_id', 'ID')}</label>
                <input 
                  type="text" name="id" value={formData.id} onChange={handleChange} 
                  disabled={isEditMode}
                  placeholder={t('meter_id_placeholder', 'ex: WIC-001')}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: isEditMode ? '#f1f5f9' : 'white', outline: 'none' }} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>{t('meter_name', 'Nom')}</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder={t('meter_name_placeholder', 'Nom du compteur')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>{t('meter_zone', 'Atelier / Zone')}</label>
                <input type="text" name="localisation_atelier" value={formData.localisation_atelier} onChange={handleChange} placeholder={t('meter_zone_placeholder', 'ex: Atelier Teinture')} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#475569' }}>{t('meter_type_label', 'Type de cadran')}</label>
                <select 
                  name="type" value={formData.type} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', outline: 'none' }}
                >
                  <option value="Digital">{t('digital_roll', 'Digital (Rouleaux)')}</option>
                  <option value="Analogique">{t('analog_needle', 'Analogique (Aiguilles)')}</option>
                </select>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                {isEditMode ? t('save_changes', 'Enregistrer les modifications') : t('add_to_fleet', 'Ajouter au parc')}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ================= DIALOGUE DE CONFIRMATION DE SUPPRESSION ================= */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={cancelDelete}
        PaperProps={{ sx: { borderRadius: '12px', padding: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 'bold' }}>
          <AlertTriangle size={24} /> {t('delete_confirmation', 'Confirmation de suppression')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', mt: 1 }}>
            {t('meter_confirm_delete', { id: deleteDialog.meterId }, `Êtes-vous sûr de vouloir supprimer le compteur <strong style={{ color: '#0f172a' }}>${deleteDialog.meterId}</strong> ?`)}
            <br /><br />
            {t('delete_warning', 'Cette action est irréversible et supprimera tout l\'historique associé à cette unité.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={cancelDelete} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}
          >
            {t('cancel', 'Annuler')}
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained" 
            autoFocus
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', borderRadius: '6px' }}
          >
            {t('delete_forever', 'Supprimer définitivement')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MetersPage;