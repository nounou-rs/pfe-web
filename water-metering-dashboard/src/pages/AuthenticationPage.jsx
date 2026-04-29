// AuthenticationPage.jsx — Version login uniquement (signup supprimé)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import "../styles/authentication.css";
import axios from "axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, IconButton
} from '@mui/material';

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [emailReset, setEmailReset] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSendCode = async () => {
    if (!emailReset) return setError("Veuillez saisir votre email");
    setForgotLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/auth/forgot-password', { email: emailReset });
      setStep(2);
      setError("");
    } catch {
      alert("Email non trouvé dans la base Wicmic");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    if (!otpCode || !newPassword) return;
    setForgotLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/auth/reset-password', {
        email: emailReset,
        code: otpCode,
        new_password: newPassword
      });
      setShowForgotModal(false);
      setShowNotification(true);
      setStep(1);
    } catch {
      alert("Code incorrect ou expiré");
    } finally {
      setForgotLoading(false);
    }
  };

  // ✅ Login uniquement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Échec de la connexion");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-wave auth-wave-1"></div>
        <div className="auth-wave auth-wave-2"></div>
        <div className="auth-wave auth-wave-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.jpg" alt="WICMIC" style={{ height: "65px", width: "auto" }} />
        </div>

        {error && (
          <div className="error-message-box" style={{
            backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px',
            borderRadius: '8px', fontSize: '13px', marginBottom: '15px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-icon" />
              <input
                type="email" name="email"
                placeholder="vous@entreprise.com"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input" required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Mot de passe</label>
              <a href="#forgot" className="forgot-password"
                onClick={(e) => { e.preventDefault(); setShowForgotModal(true); }}>
                Mot de passe oublié ?
              </a>
            </div>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password" placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input" required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Se connecter"}
          </button>
        </form>
      </div>

      {/* MODAL RÉCUPÉRATION MOT DE PASSE */}
      <Dialog open={showForgotModal} onClose={() => setShowForgotModal(false)}
        PaperProps={{ sx: { borderRadius: '20px', width: '400px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', position: 'relative' }}>
          {step === 2 && (
            <IconButton onClick={() => setStep(1)} sx={{ position: 'absolute', left: 10, top: 10 }}>
              <ArrowLeft size={20} />
            </IconButton>
          )}
          {step === 1 ? "Récupération" : "Vérification"}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
            {step === 1
              ? "Entrez votre email pour recevoir votre code Wicmic."
              : `Saisissez le code envoyé à ${emailReset}`}
          </Typography>
          {step === 1 ? (
            <TextField fullWidth label="Email" variant="outlined"
              value={emailReset} onChange={(e) => setEmailReset(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Code à 6 chiffres"
                value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                InputProps={{ startAdornment: <ShieldCheck size={18} style={{ marginRight: 10, color: '#94a3b8' }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField fullWidth label="Nouveau mot de passe"
                type={showResetPassword ? "text" : "password"}
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowResetPassword(!showResetPassword)} edge="end">
                      {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setShowForgotModal(false)} sx={{ color: '#94a3b8', textTransform: 'none' }}>
            Annuler
          </Button>
          <Button variant="contained" fullWidth
            onClick={step === 1 ? handleSendCode : handleVerifyAndReset}
            disabled={forgotLoading}
            sx={{ bgcolor: '#2563eb', borderRadius: '10px', fontWeight: 'bold', textTransform: 'none' }}>
            {forgotLoading ? <CircularProgress size={24} color="inherit" /> : (step === 1 ? "Suivant" : "Réinitialiser")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={showNotification} autoHideDuration={5000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: '12px' }}>
          Mot de passe réinitialisé avec succès !
        </Alert>
      </Snackbar>
    </div>
  );
}