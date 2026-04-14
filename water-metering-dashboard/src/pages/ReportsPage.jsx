import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, Select, MenuItem, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert
} from '@mui/material';
import { FileText, Download, FilePlus } from 'lucide-react';

export default function ReportsPage() {
  // --- ÉTATS DU FORMULAIRE ---
  const [typeDonnees, setTypeDonnees] = useState('Consommation Globale');
  const [periode, setPeriode] = useState('Derniers 30 jours');
  const [format, setFormat] = useState('PDF'); // 'PDF' ou 'Excel'

  // --- ÉTATS DES DONNÉES ---
  const [archives, setArchives] = useState([]);
  const [message, setMessage] = useState({ text: '', severity: 'info' });
  const [isLoading, setIsLoading] = useState(false);

  // --- CHARGEMENT DES ARCHIVES AU DÉMARRAGE ---
  const fetchArchives = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/rapports');
      setArchives(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des rapports:", error);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  // --- FONCTION DE GÉNÉRATION ---
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setMessage({ text: '', severity: 'info' });

    try {
      await axios.post('http://127.0.0.1:8000/rapports/generer', {
        type_donnees: typeDonnees,
        periode: periode,
        format: format
      });
      
      setMessage({ text: "Rapport généré et archivé avec succès !", severity: "success" });
      fetchArchives(); // Rafraîchit le tableau de droite
      
      // Fait disparaître le message après 3 secondes
      setTimeout(() => setMessage({ text: '', severity: 'info' }), 3000);
    } catch (error) {
      setMessage({ text: "Erreur lors de la génération du rapport.", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- EN-TÊTE --- */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FileText size={32} color="#0284c7" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Rapports & Exportations
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Générez des analyses détaillées de votre parc de compteurs
          </Typography>
        </Box>
      </Box>

      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 3, borderRadius: '8px' }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        
        {/* --- COLONNE GAUCHE : FORMULAIRE NOUVEAU RAPPORT --- */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#0f172a', mb: 3 }}>
              <FilePlus size={20} /> Nouveau Rapport
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>Type de données</Typography>
              <Select 
                fullWidth size="small" 
                value={typeDonnees} 
                onChange={(e) => setTypeDonnees(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="Consommation Globale">Consommation Globale</MenuItem>
                <MenuItem value="Analyse des Fuites">Analyse des Fuites</MenuItem>
                <MenuItem value="Prédictions Trimestrielles">Prédictions Trimestrielles</MenuItem>
                <MenuItem value="Alertes Critiques">Alertes Critiques</MenuItem>
              </Select>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>Période</Typography>
              <Select 
                fullWidth size="small" 
                value={periode} 
                onChange={(e) => setPeriode(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="Derniers 7 jours">Derniers 7 jours</MenuItem>
                <MenuItem value="Derniers 30 jours">Derniers 30 jours</MenuItem>
                <MenuItem value="Mois en cours">Mois en cours</MenuItem>
                <MenuItem value="Année en cours">Année en cours</MenuItem>
              </Select>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#475569', mb: 1 }}>Format de sortie</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant={format === 'PDF' ? "contained" : "outlined"}
                    onClick={() => setFormat('PDF')}
                    sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}
                  >
                    📄 PDF
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant={format === 'Excel' ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setFormat('Excel')}
                    sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}
                  >
                    📊 Excel
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              onClick={handleGenerateReport}
              disabled={isLoading}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1.5, boxShadow: 'none' }}
            >
              {isLoading ? "Génération en cours..." : "Générer le rapport"}
            </Button>
          </Paper>
        </Grid>

        {/* --- COLONNE DROITE : ARCHIVES RÉCENTES --- */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
              Archives Récentes
            </Typography>

            <TableContainer>
              <Table>
                <TableHead sx={{ borderBottom: '2px solid #e2e8f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>Nom du fichier</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: 'none' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {archives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#64748b' }}>
                        Aucun rapport généré pour le moment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    archives.map((archive) => (
                      <TableRow key={archive.id}>
                        <TableCell sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                          <FileText size={18} color={archive.format_sortie === 'Excel' ? '#16a34a' : '#ef4444'} />
                          {archive.nom_fichier}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                          {new Date(archive.date_generation).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{ minWidth: 'auto', p: 1, borderRadius: '8px', color: '#64748b', borderColor: '#e2e8f0' }}
                            // Ici tu pourras ajouter la vraie fonction de téléchargement plus tard
                            onClick={() => alert(`Téléchargement de ${archive.nom_fichier}`)} 
                          >
                            <Download size={16} />
                          </Button>
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
    </Box>
  );
}