
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import KPICard from '../components/dashboard/KPICard';
import ConsumptionChart from '../components/dashboard/ConsumptionChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import { WaterDrop, TrendingUp, Warning } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  // 1. Déclaration des States pour stocker les données de l'API
  const [compteurs, setCompteurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // 2. Appel à l'API FastAPI au chargement de la page
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/compteurs')
      .then((response) => {
        setCompteurs(response.data);
        setChargement(false);
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setErreur("Impossible de se connecter à la base de données Wicmic.");
        setChargement(false);
      });
  }, []);

  // 3. Gestion élégante du chargement et des erreurs avec Material-UI
  if (chargement) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('loading')}</Typography>
      </Box>
    );
  }

  if (erreur) {
    return <Alert severity="error" sx={{ mt: 3 }}>{t('error') + ': '}{erreur}</Alert>;
  }

  // 4. Calculs dynamiques basés sur ta base de données
  const totalCompteurs = compteurs.length;
  const compteursActifs = compteurs.filter(c => c.actif).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        {t('dashboard')}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* KPI 1 : Total Compteurs (Maintenant 100% Dynamique !) */}
        <Grid item xs={12} sm={6} md={4}>
          <KPICard 
            title={t('total_meters')} 
            value={totalCompteurs} 
            subtitle={`${compteursActifs} ${t('active_meters')}`}
            icon={<WaterDrop />} 
            color="#8ED8F8" 
          />
        </Grid>
        
        {/* KPI 2 : Consommation (Statique pour l'instant) */}
        <Grid item xs={12} sm={6} md={4}>
          <KPICard 
            title={t('consumption')} 
            value="15,450 m³" 
            subtitle={"+8% vs N-1"} 
            icon={<TrendingUp />} 
            color="#8CC63F" 
          />
        </Grid>
        
        {/* KPI 3 : Alertes (Statique pour l'instant) */}
        <Grid item xs={12} sm={6} md={4}>
          <KPICard 
            title={t('alerts')} 
            value={12} 
            subtitle={`3 ${t('urgent')}`}
            icon={<Warning />} 
            color="#ef4444" 
          />
        </Grid>
      </Grid>
      
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