/**
 * OrderContext
 * Location: bunk/src/context/OrderContext.jsx
 *
 * Fix: only fetches orders after bunk._id is available in AuthContext.
 * Previously it called orderService on mount before login was complete,
 * causing 404s because bunkId was missing from the URL.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuthContext } from './AuthContext';
import usePolling from '../hooks/usePolling';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { bunk, isAuthenticated } = useAuthContext(); // ← wait for bunk._id

  const [orders,        setOrders]        = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  // ── Only load when bunk is logged in ───────────────────────────────────────
  const isReady = isAuthenticated && Boolean(bunk?._id);

  const loadOrders = async (params = {}) => {
    if (!isReady) return [];
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrders(params);
      // Backend returns: { status, data: { orders, count } }
      const list = response.data?.orders || [];
      setOrders(list);
      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadPendingOrders = async () => {
    if (!isReady) return [];
    try {
      const response = await orderService.getPendingOrders();
      const list = response.data?.orders || [];
      setPendingOrders(list);
      return list;
    } catch (err) {
      console.error('Load pending orders error:', err);
    }
  };

  // ── Initial load — only when bunk session is ready ────────────────────────
  useEffect(() => {
    if (!isReady) return;
    loadOrders();
    loadPendingOrders();
  }, [isReady]); // re-runs when bunk logs in

  // ── Poll pending orders every 30s (only when logged in) ───────────────────
  usePolling(
    () => { if (isReady) loadPendingOrders(); },
    30000,
    isReady   // ← polling only active when authenticated
  );

  // ── Order actions ──────────────────────────────────────────────────────────

  const getOrderById = async (orderId) => {
    try {
      setError(null);
      const response = await orderService.getOrderById(orderId);
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const acceptOrder = async (orderId, preparationTime) => {
    try {
      setError(null);
      const response = await orderService.acceptOrder(orderId, preparationTime);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: 'accepted' } : o)
      );
      setPendingOrders(prev => prev.filter(o => o._id !== orderId));
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectOrder = async (orderId, reason) => {
    try {
      setError(null);
      const response = await orderService.rejectOrder(orderId, reason);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o)
      );
      setPendingOrders(prev => prev.filter(o => o._id !== orderId));
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const markReady = async (orderId) => {
    try {
      setError(null);
      const response = await orderService.markOrderReady(orderId);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: 'ready_for_pickup' } : o)
      );
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError(null);
      const response = await orderService.updateOrderStatus(orderId, status);
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status } : o)
      );
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTodayOrders = async () => {
    try {
      setError(null);
      const response = await orderService.getTodayOrders();
      return response.data?.orders || [];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchOrders = async (query) => {
    try {
      setError(null);
      const response = await orderService.searchOrders(query);
      return response.data?.orders || [];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getOrderStats = async (params = {}) => {
    try {
      setError(null);
      const response = await orderService.getOrderStats(params);
      return response.data?.stats;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    orders,
    pendingOrders,
    loading,
    error,
    loadOrders,
    loadPendingOrders,
    getOrderById,
    acceptOrder,
    rejectOrder,
    markReady,
    updateOrderStatus,
    getTodayOrders,
    searchOrders,
    getOrderStats,
    setOrders,
    setPendingOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within OrderProvider');
  }
  return context;
};

export default OrderContext;