import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import AuthenticationPage from './pages/AuthenticationPage';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import MetersPage from './pages/MetersPage';
import MeterDetailsPage from './pages/MeterDetailsPage';
import AlertsPage from './pages/AlertsPage';
import LiveCapturePage from './pages/LiveCapturePage';
import PredictionsPage from './pages/PredictionsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import websocketService from './services/websocket';

const theme = createTheme({
  palette: {
    primary: { main: '#0078B8' }, // Bleu WICMIC
    secondary: { main: '#8b5cf6' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
    background: { default: '#F8FAFC' }
  },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
  }
});

// Composant pour protéger les routes privées
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  
  // Si pas d'utilisateur, on redirige vers la page d'auth
  return user ? children : <Navigate to="/auth" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      websocketService.connect();
      return () => websocketService.disconnect();
    }
  }, [user]);

  return (
    <Routes>
      {/* Route Publique : Authentification */}
      <Route path="/auth" element={
        !user ? <AuthenticationPage /> : <Navigate to="/dashboard" replace />
      } />

      {/* Redirections pour compatibilité */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />

      {/* Routes Privées (Protégées) */}
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/meters" element={<MetersPage />} />
              <Route path="/meters/:id" element={<MeterDetailsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/Live Capture" element={<LiveCapturePage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}