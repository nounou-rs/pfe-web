import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      height: '64px'
    }}>
      <div style={{
        height: '100%',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* ================= GAUCHE ================= */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#64748B',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.jpg" alt="WICMIC" style={{ height: '50px', width: 'auto' }} />
            {/* Titre vide pour l'instant, tu peux ajouter le nom de l'app si besoin */}
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}></h1>
          </div>
        </div>
      </div>
    </header>
  );
}