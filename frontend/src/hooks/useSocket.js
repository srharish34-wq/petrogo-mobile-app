/**
 * useSocket Hook
 * Socket.io real-time connection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function useSocket(orderId = null, options = {}) {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000
  } = options;

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [orderUpdates, setOrderUpdates] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect) return;

    // Create socket instance
    const socketInstance = io(SOCKET_URL, {
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection events
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError(err.message);
      setConnected(false);
    });

    // Join order room if orderId provided
    if (orderId) {
      socketInstance.emit('join_order', orderId);
      console.log(`📍 Joined order room: ${orderId}`);
    }

    // Cleanup
    return () => {
      if (orderId) {
        socketInstance.emit('leave_order', orderId);
      }
      socketInstance.disconnect();
    };
  }, [autoConnect, reconnection, reconnectionAttempts, reconnectionDelay, orderId]);

  // Listen for order updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = (data) => {
      console.log('📦 Order update received:', data);
      setOrderUpdates(data);
    };

    socket.on('order_update', handleOrderUpdate);

    return () => {
      socket.off('order_update', handleOrderUpdate);
    };
  }, [socket]);

  // Listen for partner location updates
  useEffect(() => {
    if (!socket) return;

    const handlePartnerLocation = (data) => {
      console.log('📍 Partner location update:', data);
      setPartnerLocation(data.location);
    };

    socket.on('partner_location', handlePartnerLocation);

    return () => {
      socket.off('partner_location', handlePartnerLocation);
    };
  }, [socket]);

  // Emit partner location update
  const updatePartnerLocation = useCallback((location) => {
    if (!socket || !orderId) return;

    socket.emit('partner_location_update', {
      orderId,
      location
    });
  }, [socket, orderId]);

  // Join specific order room
  const joinOrder = useCallback((orderIdToJoin) => {
    if (!socket) return;

    socket.emit('join_order', orderIdToJoin);
    console.log(`📍 Joined order room: ${orderIdToJoin}`);
  }, [socket]);

  // Leave order room
  const leaveOrder = useCallback((orderIdToLeave) => {
    if (!socket) return;

    socket.emit('leave_order', orderIdToLeave);
    console.log(`👋 Left order room: ${orderIdToLeave}`);
  }, [socket]);

  // Emit custom event
  const emit = useCallback((event, data) => {
    if (!socket) return;
    socket.emit(event, data);
  }, [socket]);

  // Listen for custom event
  const on = useCallback((event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
  }, [socket]);

  // Remove event listener
  const off = useCallback((event, callback) => {
    if (!socket) return;
    socket.off(event, callback);
  }, [socket]);

  // Manual connect
  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  // Manual disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket,
    connected,
    error,
    orderUpdates,
    partnerLocation,
    updatePartnerLocation,
    joinOrder,
    leaveOrder,
    emit,
    on,
    off,
    connect,
    disconnect
  };
}