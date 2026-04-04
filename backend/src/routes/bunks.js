/**
 * Petrol Bunk Routes
 * Handles petrol bunk endpoints
 */

const express = require('express');
const router = express.Router();
const bunkController = require('../controllers/bunkController');

// @route   POST /api/v1/bunks/create
// @desc    Create new petrol bunk
// @access  Public
router.post('/create', bunkController.createBunk);

// @route   GET /api/v1/bunks
// @desc    Get all petrol bunks
// @access  Public
router.get('/', bunkController.getAllBunks);

// @route   GET /api/v1/bunks/:bunkId
// @desc    Get bunk by ID
// @access  Public
router.get('/:bunkId', bunkController.getBunkById);

// @route   POST /api/v1/bunks/nearby
// @desc    Find nearby bunks based on location
// @access  Public
router.post('/nearby', bunkController.findNearbyBunks);

// @route   PATCH /api/v1/bunks/:bunkId
// @desc    Update bunk details
// @access  Public
router.patch('/:bunkId', bunkController.updateBunk);

// @route   PATCH /api/v1/bunks/:bunkId/fuel-prices
// @desc    Update fuel prices
// @access  Public
router.patch('/:bunkId/fuel-prices', bunkController.updateFuelPrices);

// @route   PATCH /api/v1/bunks/:bunkId/fuel-stock
// @desc    Update fuel stock
// @access  Public
router.patch('/:bunkId/fuel-stock', bunkController.updateFuelStock);

// @route   GET /api/v1/bunks/:bunkId/orders
// @desc    Get all orders for a bunk
// @access  Public
router.get('/:bunkId/orders', bunkController.getBunkOrders);

// @route   GET /api/v1/bunks/:bunkId/stats
// @desc    Get bunk statistics
// @access  Public
router.get('/:bunkId/stats', bunkController.getBunkStats);

module.exports = router;