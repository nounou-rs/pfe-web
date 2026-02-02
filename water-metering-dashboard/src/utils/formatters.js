import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatNumber = (num) => new Intl.NumberFormat('fr-FR').format(num);
export const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
export const formatConsumption = (value) => `${formatNumber(value)} m³`;
export const formatDate = (date) => format(new Date(date), 'dd/MM/yyyy', { locale: fr });
export const formatDateTime = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
export const formatTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
export const getSeverityColor = (s) => s >= 8 ? 'error' : s >= 5 ? 'warning' : 'info';
export const getStatusColor = (status) => ({ active: 'success', offline: 'error' }[status] || 'default');
export const getStatusLabel = (status) => ({ active: 'Actif', offline: 'Hors ligne' }[status] || status);
