import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

export default function ConsumptionChart() {
  const [donnees, setDonnees]       = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/consommation/historique')
      .then(res => {
        // Adapter au format attendu par recharts
        const formatted = res.data.map(r => ({
          time:        r.heure,
          consumption: r.index ?? r.debit ?? 0,
          label:       r.date_complete,
        }));
        setDonnees(formatted);
        setChargement(false);
      })
      .catch(() => {
        setErreur('Impossible de charger l\'historique de consommation.');
        setChargement(false);
      });
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Historique de consommation
        </Typography>

        {chargement && <CircularProgress size={24} />}
        {erreur     && <Alert severity="error">{erreur}</Alert>}

        {!chargement && !erreur && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={donnees} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0078B8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8ED8F8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 8 }}
                formatter={(v) => [`${v} m³`, 'Index']}
                labelFormatter={(l, payload) => payload?.[0]?.payload?.label || l}
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