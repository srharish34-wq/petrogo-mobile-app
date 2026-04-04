/**
 * Payment Service
 * Payment-related API calls
 */

import api from './api';

export const paymentService = {
  /**
   * Get payment by order ID
   */
  getPaymentByOrder: async (orderId) => {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update payment
   */
  updatePayment: async (paymentId, data) => {
    try {
      const response = await api.patch(`/payments/${paymentId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get customer payment history
   */
  getCustomerPayments: async (phone) => {
    try {
      const response = await api.get(`/payments/customer/${phone}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create Razorpay order (for future implementation)
   */
  createRazorpayOrder: async (amount, orderId) => {
    try {
      // In production, this will call backend to create Razorpay order
      const response = await api.post('/payments/create-order', {
        amount,
        orderId,
        currency: 'INR'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify Razorpay payment (for future implementation)
   */
  verifyRazorpayPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Process cash on delivery
   */
  processCashPayment: async (orderId) => {
    try {
      const response = await api.post(`/payments/cash/${orderId}`, {
        method: 'cash',
        status: 'pending'
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: () => {
    return [
      {
        id: 'cash',
        name: 'Cash on Delivery',
        icon: '💵',
        description: 'Pay when fuel is delivered',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        description: 'Google Pay, PhonePe, Paytm',
        enabled: true
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Visa, Mastercard, Rupay',
        enabled: true
      },
      {
        id: 'online',
        name: 'Net Banking',
        icon: '🏦',
        description: 'Pay using net banking',
        enabled: true
      }
    ];
  },

  /**
   * Calculate payment breakdown
   */
  calculateBreakdown: (fuelCost, deliveryCharge, emergencyFee) => {
    const subtotal = fuelCost + deliveryCharge + emergencyFee;
    const gst = subtotal * 0.18; // 18% GST
    const platformFee = fuelCost * 0.05; // 5% platform fee
    const total = subtotal + gst;

    return {
      fuelCost: Math.round(fuelCost * 100) / 100,
      deliveryCharge: Math.round(deliveryCharge * 100) / 100,
      emergencyFee: Math.round(emergencyFee * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  },

  /**
   * Format currency
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
};