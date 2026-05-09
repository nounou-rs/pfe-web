import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, Droplet, AlertCircle,
  Camera, Brain, FileText, ChevronRight, Settings, Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { key: 'dashboard',    text: 'dashboard',      icon: LayoutDashboard, path: '/dashboard' },
  { key: 'map',          text: 'map_title',       icon: Map,             path: '/map' },
  { key: 'meters',       text: 'meters_title',    icon: Droplet,         path: '/meters' },
  { key: 'alerts',       text: 'alerts',          icon: AlertCircle,     path: '/alerts' },
  { key: 'live_capture', text: 'live_capture',    icon: Camera,          path: '/live-capture' }, // ← espace retiré
  { key: 'predictions',  text: 'predictions',     icon: Brain,           path: '/predictions' },
  { key: 'History',      text: 'Historique',         icon: Clock,           path: '/history' },
  { key: 'reports',      text: 'reports_title',   icon: FileText,        path: '/reports' },
  { key: 'settings',     text: 'settings_title',  icon: Settings,        path: '/settings' },
];

export default function Sidebar({ isOpen = true }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [alertCount, setAlertCount] = useState(0);
  const [hoveredKey, setHoveredKey] = useState(null); // ← état hover centralisé

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/alertes/count');
        setAlertCount(response.data.count);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'alertes:", error);
      }
    };

    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 60000);
    return () => clearInterval(interval);
  }, []);

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
      zIndex: 30,
    }}>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <h2 style={{
          fontSize: '12px', fontWeight: 600, color: '#64748B',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {t('menu', 'Menu')}
        </h2>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive  = location.pathname === item.path;
            const isHovered = hoveredKey === item.key;
            const displayBadge = item.key === 'alerts' ? (alertCount > 0 ? alertCount : null) : null;

            // ← Calcul de la couleur de fond en un seul endroit, sans toucher au style dans les handlers
            let bgColor = 'transparent';
            if (isActive)        bgColor = '#DFF0F8';
            else if (isHovered)  bgColor = '#F1F5F9';

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredKey(item.key)}   // ← état React, pas e.target
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: bgColor,
                  color: isActive ? '#003D7A' : '#334155',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'none' }}>
                  {/* pointerEvents: none → les enfants ne captent pas les events souris */}
                  <Icon size={18} color={isActive ? '#0078B8' : '#94A3B8'} />
                  <span>{t(item.text)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                  {displayBadge && (
                    <span style={{
                      padding: '4px 8px', fontSize: '12px', fontWeight: 700,
                      backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '9999px',
                    }}>
                      {displayBadge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={16} color="#0078B8" />}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#64748B' }}>
        <p>{t('app_version', 'WICMIC v1.0.0')}</p>
      </div>
    </aside>
  );
}