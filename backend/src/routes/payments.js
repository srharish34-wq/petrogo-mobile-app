/**
 * Payment Routes
 * Handles payment-related endpoints
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// @route   GET /api/v1/payments/order/:orderId
// @desc    Get payment details by order ID
// @access  Public
router.get('/order/:orderId', paymentController.getPaymentByOrder);

// @route   PATCH /api/v1/payments/:paymentId
// @desc    Update payment status
// @access  Public
router.patch('/:paymentId', paymentController.updatePayment);

// @route   GET /api/v1/payments/customer/:phone
// @desc    Get customer payment history
// @access  Public
router.get('/customer/:phone', paymentController.getCustomerPayments);
// @route   GET /api/v1/payments/admin/all
// @desc    Get all payments with populated data (Admin)
// @access  Admin
router.get('/admin/all', paymentController.getAllPayments);

module.exports = router;
