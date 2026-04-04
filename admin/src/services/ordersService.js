/**
 * Orders Service
 * Specialized service for all order-related API calls
 * Location: admin/src/services/ordersService.js
 */

import api from './api';

/**
 * GET ORDERS
 */
export const getOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/admin/orders?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

export const getOrdersByStatus = async (status, page = 1, limit = 10) => {
  try {
    const response = await getOrders(page, limit, { status });
    return response;
  } catch (error) {
    console.error(`Error fetching ${status} orders:`, error);
    throw error;
  }
};

export const getRecentOrders = async (limit = 10, days = 7) => {
  try {
    const response = await api.get(`/admin/orders/recent?limit=${limit}&days=${days}`);
    return response;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * CREATE ORDERS
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/admin/orders', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * UPDATE ORDERS
 */
export const updateOrder = async (orderId, data) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, data);
    return response;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, reason = '') => {
  try {
    const response = await api.patch(`/admin/orders/${orderId}/status`, {
      status,
      reason,
      updatedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

export const assignPartnerToOrder = async (orderId, partnerId) => {
  try {
    const response = await api.patch(`/admin/orders/${orderId}/assign-partner`, {
      partnerId,
      assignedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error assigning partner to order ${orderId}:`, error);
    throw error;
  }
};

export const cancelOrder = async (orderId, reason = '') => {
  try {
    const response = await api.patch(`/admin/orders/${orderId}/cancel`, {
      reason,
      cancelledAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};

/**
 * DELETE ORDERS
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};

/**
 * ORDER ANALYTICS
 */
export const getOrderStats = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/orders/stats?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};

export const getOrderTrends = async (days = 30) => {
  try {
    const response = await api.get(`/admin/orders/trends?days=${days}`);
    return response;
  } catch (error) {
    console.error('Error fetching order trends:', error);
    throw error;
  }
};

export const getOrdersByLocation = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/orders/by-location?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching orders by location:', error);
    throw error;
  }
};

export const getOrdersByFuelType = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/orders/by-fuel-type?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching orders by fuel type:', error);
    throw error;
  }
};

/**
 * ORDER TRACKING
 */
export const trackOrder = async (orderId) => {
  try {
    const response = await api.get(`/admin/orders/${orderId}/track`);
    return response;
  } catch (error) {
    console.error(`Error tracking order ${orderId}:`, error);
    throw error;
  }
};

export const getOrderTimeline = async (orderId) => {
  try {
    const response = await api.get(`/admin/orders/${orderId}/timeline`);
    return response;
  } catch (error) {
    console.error(`Error fetching order ${orderId} timeline:`, error);
    throw error;
  }
};

/**
 * ORDER VALIDATION
 */
export const validateOrderData = async (orderData) => {
  try {
    const response = await api.post('/admin/orders/validate', orderData);
    return response;
  } catch (error) {
    console.error('Error validating order data:', error);
    throw error;
  }
};

/**
 * ORDER EXPORT
 */
export const exportOrders = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const link = document.createElement('a');
    link.href = `${api.defaults.baseURL}/admin/exports/orders?${params}`;
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw error;
  }
};

/**
 * BULK OPERATIONS
 */
export const bulkUpdateOrderStatus = async (orderIds, status) => {
  try {
    const response = await api.patch('/admin/orders/bulk/status', {
      orderIds,
      status
    });
    return response;
  } catch (error) {
    console.error('Error bulk updating orders:', error);
    throw error;
  }
};

export const bulkDeleteOrders = async (orderIds) => {
  try {
    const response = await api.post('/admin/orders/bulk/delete', {
      orderIds
    });
    return response;
  } catch (error) {
    console.error('Error bulk deleting orders:', error);
    throw error;
  }
};

/**
 * Export all functions
 */
export default {
  // Get
  getOrders,
  getOrderById,
  getOrdersByStatus,
  getRecentOrders,

  // Create
  createOrder,

  // Update
  updateOrder,
  updateOrderStatus,
  assignPartnerToOrder,
  cancelOrder,

  // Delete
  deleteOrder,

  // Analytics
  getOrderStats,
  getOrderTrends,
  getOrdersByLocation,
  getOrdersByFuelType,

  // Tracking
  trackOrder,
  getOrderTimeline,

  // Validation
  validateOrderData,

  // Export
  exportOrders,

  // Bulk
  bulkUpdateOrderStatus,
  bulkDeleteOrders
};