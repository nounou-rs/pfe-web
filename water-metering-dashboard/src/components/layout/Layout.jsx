import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Content */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginLeft: sidebarOpen ? '256px' : '0',
          padding: '2rem',
          transition: 'margin-left 0.3s ease'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
