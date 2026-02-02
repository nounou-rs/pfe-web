import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AuthenticationPage from './pages/AuthenticationPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import MetersPage from './pages/MetersPage';
import MeterDetailsPage from './pages/MeterDetailsPage';
import AlertsPage from './pages/AlertsPage';
import InterventionsPage from './pages/InterventionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PredictionsPage from './pages/PredictionsPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import websocketService from './services/websocket';

const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
    error: { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

function AppContent() {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      websocketService.connect();
      return () => websocketService.disconnect();
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthenticationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/meters" element={<MetersPage />} />
              <Route path="/meters/:id" element={<MeterDetailsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/interventions" element={<InterventionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
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
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
