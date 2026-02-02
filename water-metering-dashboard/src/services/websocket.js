import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    this.socket = io(process.env.REACT_APP_WS_URL, {
      auth: { token: localStorage.getItem('token') },
    });
    this.socket.on('connect', () => console.log('WS connected'));
    this.socket.on('new_alert', data => this.emit('new_alert', data));
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export default new WebSocketService();
