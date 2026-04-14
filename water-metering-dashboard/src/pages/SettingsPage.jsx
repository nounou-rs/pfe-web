import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, Divider, 
  List, ListItem, ListItemText, Switch,
  Avatar, Button, Chip, Stack, Modal, TextField, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { 
  Globe, Lock, Bell, LogOut, ShieldCheck, X, Users, Trash2, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const StyledIcon = ({ icon: Icon, color, bgcolor }) => (
  <Box sx={{ 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 42, height: 42, borderRadius: '12px',
    backgroundColor: bgcolor, color: color, mr: 2 
  }}>
    <Icon size={22} />
  </Box>
);

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  // ====== ÉTATS MODALE MOT DE PASSE ======
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ ancien: '', nouveau: '', confirmation: '' });
  const [message, setMessage] = useState({ text: '', severity: 'info' });

  // ====== ÉTATS MODALE ACCÈS SYSTÈME ======
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [utilisateursListe, setUtilisateursListe] = useState([]);
  const [accessMessage, setAccessMessage] = useState({ text: '', severity: 'info' });

  // ====== ÉTAT DIALOGUE DE SUPPRESSION ======
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' });

  // --- FONCTIONS MOT DE PASSE ---
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', severity: 'info' });
    if (passwordData.nouveau !== passwordData.confirmation) {
      setMessage({ text: "Les nouveaux mots de passe ne correspondent pas.", severity: "error" });
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/utilisateurs/${user.id}/mot-de-passe`, {
        ancien_mot_de_passe: passwordData.ancien,
        nouveau_mot_de_passe: passwordData.nouveau
      });
      setMessage({ text: "Mot de passe mis à jour avec succès !", severity: "success" });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordData({ ancien: '', nouveau: '', confirmation: '' });
        setMessage({ text: '', severity: 'info' });
      }, 2000);
    } catch (error) {
      setMessage({ text: error.response?.data?.detail || "Erreur lors de la mise à jour.", severity: "error" });
    }
  };

  // --- FONCTIONS ACCÈS SYSTÈME ---
  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/utilisateurs');
      setUtilisateursListe(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  const handleOpenAccessModal = () => {
    fetchUtilisateurs();
    setIsAccessModalOpen(true);
  };

  const handleRoleChange = async (userId, nouveauRole) => {
    try {
      await axios.put(`http://127.0.0.1:8000/utilisateurs/${userId}/role`, { role: nouveauRole });
      setAccessMessage({ text: "Rôle mis à jour avec succès.", severity: "success" });
      fetchUtilisateurs(); 
      setTimeout(() => setAccessMessage({ text: '', severity: 'info' }), 3000);
    } catch (error) {
      setAccessMessage({ text: "Erreur lors de la modification du rôle.", severity: "error" });
    }
  };

  // --- FONCTIONS DE SUPPRESSION (Personnalisées avec Dialog) ---
  const requestDeleteUser = (userId, userName) => {
    // Au lieu du window.confirm, on ouvre notre belle modale MUI
    setDeleteDialog({ open: true, userId, userName });
  };

  const cancelDeleteUser = () => {
    setDeleteDialog({ open: false, userId: null, userName: '' });
  };

  const confirmDeleteUser = async () => {
    const { userId } = deleteDialog;
    try {
      await axios.delete(`http://127.0.0.1:8000/utilisateurs/${userId}`);
      setAccessMessage({ text: "Utilisateur supprimé avec succès.", severity: "success" });
      fetchUtilisateurs(); // On met à jour le tableau
      setDeleteDialog({ open: false, userId: null, userName: '' }); // On ferme la modale
      setTimeout(() => setAccessMessage({ text: '', severity: 'info' }), 3000);
    } catch (error) {
      setAccessMessage({ text: error.response?.data?.detail || "Erreur lors de la suppression.", severity: "error" });
      setDeleteDialog({ open: false, userId: null, userName: '' }); // On ferme la modale même en cas d'erreur
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- EN-TÊTE --- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('settings_title', 'Paramètres du compte')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
          Gérez vos préférences, votre sécurité et vos notifications.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* --- COLONNE GAUCHE (PROFIL) --- */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Avatar sx={{ width: 90, height: 90, margin: '0 auto 16px', bgcolor: '#0284c7', fontSize: '2rem', fontWeight: 'bold' }}>
              {user?.nom?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a' }}>{user?.nom || 'Utilisateur'}</Typography>
            <Chip label={user?.role === 'Admin' ? 'Administrateur Système' : 'Utilisateur'} color={user?.role === 'Admin' ? 'primary' : 'default'} size="small" sx={{ mt: 1, mb: 3, fontWeight: 500, borderRadius: '6px' }} />
            <Divider sx={{ mb: 3 }} />
            <Button variant="outlined" color="error" startIcon={<LogOut size={18} />} onClick={logout} fullWidth sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
              Se déconnecter
            </Button>
          </Paper>
        </Grid>

        {/* --- COLONNE DROITE (PARAMÈTRES) --- */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Préférences Générales</Typography>
              </Box>
              <List disablePadding>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Globe} color="#0284c7" bgcolor="#e0f2fe" />
                  <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>Langue du système</Typography>} secondary="Changer la langue de l'interface" />
                  <LanguageSwitcher />
                </ListItem>
                <Divider component="li" />
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Bell} color="#d97706" bgcolor="#fef3c7" />
                  <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>Alertes Critiques</Typography>} secondary="Notifications d'anomalies de consommation" />
                  <Switch color="primary" defaultChecked />
                </ListItem>
              </List>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Sécurité et Accès</Typography>
              </Box>
              <List disablePadding>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <StyledIcon icon={Lock} color="#16a34a" bgcolor="#dcfce7" />
                  <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>Mot de passe</Typography>} secondary="Sécurisez votre compte" />
                  <Button variant="contained" size="small" onClick={() => setIsPasswordModalOpen(true)} sx={{ borderRadius: '6px', textTransform: 'none', boxShadow: 'none' }}>
                    Mettre à jour
                  </Button>
                </ListItem>
                
                {user?.role === 'Admin' && (
                  <>
                    <Divider component="li" />
                    <ListItem sx={{ px: 3, py: 2 }}>
                      <StyledIcon icon={ShieldCheck} color="#7c3aed" bgcolor="#ede9fe" />
                      <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>Gestion des accès système</Typography>} secondary="Configurer les rôles des utilisateurs" />
                      <Button variant="outlined" size="small" color="inherit" onClick={handleOpenAccessModal} sx={{ borderRadius: '6px', textTransform: 'none' }}>
                        Configurer
                      </Button>
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* ================= MODALE 1 : MOT DE PASSE ================= */}
      <Modal open={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 400, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 24, p: 4, outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#1e293b' }}>
              <Lock size={20} color="#0284c7" /> Modifier le mot de passe
            </Typography>
            <Box onClick={() => setIsPasswordModalOpen(false)} sx={{ cursor: 'pointer', color: '#64748b' }}><X size={20} /></Box>
          </Box>

          {message.text && (
            <Alert severity={message.severity} sx={{ mb: 3, borderRadius: '8px' }}>{message.text}</Alert>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <Stack spacing={2.5}>
              <TextField label="Ancien mot de passe" type="password" name="ancien" value={passwordData.ancien} onChange={handlePasswordChange} fullWidth required size="small" />
              <TextField label="Nouveau mot de passe" type="password" name="nouveau" value={passwordData.nouveau} onChange={handlePasswordChange} fullWidth required size="small" />
              <TextField label="Confirmer le nouveau mot de passe" type="password" name="confirmation" value={passwordData.confirmation} onChange={handlePasswordChange} fullWidth required size="small" />
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="text" color="inherit" onClick={() => setIsPasswordModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Annuler</Button>
              <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}>Sauvegarder</Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* ================= MODALE 2 : GESTION DES ACCÈS ================= */}
      <Modal open={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, maxHeight: '80vh', overflowY: 'auto',
          bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 24, p: 4, outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: '#1e293b' }}>
              <Users size={20} color="#7c3aed" /> Gestion des Utilisateurs Wicmic
            </Typography>
            <Box onClick={() => setIsAccessModalOpen(false)} sx={{ cursor: 'pointer', color: '#64748b' }}><X size={20} /></Box>
          </Box>

          {accessMessage.text && (
            <Alert severity={accessMessage.severity} sx={{ mb: 3, borderRadius: '8px' }}>{accessMessage.text}</Alert>
          )}

          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Date d'inscription</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Rôle</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {utilisateursListe.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell sx={{ fontWeight: 500 }}>{u.nom}</TableCell>
                    <TableCell>
                      <Chip label={u.email_verifie ? "Vérifié" : "En attente"} size="small" color={u.email_verifie ? "success" : "warning"} variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role || 'User'}
                        size="small"
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.id === user.id} 
                        sx={{ minWidth: 120, borderRadius: '6px' }}
                      >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      {/* Ici, on appelle notre nouvelle fonction requestDeleteUser */}
                      <Button 
                        color="error" 
                        onClick={() => requestDeleteUser(u.id, u.nom)}
                        disabled={u.id === user.id} 
                        sx={{ minWidth: 'auto', p: 1, borderRadius: '8px' }}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>

      {/* ================= MODALE 3 : DIALOGUE DE CONFIRMATION DE SUPPRESSION ================= */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={cancelDeleteUser}
        PaperProps={{ sx: { borderRadius: '12px', padding: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 'bold' }}>
          <AlertTriangle size={24} /> Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#334155', mt: 1 }}>
            Êtes-vous sûr de vouloir supprimer définitivement le compte de <strong style={{ color: '#0f172a' }}>{deleteDialog.userName}</strong> ?
            <br /><br />
            Cette action est irréversible et supprimera l'accès de cet utilisateur au système.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={cancelDeleteUser} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDeleteUser} 
            color="error" 
            variant="contained" 
            autoFocus
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 'none', borderRadius: '6px' }}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}