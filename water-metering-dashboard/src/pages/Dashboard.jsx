import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import KPICard from '../components/dashboard/KPICard';
import ConsumptionChart from '../components/dashboard/ConsumptionChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import { WaterDrop, TrendingUp, Warning, Build, WifiOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const API = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats]           = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState(null);
  const [alertesCount, setAlertesCount] = useState(0);

useEffect(() => {
  Promise.all([
    axios.get(`${API}/dashboard/stats`),
    axios.get(`${API}/alertes/count`)
  ])
    .then(([statsRes, countRes]) => {
      setStats(statsRes.data);
      setAlertesCount(countRes.data.count);
      setChargement(false);
    })
    .catch(() => { setErreur('Impossible de charger les statistiques.'); setChargement(false); });
}, []);

  if (chargement) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
      </Box>
    );
  }

  if (erreur) return <Alert severity="error" sx={{ mt: 3 }}>{erreur}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('dashboard')}
      </Typography>

      {/* 5 KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <KPICard
            title={t('total_meters')}
            value={stats.total_meters}
            subtitle={`${stats.offline_meters} ${t('offline_meters')}`}
            icon={<WaterDrop />}
            color="#8ED8F8"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <KPICard
            title={t('consumption')}
            value={stats.total_consumption}
            subtitle={`${stats.active_leaks} ${t('active_leaks')}`}
            icon={<TrendingUp />}
            color="#8CC63F"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <KPICard
            title={t('alerts')}
            value={alertesCount}
            subtitle={`${stats.tickets_critiques} ${t('critical_count')}`}
            icon={<Warning />}
            color="#ef4444"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <KPICard
            title={t('offline_meters')}
            value={stats.offline_meters}
            subtitle={t('since_last_sync')}
            icon={<WifiOff />}
            color="#f97316"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <KPICard
            title={t('open_tickets')}
            value={stats.tickets_ouverts}
            subtitle={`${stats.tickets_critiques} ${t('critical_priority')}`}
            icon={<Build />}
            color="#a855f7"
          />
        </Grid>
      </Grid>

      {/* Graphique + Alertes */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ConsumptionChart />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RecentAlerts />
        </Grid>
      </Grid>
    </Box>
  );
}
