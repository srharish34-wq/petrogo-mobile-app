/**
 * useOrders Hook
 * Order management and operations
 * Location: partner/src/hooks/useOrders.js
 */

import { useState, useCallback, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { partnerService } from '../services/partnerService';

export const useOrders = (partnerId, options = {}) => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [orders, setOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch available orders (pending/confirmed)
   */
  const fetchAvailableOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getAvailableOrders();

      if (response.status === 'success') {
        const orders = response.data?.orders || [];
        setAvailableOrders(orders);
        
        console.log('✅ Available orders fetched:', orders.length);
        return { success: true, data: orders };
      }
    } catch (err) {
      console.error('❌ Fetch available orders error:', err);
      setError(err.message || 'Failed to fetch available orders');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch partner's orders
   */
  const fetchPartnerOrders = useCallback(async (filters = {}) => {
    if (!partnerId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await partnerService.getPartnerOrders(partnerId, filters);

      if (response.status === 'success') {
        const fetchedOrders = response.data?.orders || [];
        setOrders(fetchedOrders);

        // Categorize orders
        const active = fetchedOrders.filter(o => 
          ['partner_assigned', 'picked_up', 'in_transit'].includes(o.status)
        );
        const completed = fetchedOrders.filter(o => 
          ['delivered', 'completed'].includes(o.status)
        );

        setActiveOrders(active);
        setCompletedOrders(completed);

        console.log('✅ Partner orders fetched:', fetchedOrders.length);
        return { success: true, data: fetchedOrders };
      }
    } catch (err) {
      console.error('❌ Fetch partner orders error:', err);
      setError(err.message || 'Failed to fetch orders');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  /**
   * Accept an order
   */
  const acceptOrder = useCallback(async (orderId) => {
    if (!partnerId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await partnerService.assignOrder(partnerId, orderId);

      if (response.status === 'success') {
        // Remove from available orders
        setAvailableOrders(prev => prev.filter(o => o._id !== orderId));

        // Refresh partner orders
        await fetchPartnerOrders();

        console.log('✅ Order accepted:', orderId);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('❌ Accept order error:', err);
      setError(err.message || 'Failed to accept order');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [partnerId, fetchPartnerOrders]);

  /**
   * Reject/Cancel an order
   */
  const rejectOrder = useCallback(async (orderId, reason = '', cancelledBy = 'partner') => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.cancelOrder(orderId, { reason, cancelledBy });

      if (response.status === 'success') {
        // Remove from available orders
        setAvailableOrders(prev => prev.filter(o => o._id !== orderId));

        console.log('✅ Order rejected:', orderId);
        return { success: true };
      }
    } catch (err) {
      console.error('❌ Reject order error:', err);
      setError(err.message || 'Failed to reject order');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (orderId, status, notes = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.updateOrderStatus(orderId, status, notes);

      if (response.status === 'success') {
        // Update local state
        setOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, status } : o
        ));

        console.log('✅ Order status updated:', orderId, status);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('❌ Update order status error:', err);
      setError(err.message || 'Failed to update order status');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Start delivery
   */
  const startDelivery = useCallback(async (orderId) => {
    return await updateOrderStatus(orderId, 'in_transit', 'Delivery started');
  }, [updateOrderStatus]);

  /**
   * Mark order as picked up
   */
  const markPickedUp = useCallback(async (orderId) => {
    return await updateOrderStatus(orderId, 'picked_up', 'Fuel picked up from bunk');
  }, [updateOrderStatus]);

  /**
   * Complete delivery with OTP
   */
  const completeDelivery = useCallback(async (orderId, otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.verifyDeliveryOTP(orderId, otp);

      if (response.status === 'success') {
        // Update local state
        setOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, status: 'completed' } : o
        ));

        // Refresh orders
        await fetchPartnerOrders();

        console.log('✅ Delivery completed:', orderId);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('❌ Complete delivery error:', err);
      setError(err.message || 'Invalid OTP or failed to complete delivery');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchPartnerOrders]);

  /**
   * Get order by ID
   */
  const getOrderById = useCallback((orderId) => {
    return orders.find(o => o._id === orderId) || null;
  }, [orders]);

  /**
   * Get orders by status
   */
  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      available: availableOrders.length,
      active: activeOrders.length,
      completed: completedOrders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  }, [orders, availableOrders, activeOrders, completedOrders]);

  /**
   * Calculate total earnings from orders
   */
  const calculateEarnings = useCallback((ordersList = orders) => {
    return ordersList
      .filter(o => o.status === 'completed')
      .reduce((total, order) => {
        const deliveryCharge = order.charges?.deliveryCharge || 0;
        const emergencyFee = order.charges?.emergencyFee || 0;
        return total + deliveryCharge + emergencyFee;
      }, 0);
  }, [orders]);

  /**
   * Refresh all orders
   */
  const refreshOrders = useCallback(async () => {
    await Promise.all([
      fetchAvailableOrders(),
      fetchPartnerOrders()
    ]);
  }, [fetchAvailableOrders, fetchPartnerOrders]);

  // Auto-refresh orders if enabled
  useEffect(() => {
    if (autoRefresh && partnerId) {
      const interval = setInterval(() => {
        refreshOrders();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, partnerId, refreshOrders]);

  // Initial fetch on mount
  useEffect(() => {
    if (partnerId) {
      fetchPartnerOrders();
    }
  }, [partnerId, fetchPartnerOrders]);

  return {
    // State
    orders,
    availableOrders,
    activeOrders,
    completedOrders,
    loading,
    error,
    
    // Actions
    fetchAvailableOrders,
    fetchPartnerOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    startDelivery,
    markPickedUp,
    completeDelivery,
    refreshOrders,
    
    // Utilities
    getOrderById,
    getOrdersByStatus,
    getOrderStats,
    calculateEarnings
  };
};