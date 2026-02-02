import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import KPICard from '../components/dashboard/KPICard';
import ConsumptionChart from '../components/dashboard/ConsumptionChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import { WaterDrop, TrendingUp, Warning } from '@mui/icons-material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>Dashboard</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}><KPICard title="Total Compteurs" value={245} subtitle="+5 ce mois" icon={<WaterDrop />} color="#8ED8F8" /></Grid>
        <Grid item xs={12} sm={6} md={4}><KPICard title="Consommation" value="15,450 m³" subtitle="+8% vs N-1" icon={<TrendingUp />} color="#8CC63F" /></Grid>
        <Grid item xs={12} sm={6} md={4}><KPICard title="Alertes" value={12} subtitle="3 urgentes" icon={<Warning />} color="#ef4444" /></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}><ConsumptionChart /></Grid>
        <Grid item xs={12} lg={4}><RecentAlerts /></Grid>
      </Grid>
    </Box>
  );
}
