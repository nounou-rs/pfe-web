import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération sécurisée de l'email
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post("http://localhost:8000/verify-otp", {
        email: email,
        code: otp // Correspond au backend FastAPI
      });

      setMessage({ type: 'success', text: "Compte activé ! Redirection vers la connexion..." });
      
      setTimeout(() => {
        navigate('/auth'); // On renvoie vers la page de login
      }, 2500);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || "Code invalide ou expiré" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Alert severity="warning">Aucun email trouvé. Veuillez recommencer l'inscription.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      backgroundColor: '#F8FAFC' 
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Vérifiez votre Email
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Un code a été envoyé à : <br />
          <strong>{email}</strong>
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Code de vérification"
            variant="outlined"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' } }}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || otp.length < 6}
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {loading ? "Vérification..." : "Valider mon compte"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyOTP;