/**
 * Order Routes
 * Handles order-related endpoints
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ✅ NEW: Get all orders (for partner panel available orders)
// @route   GET /api/v1/orders
// @desc    Get all orders (can filter by status)
// @access  Public
router.get('/', orderController.getAllOrders);

// @route   POST /api/v1/orders/create
// @desc    Create new order
// @access  Public
router.post('/create', orderController.createOrder);

// @route   GET /api/v1/orders/customer/:phone
// @desc    Get all orders for a customer
// @access  Public
router.get('/customer/:phone', orderController.getCustomerOrders);

// @route   GET /api/v1/orders/:orderId
// @desc    Get order by ID
// @access  Public
router.get('/:orderId', orderController.getOrder);

// @route   PATCH /api/v1/orders/:orderId/status
// @desc    Update order status
// @access  Public
router.patch('/:orderId/status', orderController.updateOrderStatus);

// @route   POST /api/v1/orders/:orderId/verify-otp
// @desc    Verify delivery OTP and complete order
// @access  Public
router.post('/:orderId/verify-otp', orderController.verifyDeliveryOTP);

// @route   POST /api/v1/orders/:orderId/cancel
// @desc    Cancel order
// @access  Public
router.post('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;