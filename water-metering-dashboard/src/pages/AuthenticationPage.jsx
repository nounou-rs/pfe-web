import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Chrome, MessageSquare } from "lucide-react";
import "../styles/authentication.css";

export default function AuthCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isSignup) {
        // Pour le signup, rediriger vers la page login
        navigate("/login");
      } else {
        // Pour le login, authentifier et aller au dashboard
        if (formData.email) {
          login(formData.email);
          navigate("/dashboard");
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      {/* Background Pattern */}
      <div className="auth-background">
        <div className="auth-wave auth-wave-1"></div>
        <div className="auth-wave auth-wave-2"></div>
        <div className="auth-wave auth-wave-3"></div>
      </div>

      {/* Auth Card */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo.jpg" alt="WICMIC" style={{ height: "48px", width: "auto" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name Field */}
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Nom complet
              </label>
              <div className="form-input-wrapper">
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adresse email
            </label>
            <div className="form-input-wrapper">
              <Mail size={18} className="form-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="vous@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              {!isSignup && (
                <a href="#forgot" className="forgot-password">
                  Mot de passe oublié?
                </a>
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

          {/* Terms Checkbox */}
          {isSignup && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  Je suis d'accord avec les{" "}
                  <a href="#terms" className="terms-link">
                    Conditions & Confidentialité
                  </a>
                </span>
              </label>
            </div>
          )}

          {/* CTA Button */}
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? (isSignup ? "Création en cours..." : "Connexion en cours...") : (isSignup ? "Créer un compte" : "Se connecter")}
          </button>
        </form>

        {/* Divider */}
        <div className="form-divider">
          <span>OU</span>
        </div>

        {/* Social Buttons */}
        <div className="social-buttons-stack">
          <button className="btn btn-social-full">
            <Chrome size={18} />
            <span>Continuer avec Google</span>
          </button>
          <button className="btn btn-social-full">
            <MessageSquare size={18} />
            <span>Continuer avec Microsoft</span>
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            {isSignup ? "Vous avez déjà un compte? " : "Vous n'avez pas de compte? "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
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
