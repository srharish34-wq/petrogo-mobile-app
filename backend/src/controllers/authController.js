/**
 * Authentication Controller
 * Handles OTP login, signup, and user authentication
 */

const User = require('../models/User');
const firebaseConfig = require('../config/firebase');
const { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, USER_ROLES } = require('../config/constants');

/**
 * Send OTP to phone number
 * POST /api/v1/auth/send-otp
 */
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: ERROR_MESSAGES.INVALID_PHONE
      });
    }
    
    // Send OTP
    const otp = await firebaseConfig.sendOTP(phone);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.OTP_SENT,
      data: {
        phone,
        // Return OTP only in development
        ...(process.env.NODE_ENV === 'development' && { otp })
      }
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Verify OTP and login/signup user
 * POST /api/v1/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name, role } = req.body;
    
    // Validate inputs
    if (!phone || !otp) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Phone and OTP are required'
      });
    }
    
    // Verify OTP
    const verification = await firebaseConfig.verifyOTP(phone, otp);
    
    if (!verification.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: verification.message
      });
    }
    
    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new user
      user = await User.create({
        phone,
        name: name || `User${phone.slice(-4)}`,
        role: role || USER_ROLES.CUSTOMER,
        isVerified: true,
        lastLoginAt: new Date()
      });
      
      console.log('✅ New user created:', user.name);
    } else {
      // Update existing user
      user.lastLoginAt = new Date();
      user.isVerified = true;
      await user.save();
      
      console.log('✅ User logged in:', user.name);
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get current user profile
 * GET /api/v1/auth/profile/:phone
 */
exports.getProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update user profile
 * PATCH /api/v1/auth/profile/:phone
 */
exports.updateProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated
    delete updates.phone;
    delete updates.role;
    delete updates.isVerified;
    
    const user = await User.findOneAndUpdate(
      { phone },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Logout user (just for logging purpose)
 * POST /api/v1/auth/logout/:phone
 */
exports.logout = async (req, res) => {
  try {
    const { phone } = req.params;
    
    await User.findOneAndUpdate(
      { phone },
      { lastActiveAt: new Date() }
    );
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};