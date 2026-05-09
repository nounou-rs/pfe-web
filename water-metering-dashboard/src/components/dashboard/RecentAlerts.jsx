import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Typography, List, ListItem,
  ListItemText, Chip, Box, CircularProgress, Alert
} from '@mui/material';

const SEVERITE_COLOR = {
  critique: 'error',
  modérée:  'warning',
  faible:   'success',
};

export default function RecentAlerts() {
  const [alertes, setAlertes]       = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/alertes-recentes')
      .then(res => { setAlertes(res.data); setChargement(false); })
      .catch(() => { setErreur('Impossible de charger les alertes.'); setChargement(false); });
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Alertes Récentes
        </Typography>

        {chargement && <CircularProgress size={24} />}
        {erreur    && <Alert severity="error">{erreur}</Alert>}

        {!chargement && !erreur && alertes.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Aucune alerte récente.
          </Typography>
        )}

        <List>
          {alertes.map(a => (
            <ListItem key={a.id} sx={{ backgroundColor: '#f8fafc', borderRadius: 2, mb: 1 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {a.type_anomalie}
                    </Typography>
                    <Chip
                      label={a.severite}
                      size="small"
                      color={SEVERITE_COLOR[a.severite] || 'default'}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption">
                    {a.compteur_nom} ({a.compteur_id}) • {a.date}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}