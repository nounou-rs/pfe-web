import axios from 'axios';

// ─────────────────────────────────────────────
// Instance axios de base
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur requête — injecte le token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse — redirige si token expiré
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);


// ─────────────────────────────────────────────
// 1. AUTHENTIFICATION
// ─────────────────────────────────────────────
export const authAPI = {
  register:       (data)  => api.post('/register', data),
  login:          (data)  => api.post('/login', data),
  verifyOtp:      (data)  => api.post('/verify-otp', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
};


// ─────────────────────────────────────────────
// 2. TABLEAU DE BORD
// ─────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),

  // Valeurs acceptées par le backend :
  // "aujourd'hui" | "cette semaine" | "mois" | "annee"
  getConsumption: (periode = "aujourd'hui") =>
    api.get('/consommation/historique', { params: { periode } }),
};


// ─────────────────────────────────────────────
// 3. COMPTEURS
// ─────────────────────────────────────────────
export const metersAPI = {
  getAll:       (params)     => api.get('/compteurs', { params }),
  getById:      (id)         => api.get(`/compteurs/${id}`),
  getHistorique:(id)         => api.get(`/compteurs/${id}/historique`),
  create:       (data)       => api.post('/compteurs', data),
  update:       (id, data)   => api.put(`/compteurs/${id}`, data),
  delete:       (id)         => api.delete(`/compteurs/${id}`),
};


// ─────────────────────────────────────────────
// 4. RELEVÉS
// ─────────────────────────────────────────────
export const relevesAPI = {
  getAll:     ()   => api.get('/releves'),
  getRecents: ()   => api.get('/releves-recents'),
  getImage:   (id) => `${api.defaults.baseURL}/releves/${id}/image`,
};


// ─────────────────────────────────────────────
// 5. ALERTES / ANOMALIES
// ─────────────────────────────────────────────
export const alertsAPI = {
  getAll:     (params) => api.get('/alertes', { params }),
  getRecents: ()       => api.get('/alertes-recentes'),
  getCount:   ()       => api.get('/alertes/count'),
  delete:     (id)     => api.delete(`/alertes/${id}`),
};


// ─────────────────────────────────────────────
// 6. TICKETS D'INTERVENTION
// ─────────────────────────────────────────────
export const ticketsAPI = {
  getAll:   (params)   => api.get('/tickets', { params }),
  getById:  (id)       => api.get(`/tickets/${id}`),
  getStats: ()         => api.get('/tickets/stats/resume'),
  create:   (data)     => api.post('/tickets', data),
  update:   (id, data) => api.patch(`/tickets/${id}`, data),
  delete:   (id)       => api.delete(`/tickets/${id}`),
};


// ─────────────────────────────────────────────
// 7. RAPPORTS
// ─────────────────────────────────────────────
export const reportsAPI = {
  getAll:     (includeArchives = false) =>
    api.get('/rapports', { params: { include_archives: includeArchives } }),

  // type_donnees : "Consommation Globale" | "Analyse des Fuites" |
  //               "Prediction Trimestrielle" | "Alerte Critique"
  // periode      : "7 jours" | "30 jours" | "mois en cours" | "annee en cours"
  // format       : "PDF" | "Excel"
  generate:   (data)  => api.post('/rapports/generer', data),
  archive:    (id)    => api.patch(`/rapports/${id}/archiver`),
  restore:    (id)    => api.patch(`/rapports/${id}/restaurer`),
  download:   (id)    => `${api.defaults.baseURL}/rapports/download/${id}`,
};


// ─────────────────────────────────────────────
// 8. PRÉDICTIONS IA & CHATBOT
// ─────────────────────────────────────────────
export const predictionsAPI = {
  getInsights:    ()    => api.get('/predictions/insights'),
  archiveInsight: (id)  => api.patch(`/predictions/insights/${id}/archiver`),
};

export const chatAPI = {
  getHistory:   ()       => api.get('/chat/messages'),
  sendMessage:  (message)=> api.post('/chat/envoyer', { message }),
  clearHistory: ()       => api.delete('/chat/messages'),
};


// ─────────────────────────────────────────────
// 9. UTILISATEURS
// ─────────────────────────────────────────────
export const usersAPI = {
  getAll:         ()           => api.get('/utilisateurs'),
  getMe:          ()           => api.get('/users/me'),
  updateMe:       (data)       => api.put('/users/me/update', data),
  changePassword: (data)       => api.put('/users/me/change-password', data),
  updatePassword: (id, data)   => api.put(`/utilisateurs/${id}/mot-de-passe`, data),
  updateRole:     (id, data)   => api.put(`/utilisateurs/${id}/role`, data),
  delete:         (id)         => api.delete(`/utilisateurs/${id}`),
  adminCreate:    (data)       => api.post('/admin/users/create', data),
};


// ─────────────────────────────────────────────
// 10. PARAMÈTRES / SEUILS
// ─────────────────────────────────────────────
export const settingsAPI = {
  get:   ()     => api.get('/settings'),
  update:(data) => api.patch('/settings', data),
  reset: ()     => api.post('/settings/reset'),
};


// ─────────────────────────────────────────────
// 11. ADMINISTRATION
// ─────────────────────────────────────────────
export const adminAPI = {
  getStoragePath:    ()     => api.get('/admin/settings/storage-path'),
  updateStoragePath: (path) => api.put('/admin/settings/storage-path', { path }),
  forceCapture:      (counter_id) => api.post('/admin/force-capture', { counter_id }),
  updatePlanning:    (data) => api.post('/admin/update-planning-bulk', data),
  getQueueStatus:    ()     => api.get('/admin/queue/status'),
  getTraitements:    (params) => api.get('/admin/traitements', { params }),
};


// ─────────────────────────────────────────────
// 12. LIVE CAPTURE & UPLOAD
// ─────────────────────────────────────────────
export const captureAPI = {
  getCompteurs: () => api.get('/live-capture/compteurs'),

  // Envoi d'une image brute (blob/arraybuffer)
  uploadImage: (meterId, imageBlob) =>
    api.post(`/upload/${meterId}`, imageBlob, {
      headers: { 'Content-Type': 'image/jpeg' },
    }),
};


export default api;