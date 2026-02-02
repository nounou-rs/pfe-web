import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getConsumption: (period) => api.get(`/dashboard/consumption?period=${period}`),
};

export const metersAPI = {
  getAll: (params) => api.get('/meters', { params }),
  getById: (id) => api.get(`/meters/${id}`),
  create: (data) => api.post('/meters', data),
  update: (id, data) => api.put(`/meters/${id}`, data),
  delete: (id) => api.delete(`/meters/${id}`),
};

export const alertsAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  resolve: (id, data) => api.post(`/alerts/${id}/resolve`, data),
};

export const interventionsAPI = {
  getAll: (params) => api.get('/interventions', { params }),
  create: (data) => api.post('/interventions', data),
};

export default api;
