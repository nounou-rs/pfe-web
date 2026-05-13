import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Alert, Box, Button, Grid, MenuItem, Paper, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { Archive, Download, FilePlus, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API = 'http://127.0.0.1:8000';

// Valeurs exactes reconnues par _texte_normalise() du backend
const TYPE_OPTIONS = [
  { value: 'Consommation Globale',        label: 'Consommation Globale' },
  { value: 'Analyse des Fuites',          label: 'Analyse des Fuites' },
  { value: 'Prediction Trimestrielle',    label: 'Prédictions Trimestrielles' },
  { value: 'Alerte Critique',             label: 'Alertes Critiques' },
];

const PERIODE_OPTIONS = [
  { value: '7 jours',       label: 'Derniers 7 jours' },
  { value: '30 jours',      label: 'Derniers 30 jours' },
  { value: 'mois en cours', label: 'Mois en cours' },
  { value: 'annee en cours',label: 'Année en cours' },   // sans accent → reconnu par le backend
];

export default function ReportsPage() {
  const { t } = useTranslation();

  const [typeDonnees, setTypeDonnees] = useState('Consommation Globale');
  const [periode,     setPeriode]     = useState('30 jours');
  const [format,      setFormat]      = useState('PDF');
  const [archives,    setArchives]    = useState([]);
  const [message,     setMessage]     = useState({ text: '', severity: 'info' });
  const [isLoading,   setIsLoading]   = useState(false);

  // Confirmation d'archivage
  const [confirmOpen,    setConfirmOpen]    = useState(false);
  const [rapportToArchive, setRapportToArchive] = useState(null);

  // ── Chargement des rapports ──────────────────────────────────────────────
  const fetchArchives = async () => {
    try {
      const { data } = await axios.get(`${API}/rapports`);
      setArchives(data);
    } catch {
      console.error('Impossible de charger les rapports.');
    }
  };

  useEffect(() => { fetchArchives(); }, []);

  // ── Génération ───────────────────────────────────────────────────────────
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setMessage({ text: '', severity: 'info' });
    try {
      await axios.post(`${API}/rapports/generer`, {
        type_donnees: typeDonnees,
        periode:      periode,
        format:       format,
      });
      setMessage({ text: t('report_success', 'Rapport généré avec succès !'), severity: 'success' });
      fetchArchives();
      setTimeout(() => setMessage({ text: '', severity: 'info' }), 3000);
    } catch {
      setMessage({ text: t('report_error', 'Erreur lors de la génération.'), severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Téléchargement ───────────────────────────────────────────────────────
  const handleDownload = (archive) => {
    const link = document.createElement('a');
    link.href     = `${API}/rapports/download/${archive.id}`;
    link.download = archive.nom_fichier;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Archivage (= suppression logique) ───────────────────────────────────
  const openConfirm = (archive) => {
    setRapportToArchive(archive);
    setConfirmOpen(true);
  };

  const handleArchive = async () => {
    if (!rapportToArchive) return;
    setConfirmOpen(false);
    try {
      await axios.patch(`${API}/rapports/${rapportToArchive.id}/archiver`);
      setMessage({ text: t('report_archived', 'Rapport archivé avec succès.'), severity: 'success' });
      fetchArchives();
      setTimeout(() => setMessage({ text: '', severity: 'info' }), 3000);
    } catch {
      setMessage({ text: t('report_archive_error', "Erreur lors de l'archivage."), severity: 'error' });
    } finally {
      setRapportToArchive(null);
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>

      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FileText size={32} color="#0284c7" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            {t('reports_title', 'Rapports')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            {t('reports_subtitle', 'Générez et téléchargez vos rapports')}
          </Typography>
        </Box>
      </Box>

      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 3, borderRadius: '8px' }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>

        {/* ── Formulaire de génération ── */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#0f172a', mb: 3 }}>
              <FilePlus size={20} /> {t('generate_report', 'Générer un rapport')}
            </Typography>

            {/* Type de données */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                {t('data_type', 'Type de données')}
              </Typography>
              <Select fullWidth size="small" value={typeDonnees}
                onChange={(e) => setTypeDonnees(e.target.value)} sx={{ borderRadius: '8px' }}>
                {TYPE_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </Box>

            {/* Période */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                {t('period', 'Période')}
              </Typography>
              <Select fullWidth size="small" value={periode}
                onChange={(e) => setPeriode(e.target.value)} sx={{ borderRadius: '8px' }}>
                {PERIODE_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </Box>

            {/* Format */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>
                {t('output_format', 'Format de sortie')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth variant={format === 'PDF' ? 'contained' : 'outlined'}
                    onClick={() => setFormat('PDF')}
                    sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}>
                    PDF
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant={format === 'Excel' ? 'contained' : 'outlined'}
                    color="success" onClick={() => setFormat('Excel')}
                    sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}>
                    Excel
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Button fullWidth variant="contained" size="large"
              onClick={handleGenerateReport} disabled={isLoading}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1.5, boxShadow: 'none' }}>
              {isLoading
                ? t('generating', 'Génération en cours...')
                : t('generate_report', 'Générer le rapport')}
            </Button>
          </Paper>
        </Grid>

        {/* ── Archives ── */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
              {t('recent_archives', 'Archives Récentes')}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead sx={{ borderBottom: '2px solid #e2e8f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>
                      {t('file_name', 'Nom du fichier')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>
                      {t('date', 'Date')}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>
                      {t('actions', 'Actions')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {archives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#64748b' }}>
                        {t('no_reports', 'Aucun rapport généré pour le moment.')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    archives.map((archive) => (
                      <TableRow key={archive.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>

                        {/* Nom */}
                        <TableCell sx={{ fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FileText size={18} color={archive.format_sortie === 'Excel' ? '#16a34a' : '#ef4444'} />
                            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                              {archive.nom_fichier}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Date */}
                        <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                          {archive.date_generation
                            ? new Date(archive.date_generation).toLocaleDateString('fr-FR')
                            : '—'}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>

                            {/* Télécharger */}
                            <Button variant="outlined" size="small"
                              startIcon={<Download size={14} />}
                              onClick={() => handleDownload(archive)}
                              sx={{
                                borderRadius: '8px', textTransform: 'none', fontSize: '0.78rem',
                                color: '#0284c7', borderColor: '#bae6fd',
                                '&:hover': { bgcolor: '#e0f2fe', borderColor: '#0284c7' },
                              }}>
                              {t('download', 'Télécharger')}
                            </Button>

                            {/* Archiver (suppression logique) */}
                            <Button variant="outlined" size="small"
                              startIcon={<Archive size={14} />}
                              onClick={() => openConfirm(archive)}
                              sx={{
                                borderRadius: '8px', textTransform: 'none', fontSize: '0.78rem',
                                color: '#dc2626', borderColor: '#fecaca',
                                '&:hover': { bgcolor: '#fef2f2', borderColor: '#dc2626' },
                              }}>
                              {t('archive', 'Archiver')}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Dialog de confirmation d'archivage ── */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('confirm_archive_title', 'Archiver ce rapport ?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirm_archive_body',
              'Le rapport « {{name}} » sera archivé et retiré de la liste active. Cette action est réversible.',
              { name: rapportToArchive?.nom_fichier ?? '' }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined"
            sx={{ borderRadius: '8px', textTransform: 'none' }}>
            {t('cancel', 'Annuler')}
          </Button>
          <Button onClick={handleArchive} variant="contained" color="error"
            sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}>
            {t('confirm_archive', 'Archiver')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}