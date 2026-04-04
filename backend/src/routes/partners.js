/**
 * Delivery Partner Routes
 * Handles delivery partner endpoints
 */

const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

// @route   POST /api/v1/partners/register
// @desc    Register new delivery partner
// @access  Public
router.post('/register', partnerController.registerPartner);

// @route   GET /api/v1/partners/phone/:phone
// @desc    Get partner by phone number
// @access  Public
router.get('/phone/:phone', partnerController.getPartnerByPhone);

// @route   PATCH /api/v1/partners/:partnerId/availability
// @desc    Update partner availability status
// @access  Public
router.patch('/:partnerId/availability', partnerController.updateAvailability);

// @route   PATCH /api/v1/partners/:partnerId/location
// @desc    Update partner current location
// @access  Public
router.patch('/:partnerId/location', partnerController.updateLocation);

// @route   GET /api/v1/partners/:partnerId/orders
// @desc    Get all orders for a partner
// @access  Public
router.get('/:partnerId/orders', partnerController.getPartnerOrders);

// @route   POST /api/v1/partners/:partnerId/assign-order
// @desc    Assign order to partner
// @access  Public
router.post('/:partnerId/assign-order', partnerController.assignOrder);

// @route   GET /api/v1/partners/:partnerId/earnings
// @desc    Get partner earnings
// @access  Public
router.get('/:partnerId/earnings', partnerController.getEarnings);

// @route   POST /api/v1/partners/nearby
// @desc    Find available partners near location
// @access  Public
router.post('/nearby', partnerController.findNearbyPartners);

module.exports = router;