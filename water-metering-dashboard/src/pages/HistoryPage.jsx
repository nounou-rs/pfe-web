import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, TablePagination, Chip, Avatar, TextField, InputAdornment
} from '@mui/material';
import { History, Search, Droplets, Target, Calendar, Image as ImageIcon } from 'lucide-react';

const HistoryPage = () => {
  const [releves, setReleves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Récupération des données
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/releves');
        setReleves(response.data);
      } catch (error) {
        console.error("Erreur chargement relevés:", error);
      }
    };
    fetchHistory();
  }, []);

  // Logique de filtrage
  const filteredReleves = releves.filter((releve) => 
    releve.compteur_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* SECTION TITRE (Identique à tes captures) */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          bgcolor: '#e0f2fe', // Bleu très clair pour l'icône
          borderRadius: '12px', 
          color: '#0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <History size={28} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
            Historique
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Consultez les relevés passés et les analyses de vos compteurs.
          </Typography>
        </Box>
      </Box>

      {/* BARRE DE RECHERCHE (Style exact de tes captures) */}
      <TextField
        placeholder="Filtrer par ID, Nom ou Atelier..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(0);
        }}
        sx={{ 
          mb: 4,
          maxWidth: '600px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            bgcolor: 'white',
            '& fieldset': { borderColor: '#e2e8f0' },
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color="#94a3b8" />
            </InputAdornment>
          ),
        }}
      />

      {/* TABLEAU (Dans une carte arrondie) */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)', 
        overflow: 'hidden',
        border: '1px solid #f1f5f9'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Horodatage</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Index (m³)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Débit (m³/h)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Confiance</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Aperçu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReleves
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((releve) => (
                  <TableRow key={releve.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {/* ID en bleu comme dans ton design */}
                    <TableCell sx={{ fontWeight: 700, color: '#0284c7' }}>
                      # {releve.compteur_id}
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={14} color="#94a3b8" />
                        <Typography sx={{ fontSize: '0.9rem', color: '#1e293b' }}>
                          {new Date(releve.releve_timestamp).toLocaleString('fr-FR')}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>{releve.index_m3} m³</TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                        <Droplets size={14} color="#0ea5e9" />
                        {releve.debit_m3h || 0}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip 
                        label={`${(releve.confiance_yolo * 100).toFixed(0)}%`}
                        size="small"
                        sx={{ 
                          bgcolor: releve.confiance_yolo > 0.8 ? '#dcfce7' : '#fef9c3',
                          color: releve.confiance_yolo > 0.8 ? '#166534' : '#854d0e',
                          fontWeight: 700,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {releve.image_url ? (
                        <Avatar 
                          variant="rounded" 
                          src={releve.image_url} 
                          sx={{ width: 36, height: 36, cursor: 'pointer', borderRadius: '8px' }}
                          onClick={() => window.open(releve.image_url, '_blank')}
                        />
                      ) : (
                        <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '8px', display: 'inline-flex' }}>
                          <ImageIcon size={18} color="#cbd5e1" />
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReleves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          sx={{ borderTop: '1px solid #f1f5f9' }}
        />
      </Paper>
    </Box>
  );
};

export default HistoryPage;