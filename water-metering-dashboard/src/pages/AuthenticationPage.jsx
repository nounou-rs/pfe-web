import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Chrome, MessageSquare, AlertCircle } from "lucide-react";
import "../styles/authentication.css";

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // État pour gérer les erreurs

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        // Logique d'inscription (À implémenter plus tard)
        // Pour l'instant, on redirige vers le login
        setIsSignup(false);
        setError("Compte créé avec succès ! Connectez-vous.");
      } else {
        // Logique de connexion
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          navigate("/dashboard");
        } else {
          setError(result.error || "Échec de la connexion");
        }
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue");
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
            <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#991b1b', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '13px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Nom complet</label>
              <div className="form-input-wrapper">
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  required={isSignup}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="vous@entreprise.com"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              {!isSignup && (
                <a href="#forgot" className="forgot-password">Mot de passe oublié?</a>
              )}
            </div>
            <div className="form-input-wrapper">
              <Lock size={18} className="form-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? "Chargement..." : (isSignup ? "Créer un compte" : "Se connecter")}
          </button>
        </form>

        <div className="form-divider">
          <span>OU</span>
        </div>

        <div className="social-buttons-stack">
          <button className="btn btn-social-full">
            <Chrome size={18} />
            <span>Continuer avec Google</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {isSignup ? "Vous avez déjà un compte? " : "Vous n'avez pas de compte? "}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="auth-toggle-link"
            >
              {isSignup ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}