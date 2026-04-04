/**
 * Order Context
 * Global order state management
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { orderService } from '../services/orderService';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.createOrder(orderData);
      
      if (response.status === 'success') {
        const newOrder = response.data.order;
        setCurrentOrder(newOrder);
        setOrders(prev => [newOrder, ...prev]);
        setLoading(false);
        return { success: true, order: newOrder };
      }
      
      setLoading(false);
      return { success: false, error: 'Failed to create order' };
    } catch (err) {
      setError(err.message || 'Failed to create order');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch order by ID
  const fetchOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrder(orderId);
      
      if (response.status === 'success') {
        const order = response.data.order;
        setCurrentOrder(order);
        setLoading(false);
        return { success: true, order };
      }
      
      setLoading(false);
      return { success: false, error: 'Order not found' };
    } catch (err) {
      setError(err.message || 'Failed to fetch order');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch customer orders
  const fetchCustomerOrders = useCallback(async (phone) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getCustomerOrders(phone);
      
      if (response.status === 'success') {
        setOrders(response.data.orders);
        setLoading(false);
        return { success: true, orders: response.data.orders };
      }
      
      setLoading(false);
      return { success: false, error: 'Failed to fetch orders' };
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, status, notes) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.updateOrderStatus(orderId, status, notes);
      
      if (response.status === 'success') {
        const updatedOrder = response.data.order;
        
        // Update current order if it matches
        if (currentOrder?._id === orderId) {
          setCurrentOrder(updatedOrder);
        }
        
        // Update in orders list
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? updatedOrder : order
          )
        );
        
        setLoading(false);
        return { success: true, order: updatedOrder };
      }
      
      setLoading(false);
      return { success: false, error: 'Failed to update order' };
    } catch (err) {
      setError(err.message || 'Failed to update order');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [currentOrder]);

  // Cancel order
  const cancelOrder = useCallback(async (orderId, reason) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.cancelOrder(orderId, reason);
      
      if (response.status === 'success') {
        const cancelledOrder = response.data.order;
        
        // Update current order if it matches
        if (currentOrder?._id === orderId) {
          setCurrentOrder(cancelledOrder);
        }
        
        // Update in orders list
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? cancelledOrder : order
          )
        );
        
        setLoading(false);
        return { success: true, order: cancelledOrder };
      }
      
      setLoading(false);
      return { success: false, error: 'Failed to cancel order' };
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [currentOrder]);

  // Verify delivery OTP
  const verifyDeliveryOTP = useCallback(async (orderId, otp) => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.verifyDeliveryOTP(orderId, otp);
      
      if (response.status === 'success') {
        const completedOrder = response.data.order;
        
        // Update current order
        setCurrentOrder(completedOrder);
        
        // Update in orders list
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? completedOrder : order
          )
        );
        
        setLoading(false);
        return { success: true, order: completedOrder };
      }
      
      setLoading(false);
      return { success: false, error: 'Invalid OTP' };
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    currentOrder,
    orders,
    loading,
    error,
    createOrder,
    fetchOrder,
    fetchCustomerOrders,
    updateOrderStatus,
    cancelOrder,
    verifyDeliveryOTP,
    clearCurrentOrder,
    clearError
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  
  return context;
};

export default OrderContext;