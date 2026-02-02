import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';
import { Calendar, Clock, Calendar as CalendarMonth, TrendingUp } from 'lucide-react';

// Données pour différentes périodes
const dataDay = [
  { time: '00:00', consumption: 10 },
  { time: '04:00', consumption: 8 },
  { time: '08:00', consumption: 45 },
  { time: '12:00', consumption: 62 },
  { time: '16:00', consumption: 55 },
  { time: '20:00', consumption: 48 },
  { time: '23:59', consumption: 20 },
];

const dataWeek = [
  { date: 'Lun', consumption: 320 },
  { date: 'Mar', consumption: 380 },
  { date: 'Mer', consumption: 350 },
  { date: 'Jeu', consumption: 410 },
  { date: 'Ven', consumption: 440 },
  { date: 'Sam', consumption: 520 },
  { date: 'Dim', consumption: 480 },
];

const dataMonth = [
  { date: 'Jan 1', consumption: 450 },
  { date: 'Jan 10', consumption: 520 },
  { date: 'Jan 20', consumption: 540 },
  { date: 'Jan 30', consumption: 580 },
];

const dataYear = [
  { month: 'Jan', consumption: 4500 },
  { month: 'Fev', consumption: 4200 },
  { month: 'Mar', consumption: 5100 },
  { month: 'Avr', consumption: 5800 },
  { month: 'Mai', consumption: 6200 },
  { month: 'Jun', consumption: 6800 },
  { month: 'Jul', consumption: 7200 },
  { month: 'Aou', consumption: 7100 },
  { month: 'Sep', consumption: 6500 },
  { month: 'Oct', consumption: 5900 },
  { month: 'Nov', consumption: 5200 },
  { month: 'Dec', consumption: 5800 },
];

const periods = [
  { key: 'day', label: 'Aujourd\'hui', icon: Clock },
  { key: 'week', label: 'Semaine', icon: Calendar },
  { key: 'month', label: 'Mois', icon: CalendarMonth },
  { key: 'year', label: 'Année', icon: TrendingUp },
];

export default function ConsumptionChart() {
  const [period, setPeriod] = useState('month');

  const getDataByPeriod = () => {
    switch(period) {
      case 'day': return { data: dataDay, label: 'Consommation aujourd\'hui', dataKey: 'time' };
      case 'week': return { data: dataWeek, label: 'Consommation cette semaine', dataKey: 'date' };
      case 'month': return { data: dataMonth, label: 'Consommation sur 30 jours', dataKey: 'date' };
      case 'year': return { data: dataYear, label: 'Consommation annuelle', dataKey: 'month' };
      default: return { data: dataMonth, label: 'Consommation', dataKey: 'date' };
    }
  };

  const { data, label, dataKey } = getDataByPeriod();

  return (
    <Card>
      <CardContent>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Typography variant="h6" fontWeight="bold">{ label }</Typography>
          
          {/* Period Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {periods.map((p) => {
              const Icon = p.icon;
              const isActive = period === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? '#0078B8' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.backgroundColor = '#E2E8F0';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.backgroundColor = '#F1F5F9';
                  }}
                >
                  <Icon size={16} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0078B8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8ED8F8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003D7A" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#0078B8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey={dataKey} stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [`${value} m³`, 'Consommation']}
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
      </CardContent>
    </Card>
  );
}
