import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  Box, Typography, Paper, IconButton, Chip, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import { AlertCircle, Trash2, AlertTriangle } from 'lucide-react';

export default function AlertsPage() {
  const { t } = useTranslation();
  const [alertes, setAlertes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // --- ÉTAT POUR LA BOÎTE DE DIALOGUE DE SUPPRESSION ---
  const [deleteDialog, setDeleteDialog] = useState({ open: false, alerteId: null });

  useEffect(() => {
    fetchAlertes();
  }, []);

  const fetchAlertes = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get('http://127.0.0.1:8000/alertes');
      setAlertes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
      setErrorMessage("Impossible de charger les alertes. Vérifiez votre connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FONCTIONS DE SUPPRESSION (Avec MUI Dialog) ---
  const requestDeleteAlerte = (alerteId) => {
    setDeleteDialog({ open: true, alerteId });
  };

  const cancelDeleteAlerte = () => {
    setDeleteDialog({ open: false, alerteId: null });
  };

  const confirmDeleteAlerte = async () => {
    const { alerteId } = deleteDialog;
    try {
      await axios.delete(`http://127.0.0.1:8000/alertes/${alerteId}`);
      // Mettre à jour la liste en retirant l'alerte supprimée
      setAlertes(alertes.filter(a => a.id !== alerteId));
      setDeleteDialog({ open: false, alerteId: null }); // Fermer la modale
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setErrorMessage("Erreur lors de la suppression de l'alerte.");
      setDeleteDialog({ open: false, alerteId: null });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critique': return { bg: '#fee2e2', text: '#ef4444' };
      case 'moyenne': return { bg: '#fef3c7', text: '#d97706' };
      case 'faible': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- EN-TÊTE --- */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AlertCircle size={32} /> {t('alerts_center', 'Centre des Alertes')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
            {alertes.length} {t('alerts_active', 'alertes actives nécessitant votre attention immédiate.')}
          </Typography>
        </Box>
        
        {alertes.length > 0 && (
          <Chip 
            label={t('system_alert', 'Système en Alerte')} 
            sx={{ 
              bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600, 
              fontSize: '1rem', py: 2.5, px: 1, borderRadius: '12px' 
            }} 
          />
        )}
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>
      )}

      {/* --- LISTE DES ALERTES --- */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : alertes.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>
            {t('no_active_alert', 'Aucune alerte active. Votre parc de compteurs fonctionne parfaitement.')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {alertes.map((alerte) => {
            const colors = getSeverityColor(alerte.severite);
            
            return (
              <Paper 
                key={alerte.id} 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  borderLeft: '6px solid #d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}
              >
                {/* Section d'information gauche */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ p: 1.5, bgcolor: '#fef3c7', borderRadius: '12px', color: '#d97706' }}>
                    <AlertCircle size={28} />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {t(alerte.type_anomalie, alerte.type_anomalie)}
                        </Typography>
                      <Chip 
                        label={t(alerte.severite, alerte.severite)} 
                        size="small" 
                        sx={{ bgcolor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.75rem' }} 
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {alerte.date}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
                      {t('meter', 'Compteur')} : {alerte.compteur_id} — {alerte.compteur_nom}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {alerte.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Section d'actions droite */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Appel de la nouvelle fonction ici */}
                  <IconButton 
                    onClick={() => requestDeleteAlerte(alerte.id)}
                    sx={{ bgcolor: '#ef4444', color: 'white', borderRadius: '10px', '&:hover': { bgcolor: '#dc2626' } }}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ================= MODALE DE CONFIRMATION DE SUPPRESSION ================= */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={cancelDeleteAlerte}
        PaperProps={{ sx: { borderRadius: '12px', padding: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 'bold' }}>
          <AlertTriangle size={24} /> Supprimer l'alerte
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', mt: 1 }}>
            {t('alert_delete_confirm', 'Voulez-vous vraiment supprimer cette alerte ?')} <br/>
            {t('alert_delete_warning', 'Cette action effacera la notification de votre tableau de bord.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={cancelDeleteAlerte} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}
          >
            {t('cancel', 'Annuler')}
          </Button>
          <Button 
            onClick={confirmDeleteAlerte} 
            color="error" 
            variant="contained" 
            autoFocus
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', borderRadius: '6px' }}
          >
            {t('delete', 'Supprimer')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
