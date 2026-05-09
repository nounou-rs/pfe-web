import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';

const SEVERITE_COLOR = {
  critique: 'error',
  moderee: 'warning',
  faible: 'success',
};

export default function RecentAlerts() {
  const { t } = useTranslation();
  const [alertes, setAlertes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/alertes-recentes')
      .then((res) => {
        setAlertes(res.data);
        setChargement(false);
      })
      .catch(() => {
        setErreur(t('alerts_load_error', 'Impossible de charger les alertes.'));
        setChargement(false);
      });
  }, [t]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {t('recent_alerts', 'Alertes recentes')}
        </Typography>

        {chargement && <CircularProgress size={24} />}
        {erreur && <Alert severity="error">{erreur}</Alert>}

        {!chargement && !erreur && alertes.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('no_recent_alerts', 'Aucune alerte recente.')}
          </Typography>
        )}

        <List>
          {alertes.map((alerte) => (
            <ListItem key={alerte.id} sx={{ backgroundColor: '#f8fafc', borderRadius: 2, mb: 1 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {t(alerte.type_anomalie, alerte.type_anomalie)}
                    </Typography>
                    <Chip
                      label={t(alerte.severite, alerte.severite)}
                      size="small"
                      color={SEVERITE_COLOR[alerte.severite] || 'default'}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption">
                    {alerte.compteur_nom} ({alerte.compteur_id}) - {alerte.date}
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
