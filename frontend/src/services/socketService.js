import { io } from 'socket.io-client';

// ✅ MUST point to backend port 5000 explicitly
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => { this.connected = true; console.log('✅ Socket connected:', this.socket.id); });
    this.socket.on('disconnect', () => { this.connected = false; });
    this.socket.on('connect_error', (e) => { this.connected = false; console.error('Socket error:', e.message); });

    return this.socket;
  }

  disconnect() { if (this.socket) { this.socket.disconnect(); this.socket = null; this.connected = false; } }
  joinOrder(orderId) { if (this.socket) this.socket.emit('join_order', orderId); }
  leaveOrder(orderId) { if (this.socket) this.socket.emit('leave_order', orderId); }
  onOrderUpdate(cb) { if (this.socket) this.socket.on('order_update', cb); }
  onPartnerLocation(cb) { if (this.socket) this.socket.on('partner_location', cb); }
  emit(event, data) { if (this.socket) this.socket.emit(event, data); }
  on(event, cb) { if (this.socket) this.socket.on(event, cb); }
  off(event, cb) { if (this.socket) this.socket.off(event, cb); }
  isConnected() { return this.connected && this.socket?.connected; }
}

const socketService = new SocketService();
export default socketService;