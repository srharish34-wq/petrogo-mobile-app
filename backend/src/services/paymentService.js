/**
 * Payment Service
 * Handles payment processing (simplified for now)
 */

const Payment = require('../models/Payment');
const Order = require('../models/Order');

/**
 * Create payment record
 * @param {Object} orderData - Order details
 * @returns {Object} Payment record
 */
const createPayment = async (orderData) => {
  try {
    const payment = await Payment.create({
      order: orderData.orderId,
      customer: orderData.customerId,
      amount: {
        total: orderData.totalAmount,
        paid: 0
      },
      method: orderData.method || 'cash',
      status: 'pending'
    });
    
    console.log('💳 Payment record created:', payment._id);
    return payment;
  } catch (error) {
    console.error('Create Payment Error:', error);
    throw error;
  }
};

/**
 * Process cash payment
 * @param {string} paymentId - Payment ID
 * @returns {Object} Updated payment
 */
const processCashPayment = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Mark as completed
    payment.status = 'completed';
    payment.amount.paid = payment.amount.total;
    payment.paidAt = new Date();
    payment.transactionId = `CASH_${Date.now()}`;
    
    await payment.save();
    
    console.log('💵 Cash payment processed:', payment._id);
    return payment;
  } catch (error) {
    console.error('Process Cash Payment Error:', error);
    throw error;
  }
};

/**
 * Process online payment (Mock Razorpay)
 * @param {Object} paymentData - Payment details
 * @returns {Object} Payment result
 */
const processOnlinePayment = async (paymentData) => {
  try {
    const { paymentId, orderId, amount, method } = paymentData;
    
    // In production, integrate with Razorpay
    // const razorpayOrder = await razorpay.orders.create({...})
    
    // Mock payment processing
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update payment
    payment.status = 'completed';
    payment.amount.paid = amount;
    payment.method = method;
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    
    await payment.save();
    
    console.log('💳 Online payment processed:', transactionId);
    
    return {
      success: true,
      transactionId,
      payment
    };
  } catch (error) {
    console.error('Process Online Payment Error:', error);
    
    // Mark payment as failed
    if (paymentData.paymentId) {
      await Payment.findByIdAndUpdate(paymentData.paymentId, {
        status: 'failed',
        notes: error.message
      });
    }
    
    throw error;
  }
};

/**
 * Verify payment status
 * @param {string} paymentId - Payment ID
 * @returns {Object} Payment status
 */
const verifyPayment = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId)
      .populate('order', 'orderNumber status')
      .populate('customer', 'name phone');
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    return {
      success: true,
      payment,
      isPaid: payment.status === 'completed'
    };
  } catch (error) {
    console.error('Verify Payment Error:', error);
    throw error;
  }
};

/**
 * Process refund
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Refund reason
 * @returns {Object} Refund result
 */
const processRefund = async (paymentId, reason) => {
  try {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.status !== 'completed') {
      throw new Error('Can only refund completed payments');
    }
    
    // Mock refund processing
    const refundId = `REFUND_${Date.now()}`;
    
    payment.status = 'refunded';
    payment.notes = `Refund processed: ${reason}`;
    
    await payment.save();
    
    console.log('💰 Refund processed:', refundId);
    
    return {
      success: true,
      refundId,
      amount: payment.amount.paid,
      payment
    };
  } catch (error) {
    console.error('Process Refund Error:', error);
    throw error;
  }
};

/**
 * Calculate payment breakdown
 * @param {Object} orderData - Order data
 * @returns {Object} Payment breakdown
 */
const calculatePaymentBreakdown = (orderData) => {
  const { fuelCost, deliveryCharge, emergencyFee } = orderData;
  
  const subtotal = fuelCost + deliveryCharge + emergencyFee;
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;
  
  return {
    fuelCost: Math.round(fuelCost * 100) / 100,
    deliveryCharge: Math.round(deliveryCharge * 100) / 100,
    emergencyFee: Math.round(emergencyFee * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

/**
 * Get payment methods available
 * @returns {Array} Available payment methods
 */
const getPaymentMethods = () => {
  return [
    {
      id: 'cash',
      name: 'Cash on Delivery',
      description: 'Pay when fuel is delivered',
      icon: '💵',
      enabled: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps',
      icon: '📱',
      enabled: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay using cards',
      icon: '💳',
      enabled: true
    },
    {
      id: 'online',
      name: 'Net Banking',
      description: 'Pay using net banking',
      icon: '🏦',
      enabled: true
    }
  ];
};

module.exports = {
  createPayment,
  processCashPayment,
  processOnlinePayment,
  verifyPayment,
  processRefund,
  calculatePaymentBreakdown,
  getPaymentMethods
};