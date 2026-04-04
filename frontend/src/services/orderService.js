/**
 * API Service for Orders
 */

// Base API URL - adjust if your backend is on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

export const orderService = {
  /**
   * Create a new fuel delivery order
   * @param {Object} orderData - Order details
   * @returns {Promise} Response with created order
   */
  createOrder: async (orderData) => {
    try {
      // Validate required fields
      if (!orderData.customerPhone) {
        throw new Error('Customer phone is required');
      }
      if (!orderData.fuelType) {
        throw new Error('Fuel type is required');
      }
      if (!orderData.quantity || orderData.quantity <= 0) {
        throw new Error('Valid quantity is required');
      }
      if (!orderData.deliveryLocation) {
        throw new Error('Delivery location is required');
      }

      // Format the payload according to your backend expectations
      const payload = {
        customerPhone: orderData.customerPhone,
        fuelType: orderData.fuelType,
        quantity: orderData.quantity,
        deliveryLocation: {
          type: 'Point',
          coordinates: [
            orderData.deliveryLocation.coordinates[1], // longitude
            orderData.deliveryLocation.coordinates[0]   // latitude
          ],
          address: orderData.deliveryLocation.address || '',
          landmark: orderData.deliveryLocation.landmark || ''
        },
        petrolBunkId: orderData.petrolBunkId || null,
        orderType: 'emergency',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Ensure response has expected structure
      return {
        status: data.status || 'success',
        data: data.data || data,
        message: data.message || 'Order created successfully'
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error.message || 'Failed to create order';
    }
  },

  /**
   * Get order by ID
   */
  getOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Get orders for current user
   */
  getUserOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * ✅ NEW: Get customer orders by phone number
   * @param {string} phone - Customer phone number
   * @returns {Promise} Response with orders
   */
  getCustomerOrders: async (phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/customer/${phone}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  /**
   * ✅ NEW: Verify delivery OTP
   * @param {string} orderId - Order ID
   * @param {string} otp - OTP code
   * @returns {Promise} Response
   */
  verifyDeliveryOTP: async (orderId, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ otp })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
};