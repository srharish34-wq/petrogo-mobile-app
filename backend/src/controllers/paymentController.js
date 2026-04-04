/**
 * Payment Controller
 * Handles payment operations (simplified)
 */

const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Get payment details by order ID
 * GET /api/v1/payments/order/:orderId
 */
exports.getPaymentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ order: orderId })
      .populate('order', 'orderNumber charges status')
      .populate('customer', 'name phone');
    
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    console.error('Get Payment Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};
/**
 * Get all payments (Admin Dashboard)
 * GET /api/v1/payments/admin/all
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber charges status createdAt')
      .populate('customer', 'name phone');

    console.log('✅ Fetched payments:', payments.length);

    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        payments,
        count: payments.length
      }
    });

  } catch (error) {
    console.error('❌ Get All Payments Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update payment status
 * PATCH /api/v1/payments/:paymentId
 */
exports.updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, method, transactionId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    
    // Update payment
    if (status) payment.status = status;
    if (method) payment.method = method;
    if (transactionId) payment.transactionId = transactionId;
    
    if (status === 'completed') {
      payment.amount.paid = payment.amount.total;
      payment.paidAt = new Date();
    }
    
    await payment.save();
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Payment updated successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Update Payment Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get customer payment history
 * GET /api/v1/payments/customer/:phone
 */
exports.getCustomerPayments = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const User = require('../models/User');
    const customer = await User.findOne({ phone });
    
    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    const payments = await Payment.find({ customer: customer._id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber charges status createdAt');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        payments,
        count: payments.length
      }
    });
  } catch (error) {
    console.error('Get Customer Payments Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};