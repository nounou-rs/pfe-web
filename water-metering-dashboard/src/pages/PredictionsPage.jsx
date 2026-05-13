import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Grid, TextField, IconButton,
  CircularProgress, Chip, Fade, Tooltip, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { Brain, Send, Bot, Sparkles, Trash2, RefreshCw, Archive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API = 'http://127.0.0.1:8000';

const Avatar = ({ children, sx }) => (
  <Box sx={{
    width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', flexShrink: 0, ...sx
  }}>
    {children}
  </Box>
);

const BADGE_COLORS = {
  alerte:    { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  attention: { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
  info:      { bg: '#e0f2fe', color: '#0284c7', border: '#7dd3fc' },
  succes:    { bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
  projection:{ bg: '#ede9fe', color: '#7c3aed', border: '#c4b5fd' },
};

export default function PredictionsPage() {
  const { t } = useTranslation();
  const [insights,        setInsights]        = useState([]);
  const [messages,        setMessages]        = useState([]);
  const [inputMessage,    setInputMessage]    = useState('');
  const [isTyping,        setIsTyping]        = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Confirmation archivage insight
  const [confirmOpen,      setConfirmOpen]      = useState(false);
  const [insightToArchive, setInsightToArchive] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { fetchInsights(); fetchChatHistory(); }, []);
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // ── Insights ───────────────────────────────────────────────
  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await axios.get(`${API}/predictions/insights`);
      setInsights(res.data || []);
    } catch {
      console.error('Erreur insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const openArchiveConfirm = (insight) => {
    setInsightToArchive(insight);
    setConfirmOpen(true);
  };

  const handleArchiveInsight = async () => {
    if (!insightToArchive) return;
    setConfirmOpen(false);
    try {
      await axios.patch(`${API}/predictions/insights/${insightToArchive.id}/archiver`);
      // Retrait immédiat de la liste sans refetch
      setInsights(prev => prev.filter(i => i.id !== insightToArchive.id));
    } catch {
      console.error("Erreur lors de l'archivage de l'insight");
    } finally {
      setInsightToArchive(null);
    }
  };

  // ── Chat ───────────────────────────────────────────────────
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${API}/chat/messages`);
      if (!res.data || res.data.length === 0) {
        setMessages([{
          expediteur: 'ai',
          texte: t('ai_greeting', "Bonjour ! Je suis WaterBot, l'assistant Wicmic. Posez-moi une question sur vos compteurs, consommations ou anomalies.")
        }]);
      } else {
        setMessages(res.data);
      }
    } catch {
      setMessages([{ expediteur: 'ai', texte: "Bonjour ! Je suis WaterBot. Comment puis-je vous aider ?" }]);
    }
  };

  const handleClearChat = async () => {
    try {
      await axios.delete(`${API}/chat/messages`);
      setMessages([{ expediteur: 'ai', texte: "Historique effacé. Comment puis-je vous aider ?" }]);
    } catch {
      console.error('Erreur suppression historique');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { expediteur: 'user', texte: userMsg }]);
    setIsTyping(true);
    try {
      const res = await axios.post(`${API}/chat/envoyer`, { message: userMsg });
      const aiText = res.data?.ai_message || res.data?.message || t('ai_error', "Désolé, je n'ai pas pu générer de réponse.");
      setMessages(prev => [...prev, { expediteur: 'ai', texte: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        expediteur: 'ai',
        texte: error.response?.data?.detail || t('ai_error', 'Désolé, une erreur de communication est survenue.')
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: '100%', margin: '0 auto', height: 'calc(100vh - 48px)', bgcolor: '#f8fafc' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>

        {/* ===== COLONNE GAUCHE : INSIGHTS ===== */}
        <Grid item xs={12} md={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* En-tête */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center' }}>
                <Brain size={28} color="#0284c7" />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  {t('ai_analysis_center', "Centre d'Analyse IA")}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                  {t('ai_auto_detection', 'Détections automatiques et recommandations')}
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Rafraîchir les insights">
              <IconButton onClick={fetchInsights} size="small" sx={{ bgcolor: '#f1f5f9' }}>
                <RefreshCw size={16} color="#64748b" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Liste des insights */}
          <Box sx={{
            flexGrow: 1, overflowY: 'auto', pr: 1, pb: 2,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
          }}>
            {loadingInsights ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
                <CircularProgress size={32} sx={{ color: '#0284c7' }} />
              </Box>
            ) : insights.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>
                <Brain size={48} strokeWidth={1} />
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                  {t('no_insights', 'Aucune analyse disponible. Les insights apparaissent après chaque capture.')}
                </Typography>
              </Box>
            ) : (
              insights.map((insight, index) => {
                const badgeKey = insight.type_badge?.toLowerCase() || 'info';
                const colors   = BADGE_COLORS[badgeKey] || BADGE_COLORS.info;
                return (
                  <Fade in={true} timeout={400 + index * 150} key={insight.id}>
                    <Paper elevation={0} sx={{
                      p: 3, mb: 3, borderRadius: '16px', bgcolor: '#ffffff',
                      border: '1px solid', borderColor: colors.border,
                      position: 'relative', overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }
                    }}>

                      {/* Barre latérale colorée */}
                      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', bgcolor: colors.color }} />

                      {/* Badge + date + bouton archiver */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Chip
                          label={insight.type_badge || 'Insight'}
                          size="small"
                          sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, fontSize: '0.75rem', border: `1px solid ${colors.border}` }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {insight.date_creation && (
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              {new Date(insight.date_creation).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                          {/* ── Bouton Archiver ── */}
                          <Tooltip title="Archiver cet insight">
                            <IconButton
                              size="small"
                              onClick={() => openArchiveConfirm(insight)}
                              sx={{
                                color: '#94a3b8', p: 0.5, borderRadius: '6px',
                                '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' }
                              }}
                            >
                              <Archive size={15} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '1rem' }}>
                        {insight.titre || '—'}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6, fontSize: '0.9rem' }}>
                        {insight.description || '—'}
                      </Typography>

                      {insight.conseil_ia && (
                        <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Bot size={15} color="#0284c7" />
                            {t('ai_advice', 'Conseil IA')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, fontSize: '0.85rem' }}>
                            {insight.conseil_ia}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Fade>
                );
              })
            )}
          </Box>
        </Grid>

        {/* ===== COLONNE DROITE : CHATBOT ===== */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{
            height: '100%', display: 'flex', flexDirection: 'column',
            borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.05)'
          }}>

            {/* Header chatbot */}
            <Box sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ bgcolor: '#0284c7', width: 42, height: 42 }}>
                    <Bot size={24} />
                  </Avatar>
                  <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, bgcolor: '#22c55e', borderRadius: '50%', border: '2px solid white' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                    {t('ai_assistant', 'WaterBot')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 600 }}>
                    ● {t('ai_online', 'En ligne — données BDD en temps réel')}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Effacer l'historique de conversation">
                <IconButton onClick={handleClearChat} size="small"
                  sx={{ bgcolor: '#fef2f2', color: '#ef4444', borderRadius: '8px', '&:hover': { bgcolor: '#fee2e2' } }}>
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Zone messages */}
            <Box sx={{
              flexGrow: 1, p: 3, overflowY: 'auto', bgcolor: '#f8fafc',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' }
            }}>
              {messages.map((msg, index) => (
                <Fade in={true} key={index}>
                  <Box sx={{ display: 'flex', justifyContent: msg.expediteur === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1.5, mb: 2.5 }}>
                    {msg.expediteur === 'ai' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', flexShrink: 0 }}>
                        <Bot size={18} color="#475569" />
                      </Avatar>
                    )}
                    <Box sx={{
                      maxWidth: '75%', px: 2.5, py: 1.5, borderRadius: '20px',
                      bgcolor: msg.expediteur === 'user' ? '#0284c7' : '#ffffff',
                      color: msg.expediteur === 'user' ? '#ffffff' : '#1e293b',
                      borderBottomRightRadius: msg.expediteur === 'user' ? '4px' : '20px',
                      borderBottomLeftRadius:  msg.expediteur === 'ai'   ? '4px' : '20px',
                      boxShadow: msg.expediteur === 'ai' ? '0 2px 8px rgb(0 0 0 / 0.07)' : '0 4px 10px rgb(2 132 199 / 0.25)',
                      border: msg.expediteur === 'ai' ? '1px solid #e2e8f0' : 'none',
                    }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.65, fontSize: '0.92rem', color: msg.expediteur === 'user' ? '#ffffff' : '#1e293b', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {msg.texte}
                      </Typography>
                    </Box>
                    {msg.expediteur === 'user' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#0284c7', flexShrink: 0 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>Moi</Typography>
                      </Avatar>
                    )}
                  </Box>
                </Fade>
              ))}

              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 1.5, mb: 2.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', flexShrink: 0 }}>
                    <Bot size={18} color="#475569" />
                  </Avatar>
                  <Box sx={{ bgcolor: '#ffffff', px: 2.5, py: 2, borderRadius: '20px', borderBottomLeftRadius: '4px', boxShadow: '0 2px 8px rgb(0 0 0 / 0.07)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={14} sx={{ color: '#0284c7' }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {t('ai_thinking', 'WaterBot analyse les données...')}
                    </Typography>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Suggestions rapides */}
            <Box sx={{ px: 2.5, pt: 1.5, bgcolor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {["Résumé de consommation", "Y a-t-il des fuites ?", "Compteur avec débit max", "Tickets ouverts"].map((s) => (
                <Chip key={s} label={s} size="small" onClick={() => setInputMessage(s)}
                  sx={{ cursor: 'pointer', fontSize: '0.75rem', bgcolor: '#f1f5f9', color: '#475569', '&:hover': { bgcolor: '#e0f2fe', color: '#0284c7' }, borderRadius: '8px' }}
                />
              ))}
            </Box>

            {/* Zone de saisie */}
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2.5, bgcolor: '#ffffff' }}>
              <TextField
                fullWidth
                placeholder={t('ask_question_placeholder', "Ex: 'Quel est l'état du compteur MTR-001 ?'")}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                multiline
                maxRows={3}
                InputProps={{
                  sx: {
                    borderRadius: '24px', bgcolor: '#f1f5f9', color: '#1e293b', fontSize: '0.92rem',
                    '& fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '1.5px solid #0284c7' },
                    '& textarea::placeholder': { color: '#94a3b8', opacity: 1 },
                  },
                  endAdornment: (
                    <Box sx={{ bgcolor: inputMessage.trim() && !isTyping ? '#0284c7' : '#e2e8f0', borderRadius: '50%', transition: 'background 0.2s', ml: 1, flexShrink: 0 }}>
                      <IconButton type="submit" disabled={!inputMessage.trim() || isTyping}
                        sx={{ color: inputMessage.trim() && !isTyping ? '#ffffff' : '#94a3b8', p: 1 }}>
                        <Send size={18} />
                      </IconButton>
                    </Box>
                  )
                }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block', textAlign: 'center' }}>
                Entrée pour envoyer · Maj+Entrée pour saut de ligne
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Dialog confirmation archivage insight ── */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('confirm_archive_insight_title', 'Archiver cet insight ?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirm_archive_insight_body',
              'L\'analyse « {{titre}} » sera archivée et retirée de la liste. Cette action est réversible depuis la base de données.',
              { titre: insightToArchive?.titre ?? '' }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined"
            sx={{ borderRadius: '8px', textTransform: 'none' }}>
            {t('cancel', 'Annuler')}
          </Button>
          <Button onClick={handleArchiveInsight} variant="contained" color="error"
            sx={{ borderRadius: '8px', textTransform: 'none', boxShadow: 'none' }}>
            {t('confirm_archive', 'Archiver')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}