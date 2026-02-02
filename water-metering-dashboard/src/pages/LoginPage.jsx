import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler l'authentification
    setTimeout(() => {
      if (email) {
        login(email);
        navigate("/dashboard");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F8FAFC",
      overflow: "hidden",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      
      {/* 1. Décoration : Cercle de lumière bleu (Glow) */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: "rgba(0, 120, 184, 0.08)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none"
      }}></div>
      
      {/* 2. Pattern de grille technologique */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(45deg, transparent 25%, rgba(0, 120, 184, 0.02) 25%, rgba(0, 120, 184, 0.02) 50%, transparent 50%, transparent 75%, rgba(0, 120, 184, 0.02) 75%)",
        backgroundSize: "40px 40px",
        opacity: 0.5,
        pointerEvents: "none"
      }}></div>

      {/* 3. Carte de Login */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        padding: "32px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        margin: "20px"
      }}>
        
        {/* Logo */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px"
        }}>
          <img src="/logo.jpg" alt="Logo WICMIC" style={{ height: "48px", width: "auto" }} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#003D7A",
          textAlign: "center",
          margin: "0 0 8px 0"
        }}>Bienvenue</h2>
        
        <p style={{
          color: "#6B7280",
          textAlign: "center",
          marginBottom: "32px",
          fontSize: "13px"
        }}>Connectez-vous à la plateforme WICMIC</p>

        {/* Form */}
        <form style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }} onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div>
            <label style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 600,
              color: "#1F2937",
              marginBottom: "6px"
            }}>Email</label>
            <input 
              type="email" 
              placeholder="nom@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#1F2937",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0078B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 120, 184, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "rgba(0, 120, 184, 0.6)" : "linear-gradient(135deg, #0078B8 0%, #003D7A 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "13px",
              borderRadius: "10px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(0, 120, 184, 0.3)",
              transition: "all 0.3s ease",
              marginTop: "8px"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.boxShadow = "0 6px 20px rgba(0, 120, 184, 0.4)";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.boxShadow = "0 4px 15px rgba(0, 120, 184, 0.3)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>

      {/* 4. Effet de vague en bas (SVG) */}
      <div style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        lineHeight: 0
      }}>
        <svg viewBox="0 0 1440 320" style={{
          width: "100%",
          height: "auto",
          opacity: 0.15
        }}>
          <path fill="#0078B8" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}
