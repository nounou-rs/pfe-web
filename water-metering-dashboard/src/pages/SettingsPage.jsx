// SettingsPage.jsx — Complet avec section Seuils d'alerte + UI unifiée
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Box, Typography, Paper, Grid, Divider,
  List, ListItem, ListItemText, Switch,
  Avatar, Button, Chip, Stack, Modal, TextField, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, InputAdornment, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import {
  Globe, Lock, Bell, LogOut, ShieldCheck, X, Users, Trash2,
  AlertTriangle, HardDrive, Eye, EyeOff, UserPlus, RefreshCw,
  Droplets, Zap, Activity, Brain, Timer, TrendingDown, Save, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

// ==========================================
// COMPOSANT ICÔNE RÉUTILISABLE
// ==========================================
const StyledIcon = ({ icon: Icon, color, bgcolor }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 42, height: 42, borderRadius: '12px',
    backgroundColor: bgcolor, color: color, mr: 2, flexShrink: 0
  }}>
    <Icon size={22} />
  </Box>
);

// ==========================================
// COMPOSANT CHAMP SEUIL — ligne uniforme
// ==========================================
const SeuilField = ({ label, description, icon: Icon, iconColor, iconBg, value, onChange, unit, min = 0, max, step = 0.1 }) => (
  <ListItem sx={{ px: 3, py: 2.5, alignItems: 'flex-start' }}>
    <StyledIcon icon={Icon} color={iconColor} bgcolor={iconBg} />
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', color: '#0f172a' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mt: 0.3, mb: 1.5, fontSize: '0.82rem' }}>
        {description}
      </Typography>
      <TextField
        size="small"
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        inputProps={{ min, max, step }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {unit}
              </Typography>
            </InputAdornment>
          )
        }}
        sx={{
          width: 200,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            bgcolor: 'white',
            '&:hover fieldset': { borderColor: '#0284c7' },
            '&.Mui-focused fieldset': { borderColor: '#0284c7' }
          }
        }}
      />
    </Box>
  </ListItem>
);

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // ====== ÉTATS MOT DE PASSE ======
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ ancien: '', nouveau: '', confirmation: '' });
  const [message, setMessage] = useState({ text: '', severity: 'info' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ====== TOAST ======
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const showToast = (message, severity = 'success') => setToast({ open: true, message, severity });

  // ====== ÉTATS MODALE ACCÈS SYSTÈME ======
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [utilisateursListe, setUtilisateursListe] = useState([]);
  const [accessMessage, setAccessMessage] = useState({ text: '', severity: 'info' });

  // ====== CRÉATION UTILISATEUR ======
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ full_name: '', email: '', password: '', role: 'User' });
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ text: '', severity: 'info' });

  // ====== SUPPRESSION ======
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });

  // ====== STOCKAGE ======
  const [pathInput, setPathInput] = useState('');

  // ====== SEUILS D'ALERTE ======
  const [seuils, setSeuils] = useState({
    seuil_global_m3h: 10.0,
    seuil_fuite_nuit_m3h: 0.5,
    seuil_pic_consommation_pct: 30.0,
    confiance_ia_min: 0.8,
    seuil_sous_conso_m3h: 0.1,
    delai_resolution_ticket_h: 24,
  });
  const [seuilsLoading, setSeuilsLoading] = useState(false);
  const [seuilsChanged, setSeuilsChanged] = useState(false);

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================
  useEffect(() => {
    if (user?.role === 'Admin') {
      // Charger le chemin de stockage
      axios.get('http://127.0.0.1:8000/admin/settings/storage-path')
        .then(res => setPathInput(res.data.path))
        .catch(err => console.error('Erreur chargement chemin', err));

      // Charger les seuils
      axios.get('http://127.0.0.1:8000/settings')
        .then(res => {
          if (res.data) {
            setSeuils({
              seuil_global_m3h: res.data.seuil_global_m3h ?? 10.0,
              seuil_fuite_nuit_m3h: res.data.seuil_fuite_nuit_m3h ?? 0.5,
              seuil_pic_consommation_pct: res.data.seuil_pic_consommation_pct ?? 30.0,
              confiance_ia_min: res.data.confiance_ia_min ?? 0.8,
              seuil_sous_conso_m3h: res.data.seuil_sous_conso_m3h ?? 0.1,
              delai_resolution_ticket_h: res.data.delai_resolution_ticket_h ?? 24,
            });
          }
        })
        .catch(err => console.error('Erreur chargement seuils', err));
    }
  }, [user]);

  // ==========================================
  // HANDLERS — STOCKAGE
  // ==========================================
  const handleSavePath = async () => {
    if (!pathInput.trim()) {
      showToast('⚠️ Le chemin ne peut pas être vide !', 'warning');
      return;
    }
    try {
      await axios.put('http://127.0.0.1:8000/admin/settings/storage-path', { path: pathInput });
      showToast('✅ Chemin de stockage modifié avec succès !', 'success');
    } catch {
      showToast('❌ Erreur lors de la modification du chemin.', 'error');
    }
  };

  // ==========================================
  // HANDLERS — SEUILS
  // ==========================================
  const handleSeuilChange = (key, value) => {
    setSeuils(prev => ({ ...prev, [key]: value }));
    setSeuilsChanged(true);
  };

  const handleSaveSeuils = async () => {
    setSeuilsLoading(true);
    try {
      await axios.patch('http://127.0.0.1:8000/settings', seuils);
      showToast('✅ Seuils d\'alerte enregistrés avec succès !', 'success');
      setSeuilsChanged(false);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Erreur lors de la sauvegarde.';
      showToast(`❌ ${msg}`, 'error');
    } finally {
      setSeuilsLoading(false);
    }
  };

  const handleResetSeuils = async () => {
    setSeuilsLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/settings/reset');
      setSeuils({
        seuil_global_m3h: res.data.seuil_global_m3h,
        seuil_fuite_nuit_m3h: res.data.seuil_fuite_nuit_m3h,
        seuil_pic_consommation_pct: res.data.seuil_pic_consommation_pct,
        confiance_ia_min: res.data.confiance_ia_min,
        seuil_sous_conso_m3h: res.data.seuil_sous_conso_m3h,
        delai_resolution_ticket_h: res.data.delai_resolution_ticket_h,
      });
      setSeuilsChanged(false);
      showToast('🔄 Seuils réinitialisés aux valeurs par défaut.', 'info');
    } catch {
      showToast('❌ Erreur lors de la réinitialisation.', 'error');
    } finally {
      setSeuilsLoading(false);
    }
  };

  // ==========================================
  // HANDLERS — MOT DE PASSE
  // ==========================================
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.nouveau !== passwordData.confirmation) {
      setMessage({ text: 'Les deux nouveaux mots de passe ne correspondent pas.', severity: 'error' });
      return;
    }
    const userId = user?.id || user?.user_id;
    if (!userId) { setMessage({ text: 'ID utilisateur manquant.', severity: 'error' }); return; }
    try {
      await axios.put(`http://127.0.0.1:8000/utilisateurs/${userId}/mot-de-passe`, {
        ancien_mot_de_passe: passwordData.ancien,
        nouveau_mot_de_passe: passwordData.nouveau
      });
      setMessage({ text: 'Mot de passe mis à jour avec succès !', severity: 'success' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setMessage({ text: '', severity: 'info' });
        setPasswordData({ ancien: '', nouveau: '', confirmation: '' });
      }, 2000);
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      const msg = Array.isArray(errorDetail) ? errorDetail[0]?.msg : errorDetail;
      setMessage({ text: msg || 'Erreur lors de la mise à jour.', severity: 'error' });
    }
  };

  // ==========================================
  // HANDLERS — UTILISATEURS
  // ==========================================
  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/utilisateurs');
      setUtilisateursListe(response.data);
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
    }
  };

  const handleOpenAccessModal = () => {
    fetchUtilisateurs();
    setIsAccessModalOpen(true);
  };

  const handleRoleChange = async (userId, nouveauRole) => {
    try {
      await axios.put(`http://127.0.0.1:8000/utilisateurs/${userId}/role`, { role: nouveauRole });
      setAccessMessage({ text: 'Rôle mis à jour avec succès.', severity: 'success' });
      fetchUtilisateurs();
      setTimeout(() => setAccessMessage({ text: '', severity: 'info' }), 3000);
    } catch {
      setAccessMessage({ text: 'Erreur lors de la modification du rôle.', severity: 'error' });
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.full_name || !newUserData.email || !newUserData.password) {
      setCreateMessage({ text: 'Tous les champs sont obligatoires.', severity: 'warning' });
      return;
    }
    setCreateLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/admin/users/create', newUserData);
      setCreateMessage({ text: `✅ Compte de "${newUserData.full_name}" créé avec succès !`, severity: 'success' });
      setNewUserData({ full_name: '', email: '', password: '', role: 'User' });
      setTimeout(() => {
        setIsCreateUserDialogOpen(false);
        setCreateMessage({ text: '', severity: 'info' });
        fetchUtilisateurs();
      }, 1800);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Erreur lors de la création.';
      setCreateMessage({ text: `❌ ${msg}`, severity: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  const requestDeleteUser = (userId, userName) => setDeleteDialog({ open: true, userId, userName });
  const cancelDeleteUser = () => setDeleteDialog({ open: false, userId: null, userName: '' });

  const confirmDeleteUser = async () => {
    const { userId } = deleteDialog;
    try {
      await axios.delete(`http://127.0.0.1:8000/utilisateurs/${userId}`);
      setAccessMessage({ text: 'Utilisateur supprimé avec succès.', severity: 'success' });
      fetchUtilisateurs();
      setDeleteDialog({ open: false, userId: null, userName: '' });
      setTimeout(() => setAccessMessage({ text: '', severity: 'info' }), 3000);
    } catch (error) {
      setAccessMessage({ text: error.response?.data?.detail || 'Erreur lors de la suppression.', severity: 'error' });
      setDeleteDialog({ open: false, userId: null, userName: '' });
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>

      {/* EN-TÊTE */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('settings_title', 'Paramètres du compte')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
          {t('settings_subtitle', 'Gérez vos préférences, votre sécurité et vos notifications.')}
        </Typography>
      </Box>

      <Grid container spacing={4}>

        {/* ── COLONNE GAUCHE ── */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Avatar sx={{ width: 90, height: 90, margin: '0 auto 16px', bgcolor: '#0284c7', fontSize: '2rem', fontWeight: 'bold' }}>
              {user?.nom?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a' }}>{user?.nom || 'Utilisateur'}</Typography>
            <Chip
              label={user?.role === 'Admin' ? 'Administrateur Système' : 'Utilisateur'}
              color={user?.role === 'Admin' ? 'primary' : 'default'}
              size="small"
              sx={{ mt: 1, mb: 3, fontWeight: 500, borderRadius: '6px' }}
            />
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" color="error" startIcon={<LogOut size={18} />}
              onClick={logout} fullWidth sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
              Se déconnecter
            </Button>
          </Paper>
        </Grid>

        {/* ── COLONNE DROITE ── */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>

            {/* ── PRÉFÉRENCES GÉNÉRALES ── */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('general_preferences', 'Préférences Générales')}
                </Typography>
              </Box>
              <List disablePadding>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Globe} color="#0284c7" bgcolor="#e0f2fe" />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 500 }}>{t('language_system', 'Langue du système')}</Typography>}
                    secondary={t('language_desc', "Changer la langue de l'interface")}
                  />
                  <LanguageSwitcher />
                </ListItem>
                <Divider component="li" />
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Bell} color="#d97706" bgcolor="#fef3c7" />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 500 }}>{t('critical_alerts', 'Alertes Critiques')}</Typography>}
                    secondary={t('critical_alerts_desc', "Notifications d'anomalies de consommation")}
                  />
                  <Switch color="primary" defaultChecked />
                </ListItem>
              </List>
            </Paper>

            {/* ── SÉCURITÉ ET ACCÈS ── */}
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('security_access', 'Sécurité et Accès')}
                </Typography>
              </Box>
              <List disablePadding>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Lock} color="#16a34a" bgcolor="#dcfce7" />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 500 }}>{t('password', 'Mot de passe')}</Typography>}
                    secondary={t('secure_account', 'Sécurisez votre compte')}
                  />
                  <Button variant="contained" size="small"
                    onClick={() => setIsPasswordModalOpen(true)}
                    sx={{ borderRadius: '6px', textTransform: 'none', boxShadow: 'none' }}>
                    {t('update', 'Mettre à jour')}
                  </Button>
                </ListItem>

                {user?.role === 'Admin' && (
                  <>
                    <Divider component="li" />
                    <ListItem sx={{ px: 3, py: 2 }}>
                      <StyledIcon icon={ShieldCheck} color="#0284c7" bgcolor="#ede9fe" />
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 500 }}>{t('system_access_management', 'Gestion des accès système')}</Typography>}
                        secondary={t('configure_user_roles', 'Créer des comptes et configurer les rôles')}
                      />
                      <Button variant="contained" size="small" onClick={handleOpenAccessModal}
                        sx={{ borderRadius: '6px', textTransform: 'none', boxShadow: 'none', bgcolor: '#0284c7' }}>
                        {t('configure', 'Configurer')}
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>

            {/* ── SEUILS D'ALERTE (ADMIN SEULEMENT) ── */}
            {user?.role === 'Admin' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {/* En-tête avec boutons d'action */}
                <Box sx={{
                  px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Seuils d'Alerte
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Remettre les valeurs par défaut">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={seuilsLoading ? <CircularProgress size={14} /> : <RotateCcw size={14} />}
                        onClick={handleResetSeuils}
                        disabled={seuilsLoading}
                        sx={{
                          textTransform: 'none', borderRadius: '6px', fontWeight: 500,
                          borderColor: '#e2e8f0', color: '#64748b', fontSize: '0.8rem',
                          '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' }
                        }}
                      >
                        Réinitialiser
                      </Button>
                    </Tooltip>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={seuilsLoading ? <CircularProgress size={14} color="inherit" /> : <Save size={14} />}
                      onClick={handleSaveSeuils}
                      disabled={seuilsLoading || !seuilsChanged}
                      sx={{
                        textTransform: 'none', borderRadius: '6px', fontWeight: 600,
                        boxShadow: 'none', fontSize: '0.8rem',
                        bgcolor: seuilsChanged ? '#0284c7' : '#94a3b8',
                        '&:hover': { bgcolor: '#0270a8', boxShadow: 'none' }
                      }}
                    >
                      {seuilsChanged ? 'Enregistrer' : 'Sauvegardé'}
                    </Button>
                  </Box>
                </Box>

                <List disablePadding>

                  {/* Seuil global de débit */}
                  <SeuilField
                    label="Seuil global de débit"
                    description="Débit au-delà duquel une alerte critique est déclenchée sur n'importe quel compteur."
                    icon={Droplets}
                    iconColor="#0284c7"
                    iconBg="#e0f2fe"
                    value={seuils.seuil_global_m3h}
                    onChange={(v) => handleSeuilChange('seuil_global_m3h', v)}
                    unit="m³/h"
                    min={0.1}
                    step={0.5}
                  />
                  <Divider component="li" />

                  {/* Seuil fuite nocturne */}
                  <SeuilField
                    label="Seuil de fuite nocturne"
                    description="Débit détecté entre 00h et 06h considéré comme une fuite suspecte."
                    icon={Activity}
                    iconColor="#dc2626"
                    iconBg="#fee2e2"
                    value={seuils.seuil_fuite_nuit_m3h}
                    onChange={(v) => handleSeuilChange('seuil_fuite_nuit_m3h', v)}
                    unit="m³/h"
                    min={0}
                    step={0.1}
                  />
                  <Divider component="li" />

                  {/* Seuil pic de consommation */}
                  <SeuilField
                    label="Seuil de pic de consommation"
                    description="Écart en % par rapport à la moyenne journalière qui déclenche une alerte de pic."
                    icon={Zap}
                    iconColor="#d97706"
                    iconBg="#fef3c7"
                    value={seuils.seuil_pic_consommation_pct}
                    onChange={(v) => handleSeuilChange('seuil_pic_consommation_pct', v)}
                    unit="% d'écart"
                    min={1}
                    max={200}
                    step={1}
                  />
                  <Divider component="li" />

                  {/* Confiance IA minimum */}
                  <SeuilField
                    label="Confiance IA minimale (YOLO)"
                    description="Score de confiance minimum accepté pour valider automatiquement un relevé par OCR."
                    icon={Brain}
                    iconColor="#7c3aed"
                    iconBg="#ede9fe"
                    value={seuils.confiance_ia_min}
                    onChange={(v) => handleSeuilChange('confiance_ia_min', v)}
                    unit="score (0 → 1)"
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <Divider component="li" />

                  {/* Seuil sous-consommation */}
                  <SeuilField
                    label="Seuil de sous-consommation"
                    description="Débit en dessous duquel une alerte de sous-consommation (compteur bloqué ?) est levée."
                    icon={TrendingDown}
                    iconColor="#0f766e"
                    iconBg="#ccfbf1"
                    value={seuils.seuil_sous_conso_m3h}
                    onChange={(v) => handleSeuilChange('seuil_sous_conso_m3h', v)}
                    unit="m³/h"
                    min={0}
                    step={0.05}
                  />
                  <Divider component="li" />

                  {/* Délai résolution ticket */}
                  <SeuilField
                    label="Délai de résolution des tickets"
                    description="Durée maximale (en heures) avant qu'un ticket ouvert soit escaladé en priorité critique."
                    icon={Timer}
                    iconColor="#0369a1"
                    iconBg="#e0f2fe"
                    value={seuils.delai_resolution_ticket_h}
                    onChange={(v) => handleSeuilChange('delai_resolution_ticket_h', parseInt(v))}
                    unit="heures"
                    min={1}
                    step={1}
                  />

                </List>
              </Paper>
            )}

            {/* ── CONFIGURATION STOCKAGE (ADMIN) ── */}
            {user?.role === 'Admin' && (
              <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('server_configuration', 'Configuration du Serveur')}
                  </Typography>
                </Box>
                <List disablePadding>
                  <ListItem sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                      <StyledIcon icon={HardDrive} color="#0f766e" bgcolor="#ccfbf1" />
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 500 }}>{t('wicmic_images_folder', 'Dossier des images Wicmic')}</Typography>}
                        secondary={t('wicmic_images_folder_desc', "Chemin physique sur le serveur où les captures ESP32 sont sauvegardées.")}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', gap: 2, pl: '58px' }}>
                      <TextField fullWidth size="small" variant="outlined"
                        value={pathInput} onChange={(e) => setPathInput(e.target.value)}
                        placeholder={t('images_folder_placeholder', 'Ex: captures ou D:/Wicmic/Images')}
                        sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      <Button variant="contained" onClick={handleSavePath}
                        sx={{ textTransform: 'none', boxShadow: 'none', borderRadius: '6px', whiteSpace: 'nowrap', bgcolor: '#0284c7', '&:hover': { bgcolor: '#0270a8' } }}>
                        {t('save', 'Enregistrer')}
                      </Button>
                    </Box>
                  </ListItem>
                </List>
              </Paper>
            )}

          </Stack>
        </Grid>
      </Grid>

      {/* =========================================
          MODALE 1 — MOT DE PASSE
      ========================================= */}
      <Modal open={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 420, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 24, p: 4, outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#1e293b' }}>
              <Lock size={20} color="#0284c7" /> Modifier le mot de passe
            </Typography>
            <IconButton size="small" onClick={() => setIsPasswordModalOpen(false)} sx={{ color: '#64748b' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {message.text && <Alert severity={message.severity} sx={{ mb: 3, borderRadius: '8px' }}>{message.text}</Alert>}

          <form onSubmit={handlePasswordSubmit}>
            <Stack spacing={2.5}>
              {[
                { label: 'Ancien mot de passe', name: 'ancien', show: showOld, setShow: setShowOld },
                { label: 'Nouveau mot de passe', name: 'nouveau', show: showNew, setShow: setShowNew },
                { label: 'Confirmer le nouveau mot de passe', name: 'confirmation', show: showConfirm, setShow: setShowConfirm },
              ].map(({ label, name, show, setShow }) => (
                <TextField key={name} label={label} type={show ? 'text' : 'password'} name={name}
                  value={passwordData[name]} onChange={handlePasswordChange}
                  fullWidth required size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShow(!show)} size="small">
                          {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="text" color="inherit" onClick={() => setIsPasswordModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', bgcolor: '#0284c7', borderRadius: '6px' }}>
                Sauvegarder
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* =========================================
          MODALE 2 — GESTION DES ACCÈS
      ========================================= */}
      <Modal open={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95vw', md: 860 }, maxHeight: '88vh', overflowY: 'auto',
          bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 24, p: 4, outline: 'none'
        }}>
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#1e293b' }}>
              <Users size={20} color="#0284c7" /> Gestion des Utilisateurs Wicmic
            </Typography>
            <IconButton size="small" onClick={() => setIsAccessModalOpen(false)} sx={{ color: '#64748b' }}>
              <X size={20} />
            </IconButton>
          </Box>

          {accessMessage.text && (
            <Alert severity={accessMessage.severity} sx={{ mb: 3, borderRadius: '8px' }}>{accessMessage.text}</Alert>
          )}

          {/* ── BOUTON AJOUTER — même style que les actions du tableau ── */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<UserPlus size={16} />}
              onClick={() => { setIsCreateUserDialogOpen(true); setCreateMessage({ text: '', severity: 'info' }); }}
              sx={{
                textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                boxShadow: 'none', bgcolor: '#0284c7',
                '&:hover': { bgcolor: '#0270a8', boxShadow: 'none' }
              }}
            >
              Ajouter un utilisateur
            </Button>
          </Box>

          {/* ── TABLEAU UTILISATEURS ── */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inscription</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rôle</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {utilisateursListe.map((u) => (
                  <TableRow key={u.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#0284c7', fontSize: '0.85rem', fontWeight: 600 }}>
                          {u.nom?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{u.nom}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.email_verifie ? 'Vérifié' : 'En attente'}
                        size="small"
                        color={u.email_verifie ? 'success' : 'warning'}
                        variant="outlined"
                        sx={{ borderRadius: '6px', fontWeight: 500, fontSize: '0.78rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role || 'User'} size="small"
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.id === user?.id}
                        sx={{ minWidth: 120, borderRadius: '8px', fontSize: '0.88rem' }}
                      >
                        <MenuItem value="User">👤 User</MenuItem>
                        <MenuItem value="Admin">🛡️ Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={u.id === user?.id ? 'Impossible de supprimer votre propre compte' : 'Supprimer'}>
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => requestDeleteUser(u.id, u.nom)}
                            disabled={u.id === user?.id}
                            sx={{ borderRadius: '8px', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Trash2 size={17} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {utilisateursListe.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

      {/* =========================================
          DIALOG — CRÉER UN UTILISATEUR
          Style unifié avec le reste de l'UI
      ========================================= */}
      <Dialog
        open={isCreateUserDialogOpen}
        onClose={() => !createLoading && setIsCreateUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' } }}
      >
        {/* En-tête du dialog */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 3, py: 2.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '10px', bgcolor: '#e0f2fe'
            }}>
              <UserPlus size={18} color="#0284c7" />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
              Créer un nouveau compte
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setIsCreateUserDialogOpen(false)} disabled={createLoading} sx={{ color: '#64748b' }}>
            <X size={18} />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>

          {createMessage.text && (
            <Alert severity={createMessage.severity} sx={{ mb: 3, borderRadius: '8px' }}>
              {createMessage.text}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              label="Nom complet"
              fullWidth size="small"
              value={newUserData.full_name}
              onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
              placeholder="Ex : Ahmed Ben Salah"
              disabled={createLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              label="Adresse email"
              fullWidth size="small" type="email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="Ex : ahmed@wicmic.com"
              disabled={createLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              label="Mot de passe"
              fullWidth size="small"
              type={showNewUserPassword ? 'text' : 'password'}
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              disabled={createLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewUserPassword(!showNewUserPassword)} size="small">
                      {showNewUserPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Sélecteur de rôle — même style que la page */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: '#475569', fontWeight: 500 }}>Rôle du compte</Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {[
                  { value: 'User', label: '👤 Utilisateur', desc: 'Accès standard' },
                  { value: 'Admin', label: '🛡️ Administrateur', desc: 'Accès complet' },
                ].map((option) => (
                  <Box
                    key={option.value}
                    onClick={() => !createLoading && setNewUserData({ ...newUserData, role: option.value })}
                    sx={{
                      flex: 1, p: 1.5, border: '2px solid',
                      borderColor: newUserData.role === option.value ? '#0284c7' : '#e2e8f0',
                      borderRadius: '10px', cursor: 'pointer',
                      bgcolor: newUserData.role === option.value ? '#f0f9ff' : 'white',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: '#0284c7', bgcolor: '#f0f9ff' }
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{option.label}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{option.desc}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        {/* Actions du dialog */}
        <Box sx={{
          display: 'flex', justifyContent: 'flex-end', gap: 1.5,
          px: 3, py: 2.5, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc'
        }}>
          <Button
            variant="text"
            onClick={() => setIsCreateUserDialogOpen(false)}
            disabled={createLoading}
            sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600, borderRadius: '8px' }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={createLoading}
            startIcon={createLoading ? <CircularProgress size={16} color="inherit" /> : <UserPlus size={16} />}
            sx={{
              textTransform: 'none', fontWeight: 600, boxShadow: 'none',
              borderRadius: '8px', bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0270a8', boxShadow: 'none' }
            }}
          >
            {createLoading ? 'Création...' : 'Créer le compte'}
          </Button>
        </Box>
      </Dialog>

      {/* =========================================
          DIALOG — CONFIRMATION SUPPRESSION
      ========================================= */}
      <Dialog open={deleteDialog.open} onClose={cancelDeleteUser}
        PaperProps={{ sx: { borderRadius: '12px', padding: 1 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 'bold' }}>
          <AlertTriangle size={24} /> Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', mt: 1 }}>
            Êtes-vous sûr de vouloir supprimer définitivement le compte de{' '}
            <strong style={{ color: '#0f172a' }}>{deleteDialog.userName}</strong> ?
            <br /><br />
            Cette action est <strong>irréversible</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={cancelDeleteUser} color="inherit"
            sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}>
            Annuler
          </Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained" autoFocus
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', borderRadius: '6px' }}>
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={toast.open} autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity} sx={{ width: '100%', boxShadow: 3, borderRadius: '8px' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}