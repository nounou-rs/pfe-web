import React, { useState, useEffect, useRef } from 'react';
import { Brain, Lightbulb, TrendingUp, Send, Bot, User, Sparkles, ChevronRight } from 'lucide-react';

const PredictionsPage = () => {
  // --- ÉTAT DU CHATBOT ---
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Bonjour ! Je suis l\'intelligence Wicmic. Je peux analyser vos consommations ou détecter des fuites. Que souhaitez-vous savoir ?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll vers le bas du chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Simulation de la réponse LLM (Lien futur avec FastAPI)
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "D'après mes analyses récentes sur le secteur Nord, la consommation est 15% plus élevée que la normale. Je recommande une inspection visuelle du compteur MTR-001." 
      }]);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      
      {/* 1. HEADER DE LA PAGE */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            backgroundColor: 'var(--color-primary)', 
            padding: '10px', 
            borderRadius: '12px', 
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 120, 184, 0.3)' 
          }}>
            <Brain size={30} />
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Analyses & Prédictions IA</h1>
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>Optimisation du réseau via Intelligence Artificielle</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* --- COLONNE GAUCHE : INSIGHTS GÉNÉRÉS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="var(--color-accent-green)" /> Analyses Automatiques
          </h2>

          {/* Carte Anomalie */}
          <div className="card card-standard transition-smooth" style={{ borderLeft: '5px solid var(--color-danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-danger">Alerte Critique</span>
              <small style={{ color: 'var(--color-text-light)' }}>Il y a 10 min</small>
            </div>
            <h4 style={{ marginBottom: '10px' }}>Fuite suspectée - Zone A</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', marginBottom: '15px' }}>
              Le LLM a détecté un débit constant de 0.4 m³/h durant la période nocturne (02:00 - 05:00).
            </p>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }}>
              Voir les détails <ChevronRight size={16} />
            </button>
          </div>

          {/* Carte Prédiction */}
          <div className="card card-standard transition-smooth" style={{ borderLeft: '5px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge badge-primary">Prévision</span>
              <small style={{ color: 'var(--color-text-light)' }}>Demain</small>
            </div>
            <h4 style={{ marginBottom: '10px' }}>Estimation de charge</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', marginBottom: '15px' }}>
              Hausse de consommation de 8% prévue pour demain en raison des pics de température.
            </p>
            <div style={{ padding: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Conseil IA :</strong> Anticiper le remplissage du réservoir R2.
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : CHATBOT INTERACTIF --- */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden' }}>
          {/* Header Chat */}
          <div style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--color-border)', 
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ position: 'relative' }}>
              <Bot size={24} color="var(--color-primary)" />
              <div style={{ 
                position: 'absolute', bottom: -2, right: -2, 
                width: 10, height: 10, backgroundColor: 'var(--color-success)', 
                borderRadius: '50%', border: '2px solid white' 
              }}></div>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Assistant Wicmic GPT</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 'bold' }}>MODÈLE ANALYTIQUE ACTIF</p>
            </div>
          </div>

          {/* Zone Messages */}
          <div ref={scrollRef} style={{ 
            flex: 1, 
            padding: '1.5rem', 
            overflowY: 'auto', 
            backgroundColor: '#fdfdfd',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                gap: '8px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{ 
                  padding: '12px 16px', 
                  borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-dark)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                  fontSize: '0.95rem'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ color: 'var(--color-text-light)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                L'IA analyse vos données...
              </div>
            )}
          </div>

          {/* Input Chat */}
          <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                className="input"
                style={{ borderRadius: '25px', padding: '0.75rem 1.25rem' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez une question sur vos compteurs..."
              />
              <button 
                className="btn btn-primary" 
                style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}
                onClick={handleSend}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PredictionsPage;