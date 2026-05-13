import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const API = 'http://127.0.0.1:8000';

// Valeurs envoyées au backend (correspondent exactement à ce qu'attend /consommation/historique)
const PERIODS = [
  { value: "aujourd'hui", labelKey: 'consumption_today',  label: "Aujourd'hui" },
  { value: 'cette semaine', labelKey: 'consumption_week',  label: 'Cette semaine' },
  { value: 'mois',          labelKey: 'consumption_month', label: 'Ce mois' },
  { value: 'annee',         labelKey: 'consumption_year',  label: 'Cette année' },
];

const normalizeConsumptionRow = (row) => ({
  time:        row.heure ?? row.time ?? row.label ?? row.date ?? row.mois ?? row.month ?? row.annee ?? row.year,
  consumption: row.consommation ?? row.consumption ?? row.total ?? row.index ?? row.debit ?? 0,
  label:       row.date_complete ?? row.label ?? row.date ?? row.time,
});

export default function ConsumptionChart() {
  const { t } = useTranslation();
  const [donnees,    setDonnees]    = useState([]);
  const [periode,    setPeriode]    = useState("aujourd'hui");
  const [chargement, setChargement] = useState(true);
  const [erreur,     setErreur]     = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchConsumption = async () => {
      setChargement(true);
      setErreur(null);

      try {
        // Endpoint unique et correct, avec la valeur de période attendue par le backend
        const response = await axios.get(`${API}/consommation/historique`, {
          params: { periode: periode },   // ✅ "periode" correspond au paramètre FastAPI
        });

        const rows = Array.isArray(response.data)
          ? response.data
          : (response.data?.data ?? []);

        if (!ignore) {
          setDonnees(rows.map(normalizeConsumptionRow));
        }
      } catch {
        if (!ignore) {
          setErreur(
            t('consumption_history_error', "Impossible de charger l'historique de consommation.")
          );
        }
      } finally {
        if (!ignore) setChargement(false);
      }
    };

    fetchConsumption();
    return () => { ignore = true; };
  }, [periode, t]);

  const handlePeriodChange = (event) => {
    setPeriode(event.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {t('consumption_history', 'Historique de consommation')}
          </Typography>

          {/* Liste déroulante à la place des ToggleButtons */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="period-select-label">
              {t('consumption_period', 'Période')}
            </InputLabel>
            <Select
              labelId="period-select-label"
              value={periode}
              label={t('consumption_period', 'Période')}
              onChange={handlePeriodChange}
            >
              {PERIODS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey, option.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {chargement && <CircularProgress size={24} />}
        {erreur     && <Alert severity="error">{erreur}</Alert>}

        {!chargement && !erreur && donnees.length === 0 && (
          <Alert severity="info">
            {t('no_consumption_data', 'Aucune donnée de consommation disponible pour cette période.')}
          </Alert>
        )}

        {!chargement && !erreur && donnees.length > 0 && (
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
                formatter={(value) => [`${value} m³`, t('index', 'Index')]}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.label || label}
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