/**
 * Firebase Configuration
 * For OTP Authentication (Optional - can skip for now)
 */

// For now, we'll use a simple OTP system without Firebase
// This file is ready but not required for basic functionality

const firebaseConfig = {
  // We'll implement simple OTP without Firebase for now
  sendOTP: async (phone) => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, send via SMS gateway
    // For development, just log it
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    // Store OTP in memory (use Redis in production)
    global.otpStore = global.otpStore || {};
    global.otpStore[phone] = {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    return otp;
  },
  
  verifyOTP: async (phone, otp) => {
    const stored = global.otpStore?.[phone];
    
    if (!stored) {
      return { success: false, message: 'OTP not found or expired' };
    }
    
    if (Date.now() > stored.expiresAt) {
      delete global.otpStore[phone];
      return { success: false, message: 'OTP expired' };
    }
    
    if (stored.otp === otp) {
      delete global.otpStore[phone];
      return { success: true, message: 'OTP verified' };
    }
    
    return { success: false, message: 'Invalid OTP' };
  }
};

module.exports = firebaseConfig;