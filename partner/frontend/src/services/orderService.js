/**
 * Order Service  
 * API service for order operations (Customer Backend)
 * Location: partner/src/services/orderService.js
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const orderService = {
  
  /**
   * Get all pending orders (available for partners)
   * These are orders with status='pending' and no deliveryPartner assigned
   */
  async getAvailableOrders(params = {}) {
    try {
      // Get all orders with status=pending
      const response = await axios.get(`${API_URL}/orders`, {
        params: {
          status: 'pending',
          ...params
        }
      });
      
      // Filter orders that don't have a deliveryPartner
      const availableOrders = response.data.data?.orders?.filter(
        order => !order.deliveryPartner
      ) || [];
      
      return {
        ...response.data,
        data: {
          orders: availableOrders,
          count: availableOrders.length
        }
      };
    } catch (error) {
      console.error('❌ Error fetching available orders:', error);
      throw error.response?.data || { message: 'Failed to fetch available orders' };
    }
  },

  /**
   * Get partner's assigned orders
   * Uses: GET /api/v1/partners/:partnerId/orders
   */
  async getPartnerOrders(partnerId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/partners/${partnerId}/orders`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching partner orders:', error);
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  /**
   * Get order by ID
   * Uses: GET /api/v1/orders/:orderId
   */
  async getOrderById(orderId) {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  /**
   * Accept/Assign order to partner
   * Uses: POST /api/v1/partners/:partnerId/assign-order
   */
  async acceptOrder(orderId, partnerId) {
    try {
      const response = await axios.post(`${API_URL}/partners/${partnerId}/assign-order`, {
        orderId
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error accepting order:', error);
      throw error.response?.data || { message: 'Failed to accept order' };
    }
  },

  /**
   * Decline/Reject order (just log it, no API needed)
   */
  async rejectOrder(orderId, partnerId, reason) {
    console.log(`Partner ${partnerId} rejected order ${orderId}. Reason: ${reason}`);
    return {
      status: 'success',
      message: 'Order rejected'
    };
  },

  /**
   * Update order status
   * Uses: PATCH /api/v1/orders/:orderId/status
   */
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  /**
   * Start delivery (picked up fuel)
   */
  async startDelivery(orderId) {
    return this.updateOrderStatus(orderId, 'picked_up', 'Partner picked up fuel');
  },

  /**
   * Complete delivery with OTP verification
   * Uses: POST /api/v1/orders/:orderId/verify-otp
   */
  async completeDelivery(orderId, otp, notes = '') {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/verify-otp`, {
        otp
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error completing delivery:', error);
      throw error.response?.data || { message: 'Failed to complete delivery' };
    }
  }
};