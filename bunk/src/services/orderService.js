/**
 * Order Service
 * Handles all order-related API calls
 * Location: bunk/src/services/orderService.js
 *
 * Correct backend endpoints:
 *   GET    /api/v1/bunks/:bunkId/orders          → all orders for this bunk
 *   GET    /api/v1/bunks/:bunkId/orders?status=  → filtered by status
 *   GET    /api/v1/orders/:orderId               → single order details
 *   PATCH  /api/v1/orders/:orderId/status        → accept / mark ready
 *   POST   /api/v1/orders/:orderId/cancel        → reject/cancel
 */

import api from './api';

// ── Helper: get bunkId from localStorage ─────────────────────────────────────
const getBunkId = () => {
  try {
    const raw = localStorage.getItem('bunkData');
    const bunk = raw ? JSON.parse(raw) : null;
    if (!bunk?._id) throw new Error('No bunk session');
    return bunk._id;
  } catch {
    throw new Error('No bunk session found. Please log in again.');
  }
};

const orderService = {

  /**
   * Get all orders for the logged-in bunk
   * GET /api/v1/bunks/:bunkId/orders
   * Optional: pass { status: 'pending' } etc.
   */
  getOrders: async (params = {}) => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/orders`, { params });
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  /**
   * Get single order details
   * GET /api/v1/orders/:orderId
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  /**
   * Accept an order
   * PATCH /api/v1/orders/:orderId/status  { status: 'accepted', notes: '...' }
   */
  acceptOrder: async (orderId, preparationTime = 15) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: 'accepted',
        notes: `Preparation time: ${preparationTime} minutes`
      });
      return response.data;
    } catch (error) {
      console.error('Accept order error:', error);
      throw error;
    }
  },

  /**
   * Reject/cancel an order
   * POST /api/v1/orders/:orderId/cancel  { reason, cancelledBy: 'bunk' }
   */
  rejectOrder: async (orderId, reason) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, {
        reason,
        cancelledBy: 'bunk'
      });
      return response.data;
    } catch (error) {
      console.error('Reject order error:', error);
      throw error;
    }
  },

  /**
   * Mark order as ready for pickup
   * PATCH /api/v1/orders/:orderId/status  { status: 'ready_for_pickup' }
   */
  markOrderReady: async (orderId) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: 'ready_for_pickup'
      });
      return response.data;
    } catch (error) {
      console.error('Mark ready error:', error);
      throw error;
    }
  },

  /**
   * Update order status (generic)
   * PATCH /api/v1/orders/:orderId/status  { status }
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },

  /**
   * Get orders filtered by status
   * GET /api/v1/bunks/:bunkId/orders?status=pending
   */
  getOrdersByStatus: async (status, params = {}) => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/orders`, {
        params: { ...params, status }
      });
      return response.data;
    } catch (error) {
      console.error('Get orders by status error:', error);
      throw error;
    }
  },

  /**
   * Get pending orders
   * GET /api/v1/bunks/:bunkId/orders?status=pending
   */
  getPendingOrders: async () => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/orders`, {
        params: { status: 'pending' }
      });
      return response.data;
    } catch (error) {
      console.error('Get pending orders error:', error);
      throw error;
    }
  },

  /**
   * Get today's orders
   * GET /api/v1/bunks/:bunkId/orders  (filter client-side by date)
   */
  getTodayOrders: async () => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/orders`);
      const orders = response.data?.data?.orders || [];

      // Filter client-side for today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(
        (o) => new Date(o.createdAt) >= todayStart
      );

      return {
        ...response.data,
        data: { orders: todayOrders, count: todayOrders.length }
      };
    } catch (error) {
      console.error('Get today orders error:', error);
      throw error;
    }
  },

  /**
   * Get order stats for this bunk
   * GET /api/v1/bunks/:bunkId/stats
   */
  getOrderStats: async () => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw error;
    }
  },

  /**
   * Search orders (client-side filter — backend has no search endpoint)
   * Fetches all bunk orders and filters by orderNumber / customer name / phone
   */
  searchOrders: async (query) => {
    try {
      const bunkId = getBunkId();
      const response = await api.get(`/bunks/${bunkId}/orders`);
      const orders = response.data?.data?.orders || [];

      const q = query.toLowerCase();
      const filtered = orders.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q)
      );

      return {
        ...response.data,
        data: { orders: filtered, count: filtered.length }
      };
    } catch (error) {
      console.error('Search orders error:', error);
      throw error;
    }
  },
};

export default orderService;