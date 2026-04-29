import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Search, Camera, CalendarClock, Aperture, Clock, AlertTriangle } from 'lucide-react';
import { Snackbar, Alert, CircularProgress, Box, TablePagination } from '@mui/material';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatUnit = (value, unit) => {
  if (!unit) return '';
  const labels = {
    Minute: value > 1 ? 'minutes' : 'minute',
    Heure:  value > 1 ? 'heures'  : 'heure',
    Jour:   value > 1 ? 'jours'   : 'jour',
    Mois:   'mois',
  };
  return labels[unit] ?? unit.toLowerCase();
};

const getWakeupStatus = (nextWakeup) => {
  if (!nextWakeup) return null;
  const diff = nextWakeup - new Date();

  if (diff < 0)
    return { color: '#dc2626', bg: '#fee2e2', icon: <AlertTriangle size={13} /> };
  if (diff < 10 * 60 * 1000)
    return { color: '#d97706', bg: '#fef3c7', icon: <Clock size={13} /> };
  return { color: '#0284c7', bg: '#e0f2fe', icon: <CalendarClock size={13} /> };
};

// ─── Composant ───────────────────────────────────────────────────────────────

const LiveCapturePage = () => {
  const { t } = useTranslation();

  const [meters, setMeters]               = useState([]);
  const [isLoadingDB, setIsLoadingDB]     = useState(true);
  const [loadingMeters, setLoadingMeters] = useState({});
  const [searchTerm, setSearchTerm]       = useState('');
  const [page, setPage]                   = useState(0);
  const [rowsPerPage, setRowsPerPage]     = useState(5);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customValue, setCustomValue]       = useState(1);
  const [customUnit, setCustomUnit]         = useState('Heure');
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // ── Chargement ─────────────────────────────────────────────────────────────
  const fetchMeters = async () => {
    try {
      // ← Nouvelle route dédiée, GET /compteurs des autres pages n'est pas touché
      const response = await axios.get('http://localhost:8000/live-capture/compteurs');
      const compteursBDD = response.data.map(c => ({
        id:              c.id,
        zone:            c.nom || 'Non défini',
        frequency_value: c.frequency_value,
        frequency_unit:  c.frequency_unit,
        nextWakeup:      c.next_wakeup ? new Date(c.next_wakeup) : null,
      }));
      setMeters(compteursBDD);
    } catch (error) {
      console.error('Erreur API :', error);
      setToast({
        open: true,
        message: t('error_load_meters', 'Impossible de charger les compteurs.'),
        severity: 'error',
      });
    } finally {
      setIsLoadingDB(false);
    }
  };

  useEffect(() => { fetchMeters(); }, []);

  // ── Programmation ──────────────────────────────────────────────────────────
  const handleOpenSettings = () => {
    setSelectedMeters(meters.map(m => m.id));
    setIsSettingsOpen(true);
  };

  const toggleAllMeters = () => {
    setSelectedMeters(selectedMeters.length === meters.length ? [] : meters.map(m => m.id));
  };

  const toggleMeterSelection = (id) => {
    setSelectedMeters(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const applyCustomFrequency = async () => {
    if (selectedMeters.length === 0) {
      setToast({ open: true, message: 'Veuillez sélectionner au moins un compteur.', severity: 'warning' });
      return;
    }
    try {
      await axios.post('http://localhost:8000/admin/update-planning-bulk', {
        meter_ids: selectedMeters,
        value: customValue,   // ← toujours un number (pas une string)
        unit:  customUnit,
      });

      // Recalcul optimiste du prochain réveil côté front
      const MULT = { Minute: 1, Heure: 60, Jour: 1440, Mois: 43200 };
      const totalMs = customValue * (MULT[customUnit] ?? 1) * 60_000;

      setMeters(prev =>
        prev.map(m =>
          selectedMeters.includes(m.id)
            ? {
                ...m,
                frequency_value: customValue,
                frequency_unit:  customUnit,
                nextWakeup: new Date(Date.now() + totalMs),
              }
            : m
        )
      );

      setIsSettingsOpen(false);
      setToast({
        open: true,
        message: `✅ Programmation réussie : chaque ${customValue} ${formatUnit(customValue, customUnit)}.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Erreur de programmation :', error);
      setToast({ open: true, message: 'Erreur lors de la communication avec le serveur.', severity: 'error' });
    }
  };

  // ── Capture ────────────────────────────────────────────────────────────────
  const triggerCapture = async (meterId) => {
    setLoadingMeters(prev => ({ ...prev, [meterId]: true }));
    try {
      await axios.post('http://localhost:8000/admin/force-capture', { counter_id: meterId });
      setTimeout(() => {
        setLoadingMeters(prev => ({ ...prev, [meterId]: false }));
        setToast({ open: true, message: t('capture_requested', 'Capture demandée.'), severity: 'success' });
      }, 5000);
    } catch {
      setLoadingMeters(prev => ({ ...prev, [meterId]: false }));
      setToast({ open: true, message: t('connection_error', 'Erreur de connexion.'), severity: 'error' });
    }
  };

  // ── Filtrage ───────────────────────────────────────────────────────────────
  const filteredMeters = meters.filter(m =>
    m.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Rendu de la cellule RÉVEIL PROGRAMMÉ ──────────────────────────────────
  const renderWakeupCell = (meter) => {
    const { nextWakeup, frequency_value: fv, frequency_unit: fu } = meter;

    if (!fv || !fu) {
      return (
        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
          Non programmé
        </span>
      );
    }

    const status = getWakeupStatus(nextWakeup);

    if (!nextWakeup || !status) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
          <CalendarClock size={14} color="#0284c7" />
          <span>Chaque {fv} {formatUnit(fv, fu)}</span>
        </div>
      );
    }

    const isLate  = nextWakeup < new Date();
    const dateStr = nextWakeup.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const timeStr = nextWakeup.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          backgroundColor: status.bg, color: status.color,
          padding: '3px 10px', borderRadius: '6px',
          fontSize: '0.8rem', fontWeight: 600, width: 'fit-content',
        }}>
          {status.icon}
          {isLate ? 'En retard · ' : ''}{dateStr} à {timeStr}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
          ↻ Chaque {fv} {formatUnit(fv, fu)}
        </span>
      </div>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '12px', color: '#0284c7' }}>
            <Aperture size={28} />
          </div>
          <div>
            <h1 style={{ color: '#0f172a', margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
              {t('live_capture')}
            </h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '0.95rem' }}>
              {t('live_capture_subtitle', 'Déclenchez des prises de vue manuelles et programmez les fréquences.')}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenSettings}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', color: '#0284c7', border: '1px solid #0284c7', padding: '10px 22px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <CalendarClock size={18} /> {t('batch_programming', 'Programmation par lots')}
        </button>
      </header>

      {/* BARRE DE RECHERCHE */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '500px' }}>
        <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder={t('meter_search', 'Filtrer par ID ou Secteur...')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' }}
        />
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {isLoadingDB ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <CircularProgress sx={{ color: '#0284c7' }} />
          </Box>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                <tr>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>{t('meter_id', 'ID COMPTEUR')}</th>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>{t('zone', 'LOCALISATION')}</th>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>{t('module_status', 'ÉTAT DU MODULE')}</th>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>{t('scheduled_wakeup', 'RÉVEIL PROGRAMMÉ')}</th>
                  <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>{t('actions', 'ACTION')}</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
                {filteredMeters.length > 0 ? (
                  filteredMeters
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(meter => (
                      <tr key={meter.id}>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0284c7' }}>
                          # {meter.id}
                        </td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                          {meter.zone}
                        </td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {t('ready', 'Prêt')}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                          {renderWakeupCell(meter)}
                        </td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>
                          <button
                            onClick={() => triggerCapture(meter.id)}
                            disabled={loadingMeters[meter.id]}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              backgroundColor: loadingMeters[meter.id] ? '#e2e8f0' : '#0284c7',
                              color: loadingMeters[meter.id] ? '#94a3b8' : 'white',
                              padding: '8px 20px', borderRadius: '8px', border: 'none',
                              cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                              boxShadow: loadingMeters[meter.id] ? 'none' : '0 2px 4px rgba(2,132,199,0.3)',
                            }}
                          >
                            {loadingMeters[meter.id]
                              ? t('request_sent', '⏳ Requête envoyée...')
                              : <><Camera size={16} /> {t('force_capture', 'Forcer Capture')}</>
                            }
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      {t('no_camera_module', 'Aucun module caméra disponible.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredMeters.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage={t('rows_per_page', 'Lignes par page:')}
              sx={{
                borderTop: '1px solid #f1f5f9',
                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                  color: '#64748b', fontSize: '0.85rem',
                },
              }}
            />
          </>
        )}
      </div>

      {/* MODALE DE PROGRAMMATION */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

            <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarClock size={24} color="#0284c7" />
              {t('advanced_programming', 'Programmation Avancée')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
              {t('custom_interval_desc', 'Configurez un intervalle de temps personnalisé pour la sélection de caméras.')}
            </p>

            {/* Valeur + Unité */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                  {t('value', 'Valeur')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={customValue}
                  onChange={e => setCustomValue(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }}
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>
                  {t('time_unit', 'Unité de temps')}
                </label>
                <select
                  value={customUnit}
                  onChange={e => setCustomUnit(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}
                >
                  <option value="Minute">{t('minute', 'Minute(s)')}</option>
                  <option value="Heure">{t('hour', 'Heure(s)')}</option>
                  <option value="Jour">{t('day', 'Jour(s)')}</option>
                  <option value="Mois">{t('month', 'Mois')}</option>
                </select>
              </div>
            </div>

            {/* Aperçu */}
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '0.85rem', color: '#0369a1' }}>
              📅 Réveil toutes les <strong>{customValue} {formatUnit(customValue, customUnit)}</strong> après chaque capture
            </div>

            {/* Sélection des compteurs */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                  Cibles : {selectedMeters.length}
                </span>
                <button
                  onClick={toggleAllMeters}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {selectedMeters.length === meters.length
                    ? t('uncheck_all', 'Tout décocher')
                    : t('check_all', 'Tout cocher')}
                </button>
              </div>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                {meters.map(m => (
                  <label
                    key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMeters.includes(m.id)}
                      onChange={() => toggleMeterSelection(m.id)}
                      style={{ accentColor: '#0284c7' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{m.id} — {m.zone}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setIsSettingsOpen(false)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('cancel', 'Annuler')}
              </button>
              <button
                onClick={applyCustomFrequency}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                {t('apply', 'Appliquer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          sx={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default LiveCapturePage;