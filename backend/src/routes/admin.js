/**
 * Admin Routes
 * Handles admin panel endpoints
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// @route   GET /api/v1/admin/dashboard
// @desc    Get dashboard statistics
// @access  Admin
router.get('/dashboard', adminController.getDashboard);

// @route   GET /api/v1/admin/users
// @desc    Get all users with optional role filter
// @access  Admin
router.get('/users', adminController.getAllUsers);

// @route   GET /api/v1/admin/orders
// @desc    Get all orders with filters
// @access  Admin
router.get('/orders', adminController.getAllOrders);

// @route   GET /api/v1/admin/partners
// @desc    Get all delivery partners
// @access  Admin
router.get('/partners', adminController.getAllPartners);

// @route   PATCH /api/v1/admin/partners/:partnerId/kyc
// @desc    Approve/Reject partner KYC
// @access  Admin
router.patch('/partners/:partnerId/kyc', adminController.updatePartnerKYC);

// @route   GET /api/v1/admin/settings
// @desc    Get app settings
// @access  Admin
router.get('/settings', adminController.getSettings);

// @route   PATCH /api/v1/admin/settings
// @desc    Update app settings
// @access  Admin
router.patch('/settings', adminController.updateSettings);

// @route   GET /api/v1/admin/analytics
// @desc    Get analytics data
// @access  Admin
router.get('/analytics', adminController.getAnalytics);

module.exports = router;