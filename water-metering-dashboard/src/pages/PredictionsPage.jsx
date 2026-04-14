import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, TextField, IconButton, 
  CircularProgress, Chip, Fade
} from '@mui/material';
import { Brain, Send, Bot, ChevronRight, Sparkles } from 'lucide-react';

export default function PredictionsPage() {
  const [insights, setInsights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchInsights();
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const fetchInsights = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/predictions/insights');
      setInsights(res.data);
    } catch (error) {
      console.error("Erreur insights:", error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/chat/messages');
      if (res.data.length === 0) {
        setMessages([{ expediteur: 'ai', texte: 'Bonjour ! Je suis l\'intelligence Wicmic. Je peux analyser vos consommations ou détecter des fuites. Que souhaitez-vous savoir ?' }]);
      } else {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Erreur chat:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { expediteur: 'user', texte: userMsg }]);
    setIsTyping(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/chat/envoyer', { message: userMsg });
      setMessages(prev => [...prev, { expediteur: 'ai', texte: res.data.ai_message }]);
    } catch (error) {
      console.error("Erreur envoi:", error);
      setMessages(prev => [...prev, { expediteur: 'ai', texte: 'Désolé, une erreur de communication est survenue.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 64px)', bgcolor: '#f8fafc' }}>
      
      <Grid container spacing={4} sx={{ height: '100%' }}>
        
        {/* ================= COLONNE GAUCHE : INSIGHTS ================= */}
        <Grid item xs={12} md={5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={28} color="#0284c7" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Centre d'Analyse IA
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                Détections automatiques et recommandations
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2, pb: 2, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' } }}>
            {insights.map((insight, index) => {
              const isAlert = insight.type_badge === 'Alerte Critique';
              return (
                <Fade in={true} timeout={500 + (index * 200)} key={insight.id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, mb: 3, borderRadius: '16px', 
                      bgcolor: isAlert ? '#fffaf9' : '#ffffff',
                      border: '1px solid',
                      borderColor: isAlert ? '#fecaca' : '#e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                        borderColor: isAlert ? '#fca5a5' : '#cbd5e1',
                      }
                    }}
                  >
                    {/* Petite barre de couleur sur le côté gauche */}
                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', bgcolor: isAlert ? '#ef4444' : '#0284c7' }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={insight.type_badge} 
                        size="small" 
                        icon={isAlert ? <Sparkles size={14} /> : null}
                        sx={{ 
                          bgcolor: isAlert ? '#fee2e2' : '#f1f5f9',
                          color: isAlert ? '#dc2626' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          px: 0.5
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '1.1rem' }}>
                      {insight.titre}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {insight.description}
                    </Typography>

                    {insight.conseil_ia ? (
                      <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Bot size={16} color="#0284c7" /> Conseil IA
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#334155', mt: 0.5 }}>
                          {insight.conseil_ia}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0284c7', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', '&:hover': { color: '#0369a1' } }}>
                        Voir les détails <ChevronRight size={18} />
                      </Box>
                    )}
                  </Paper>
                </Fade>
              );
            })}
          </Box>
        </Grid>

        {/* ================= COLONNE DROITE : CHATBOT ================= */}
        <Grid item xs={12} md={7} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ 
            height: '100%', display: 'flex', flexDirection: 'column', 
            borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.05)'
          }}>
            
            {/* Header du Chat */}
            <Box sx={{ px: 3, py: 2, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ bgcolor: '#0284c7', width: 42, height: 42 }}><Bot size={24} /></Avatar>
                  <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, bgcolor: '#22c55e', borderRadius: '50%', border: '2px solid white' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>Assistant Wicmic</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>En ligne - Prêt à analyser</Typography>
                </Box>
              </Box>
            </Box>

            {/* Zone des messages (Fond gris clair pour le contraste) */}
            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', bgcolor: '#f8fafc', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' } }}>
              {messages.map((msg, index) => (
                <Fade in={true} key={index}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: msg.expediteur === 'user' ? 'flex-end' : 'flex-start',
                      mb: 3
                    }}
                  >
                    {msg.expediteur === 'ai' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', color: '#64748b', mr: 1.5, mt: 'auto' }}><Bot size={18} /></Avatar>
                    )}
                    
                    <Box sx={{ 
                      maxWidth: '75%', 
                      px: 2.5, py: 1.5, 
                      borderRadius: '20px',
                      bgcolor: msg.expediteur === 'user' ? '#0284c7' : '#ffffff',
                      background: msg.expediteur === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : '#ffffff',
                      color: msg.expediteur === 'user' ? '#ffffff' : '#1e293b',
                      borderBottomRightRadius: msg.expediteur === 'user' ? '4px' : '20px',
                      borderBottomLeftRadius: msg.expediteur === 'ai' ? '4px' : '20px',
                      boxShadow: msg.expediteur === 'ai' ? '0 2px 5px rgb(0 0 0 / 0.05)' : '0 4px 10px rgb(2 132 199 / 0.3)',
                    }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.5, fontSize: '0.95rem' }}>
                        {msg.texte}
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                   <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', color: '#64748b', mr: 1.5, mt: 'auto' }}><Bot size={18} /></Avatar>
                  <Box sx={{ bgcolor: '#ffffff', px: 2.5, py: 2, borderRadius: '20px', borderBottomLeftRadius: '4px', boxShadow: '0 2px 5px rgb(0 0 0 / 0.05)' }}>
                    <CircularProgress size={16} sx={{ color: '#0284c7' }} />
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Zone de saisie */}
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2.5, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
              <TextField
                fullWidth
                placeholder="Posez une question (ex: 'Y a-t-il une fuite ?')..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { 
                    borderRadius: '24px', 
                    bgcolor: '#f1f5f9',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '1px solid #cbd5e1' },
                  },
                  endAdornment: (
                    <Box sx={{ bgcolor: inputMessage.trim() ? '#0284c7' : 'transparent', borderRadius: '50%', transition: 'all 0.2s' }}>
                      <IconButton type="submit" disabled={!inputMessage.trim() || isTyping} sx={{ color: inputMessage.trim() ? '#ffffff' : '#94a3b8' }}>
                        <Send size={18} />
                      </IconButton>
                    </Box>
                  )
                }}
              />
            </Box>

          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}

// Composant Avatar maison mis à jour
const Avatar = ({ children, sx }) => (
  <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', ...sx }}>
    {children}
  </Box>
);