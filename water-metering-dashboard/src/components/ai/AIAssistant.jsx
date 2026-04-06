import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Bonjour ! Je suis l\'assistant Wicmic. Comment puis-je vous aider avec vos données de consommation aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Ajouter le message de l'utilisateur
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulation de la réponse du LLM (à connecter plus tard à FastAPI)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "J'analyse les données du secteur A... Il semble y avoir une consommation stable. Souhaitez-vous que je génère un rapport détaillé ?" 
      }]);
    }, 1000);
  };

  return (
    <div className="card card-standard" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      {/* Header du Chat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '15px' }}>
        <div style={{ backgroundColor: 'var(--color-primary)', padding: '8px', borderRadius: '50%', color: 'white' }}>
          <Bot size={20} />
        </div>
        <div>
          <h4 style={{ margin: 0 }}>Wicmic GPT</h4>
          <span style={{ fontSize: '12px', color: 'var(--color-success)' }}>● IA en ligne</span>
        </div>
      </div>

      {/* Zone des messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '12px 16px',
            borderRadius: '15px',
            backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg)',
            color: msg.role === 'user' ? 'white' : 'var(--color-text-dark)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'inherit' }}>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input de saisie */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '15px', borderTop: '1px solid var(--color-border)' }}>
        <input 
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Posez une question sur le réseau..."
        />
        <button className="btn btn-primary" onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;