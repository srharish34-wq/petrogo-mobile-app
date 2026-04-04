/**
 * Authentication Routes
 * Handles user authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/v1/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', authController.sendOTP);

// @route   POST /api/v1/auth/verify-otp
// @desc    Verify OTP and login/signup
// @access  Public
router.post('/verify-otp', authController.verifyOTP);

// @route   GET /api/v1/auth/profile/:phone
// @desc    Get user profile by phone
// @access  Public
router.get('/profile/:phone', authController.getProfile);

// @route   PATCH /api/v1/auth/profile/:phone
// @desc    Update user profile
// @access  Public
router.patch('/profile/:phone', authController.updateProfile);

// @route   POST /api/v1/auth/logout/:phone
// @desc    Logout user
// @access  Public
router.post('/logout/:phone', authController.logout);

module.exports = router;