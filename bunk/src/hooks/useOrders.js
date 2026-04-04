/**
 * useOrders Hook
 * Location: bunk/src/hooks/useOrders.js
 */

import { useState, useEffect } from 'react';
import orderService from '../services/orderService';

export const useOrders = (autoLoad = true) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (autoLoad) {
      loadOrders();
    }
  }, [autoLoad]);

  const loadOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrders(params);
      setOrders(response.data?.orders || []);
      
      return response.data?.orders;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'accepted' }
            : order
        )
      );
      
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
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'rejected' }
            : order
        )
      );
      
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
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'ready_for_pickup' }
            : order
        )
      );
      
      return response.data?.order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getPendingOrders = async () => {
    try {
      setError(null);
      const response = await orderService.getPendingOrders();
      return response.data?.orders || [];
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

  return {
    orders,
    loading,
    error,
    loadOrders,
    getOrderById,
    acceptOrder,
    rejectOrder,
    markReady,
    getPendingOrders,
    getTodayOrders,
    searchOrders,
    setOrders
  };
};

export default useOrders;