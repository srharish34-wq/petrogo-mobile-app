/**
 * Payment Service
 * Payment utilities and helper functions
 * Location: partner/src/services/paymentService.js
 */

import api from './api';

export const paymentService = {
  /**
   * Get payment details for an order
   * Note: This endpoint may not exist yet in backend
   */
  getOrderPayment: async (orderId) => {
    try {
      console.log('💳 Fetching payment for order:', orderId);
      const response = await api.get(`/payments/order/${orderId}`);
      console.log('✅ Payment fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ Get order payment error:', error);
      // Return empty payment if endpoint doesn't exist
      return { status: 'success', data: { payment: null } };
    }
  },

  /**
   * Calculate payment breakdown for order
   */
  calculateOrderPaymentBreakdown: (order) => {
    const charges = order.charges || {};
    
    return {
      fuelCost: charges.fuelCost || 0,
      deliveryCharge: charges.deliveryCharge || 0,
      emergencyFee: charges.emergencyFee || 0,
      totalAmount: charges.totalAmount || 0,
      partnerEarning: (charges.deliveryCharge || 0) + (charges.emergencyFee || 0),
      bunkEarning: charges.fuelCost || 0
    };
  },

  /**
   * Get payment summary from multiple orders
   */
  getPaymentSummary: (orders = []) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const summary = {
      totalOrders: completedOrders.length,
      totalAmount: 0,
      totalEarnings: 0,
      deliveryCharges: 0,
      emergencyFees: 0,
      fuelCosts: 0
    };
    
    completedOrders.forEach(order => {
      const charges = order.charges || {};
      
      summary.totalAmount += charges.totalAmount || 0;
      summary.deliveryCharges += charges.deliveryCharge || 0;
      summary.emergencyFees += charges.emergencyFee || 0;
      summary.fuelCosts += charges.fuelCost || 0;
      summary.totalEarnings += (charges.deliveryCharge || 0) + (charges.emergencyFee || 0);
    });
    
    // Round all values
    summary.totalAmount = Math.round(summary.totalAmount);
    summary.totalEarnings = Math.round(summary.totalEarnings);
    summary.deliveryCharges = Math.round(summary.deliveryCharges);
    summary.emergencyFees = Math.round(summary.emergencyFees);
    summary.fuelCosts = Math.round(summary.fuelCosts);
    
    return summary;
  },

  /**
   * Format payment method
   */
  formatPaymentMethod: (method) => {
    const methods = {
      cash: 'Cash',
      upi: 'UPI',
      card: 'Card',
      wallet: 'Wallet',
      online: 'Online'
    };
    
    return methods[method] || method || 'Cash';
  },

  /**
   * Get payment status badge color
   */
  getPaymentStatusColor: (status) => {
    const colors = {
      completed: 'green',
      pending: 'yellow',
      failed: 'red',
      refunded: 'blue'
    };
    
    return colors[status] || 'gray';
  },

  /**
   * Format currency (INR)
   */
  formatCurrency: (amount, showSymbol = true) => {
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return showSymbol ? `₹${formatted}` : formatted;
  },

  /**
   * Validate payment amount
   */
  validatePaymentAmount: (amount, minAmount = 0, maxAmount = 100000) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return { valid: false, message: 'Invalid amount' };
    }
    
    if (amount < minAmount) {
      return { valid: false, message: `Amount too low. Minimum: ₹${minAmount}` };
    }
    
    if (amount > maxAmount) {
      return { valid: false, message: `Amount too high. Maximum: ₹${maxAmount}` };
    }
    
    return { valid: true, message: 'Valid amount' };
  },

  /**
   * Group payments by date
   */
  groupPaymentsByDate: (orders = []) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const grouped = {};
    
    completedOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN');
      const earning = (order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0);
      
      if (!grouped[date]) {
        grouped[date] = {
          date,
          orders: [],
          total: 0,
          count: 0
        };
      }
      
      grouped[date].orders.push(order);
      grouped[date].total += earning;
      grouped[date].count += 1;
    });
    
    // Convert to array and sort by date (newest first)
    return Object.values(grouped).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  },

  /**
   * Calculate transaction fee (if applicable)
   */
  calculateTransactionFee: (amount, feePercentage = 2) => {
    const fee = (amount * feePercentage) / 100;
    return {
      originalAmount: amount,
      fee: Math.round(fee),
      finalAmount: Math.round(amount - fee),
      feePercentage
    };
  },

  /**
   * Get payment statistics
   */
  getPaymentStatistics: (orders = []) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const stats = {
      totalTransactions: completedOrders.length,
      totalAmount: 0,
      averageAmount: 0,
      highestAmount: 0,
      lowestAmount: Infinity,
      paymentMethods: {
        cash: 0,
        online: 0,
        upi: 0,
        card: 0
      }
    };
    
    completedOrders.forEach(order => {
      const amount = (order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0);
      
      stats.totalAmount += amount;
      
      if (amount > stats.highestAmount) {
        stats.highestAmount = amount;
      }
      
      if (amount < stats.lowestAmount) {
        stats.lowestAmount = amount;
      }
      
      // Count payment methods (assuming default is cash)
      const method = order.paymentMethod || 'cash';
      if (stats.paymentMethods[method] !== undefined) {
        stats.paymentMethods[method] += 1;
      }
    });
    
    if (stats.totalTransactions > 0) {
      stats.averageAmount = Math.round(stats.totalAmount / stats.totalTransactions);
    }
    
    if (stats.lowestAmount === Infinity) {
      stats.lowestAmount = 0;
    }
    
    stats.totalAmount = Math.round(stats.totalAmount);
    stats.highestAmount = Math.round(stats.highestAmount);
    stats.lowestAmount = Math.round(stats.lowestAmount);
    
    return stats;
  }
};

export default paymentService;