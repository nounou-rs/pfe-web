import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Droplet, AlertCircle, Camera, Brain, FileText, ChevronRight } from 'lucide-react';

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { text: 'Carte', icon: Map, path: '/map' },
  { text: 'Compteurs', icon: Droplet, path: '/meters' },
  { text: 'Alertes', icon: AlertCircle, path: '/alerts', badge: 12 },
  { text: 'Live Capture', icon: Camera, path: '/Live Capture' },
  { text: 'Prédictions IA', icon: Brain, path: '/predictions' },
  { text: 'Rapports', icon: FileText, path: '/reports' },
];

export default function Sidebar({ isOpen = true }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={{
      position: 'fixed',
      left: isOpen ? 0 : '-256px',
      top: '64px',
      height: 'calc(100vh - 64px)',
      width: '256px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      transition: 'left 0.3s ease',
      zIndex: 30
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <h2 style={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>Menu</h2>
      </div>

      {/* Navigation Items */}
      <nav style={{
        flex: 1,
        padding: '12px',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.text}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isActive ? '#DFF0F8' : 'transparent',
                  color: isActive ? '#003D7A' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? '#0078B8' : '#94A3B8'} />
                  <span>{item.text}</span>
                </div>
                {item.badge && (
                  <span style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    borderRadius: '9999px'
                  }}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={16} color="#0078B8" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #E2E8F0',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <p>WICMIC v1.0.0</p>
      </div>
    </aside>
  );
}
