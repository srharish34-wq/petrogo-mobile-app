/**
 * Authentication Middleware
 * Verifies user identity (simplified without JWT for now)
 */

const User = require('../models/User');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Simple authentication by phone number
 * In production, you would verify JWT tokens here
 */
const authenticate = async (req, res, next) => {
  try {
    // Get phone from header or body
    const phone = req.headers['x-user-phone'] || req.body.phone || req.query.phone;
    
    if (!phone) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Phone number required for authentication'
      });
    }
    
    // Find user
    const user = await User.findOne({ phone, isActive: true });
    
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    req.userPhone = user.phone;
    
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: ERROR_MESSAGES.SERVER_ERROR
    });
  }
};

/**
 * Optional authentication (doesn't fail if no user)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const phone = req.headers['x-user-phone'] || req.body.phone || req.query.phone;
    
    if (phone) {
      const user = await User.findOne({ phone, isActive: true });
      
      if (user) {
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
        req.userPhone = user.phone;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};