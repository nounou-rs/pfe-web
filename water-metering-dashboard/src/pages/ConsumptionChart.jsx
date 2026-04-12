import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Calendar as CalendarMonth, TrendingUp } from 'lucide-react';

const periods = [
  { key: 'day', label: 'Aujourd\'hui', icon: Clock },
  { key: 'week', label: 'Semaine', icon: Calendar },
  { key: 'month', label: 'Mois', icon: CalendarMonth },
  { key: 'year', label: 'Année', icon: TrendingUp },
];

export default function ConsumptionChart() {
  const [period, setPeriod] = useState('day');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Appel à l'API à chaque fois que la période change
  useEffect(() => {
    setLoading(true);
    
    // Pour l'instant, on appelle la même route. Plus tard, tu pourras ajouter
    // des paramètres à ton API FastAPI comme : /consommation/historique?periode=week
    axios.get('http://127.0.0.1:8000/consommation/historique')
      .then((response) => {
        // On adapte les données reçues de l'API (index) au format attendu par ton graphique (consumption)
        const formattedData = response.data.map(item => ({
          time: item.heure,               // Pour l'axe X (vue jour)
          date: item.date_complete.split(' ')[0], // Pour l'axe X (vue mois/semaine)
          consumption: item.index         // C'est ton index_m3
        }));
        
        setChartData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur récupération historique :", error);
        setLoading(false);
      });
  }, [period]); // Le useEffect se redéclenche si on clique sur un autre bouton

  // Déterminer le label et la clé de l'axe X en fonction de la période choisie
  const getDisplaySettings = () => {
    switch(period) {
      case 'day': return { label: 'Consommation aujourd\'hui', dataKey: 'time' };
      case 'week': return { label: 'Consommation cette semaine', dataKey: 'date' };
      case 'month': return { label: 'Consommation sur 30 jours', dataKey: 'date' };
      case 'year': return { label: 'Consommation annuelle', dataKey: 'date' };
      default: return { label: 'Consommation', dataKey: 'time' };
    }
  };

  const { label, dataKey } = getDisplaySettings();

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <Typography variant="h6" fontWeight="bold">{label}</Typography>
          
          {/* Boutons de filtre */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {periods.map((p) => {
              const Icon = p.icon;
              const isActive = period === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    backgroundColor: isActive ? '#0078B8' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    cursor: 'pointer', fontWeight: isActive ? 600 : 500,
                    fontSize: '14px', transition: 'all 0.2s ease', fontFamily: 'inherit'
                  }}
                >
                  <Icon size={16} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography color="textSecondary">Aucune donnée trouvée.</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0078B8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8ED8F8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey={dataKey} stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}
                formatter={(value) => [`${value} m³`, 'Index']}
                labelFormatter={(label) => `${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke="#0078B8" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}