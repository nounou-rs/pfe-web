import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MetersProvider } from './context/MetersContext';
import Layout from './components/layout/Layout';

// Pages
import AuthenticationPage  from './pages/AuthenticationPage';
import Dashboard           from './pages/Dashboard';
import MapPage             from './pages/MapPage';
import MetersPage          from './pages/MetersPage';
import MeterDetailsPage    from './pages/MeterDetailsPage';
import AlertsPage          from './pages/AlertsPage';
import LiveCapturePage     from './pages/LiveCapturePage';
import PredictionsPage     from './pages/PredictionsPage';
import ReportsPage         from './pages/ReportsPage';
import UsersPage           from './pages/UsersPage';
import SettingsPage        from './pages/SettingsPage';
import VerifyOTP           from './pages/VerifyOtpPage';
import HistoryPage         from './pages/HistoryPage';

// ─── Thème global ────────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary:    { main: '#0078B8' },
    secondary:  { main: '#8b5cf6' },
    background: { default: '#F8FAFC' },
  },
  typography: { fontFamily: '"Inter", "system-ui", sans-serif' },
});

// ─── Protection des routes privées ───────────────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;
  return user ? children : <Navigate to="/auth" replace />;
};

// ─── Routes de l'application ─────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/auth"
        element={!user ? <AuthenticationPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login"      element={<Navigate to="/auth" replace />} />

      {/* Routes privées */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/"             element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/map"          element={<MapPage />} />
                <Route path="/meters"       element={<MetersPage />} />
                <Route path="/meters/:id"   element={<MeterDetailsPage />} />
                <Route path="/alerts"       element={<AlertsPage />} />
                <Route path="/live-capture" element={<LiveCapturePage />} />
                <Route path="/predictions"  element={<PredictionsPage />} />
                <Route path="/history"      element={<HistoryPage />} />
                <Route path="/reports"      element={<ReportsPage />} />
                <Route path="/users"        element={<UsersPage />} />
                <Route path="/settings"     element={<SettingsPage />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

// ─── Composant racine ─────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MetersProvider>
          <Router>
            <AppRoutes />
          </Router>
        </MetersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}