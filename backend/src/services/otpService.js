/**
 * OTP Service
 * Handles OTP generation, storage, and verification
 */

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to phone number
 * @param {string} phone - Phone number
 * @returns {string} OTP code
 */
const sendOTP = async (phone) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiry (10 minutes)
    const expiryTime = Date.now() + 10 * 60 * 1000;
    
    otpStore.set(phone, {
      otp,
      expiryTime,
      attempts: 0,
      createdAt: Date.now()
    });
    
    // In production, send via SMS gateway (Twilio, MSG91, etc.)
    console.log(`📱 OTP for ${phone}: ${otp}`);
    console.log(`⏰ Valid for 10 minutes`);
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return otp;
  } catch (error) {
    console.error('Send OTP Error:', error);
    throw new Error('Failed to send OTP');
  }
};

/**
 * Verify OTP
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to verify
 * @returns {Object} Verification result
 */
const verifyOTP = async (phone, otp) => {
  try {
    const storedData = otpStore.get(phone);
    
    // Check if OTP exists
    if (!storedData) {
      return {
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      };
    }
    
    // Check if OTP expired
    if (Date.now() > storedData.expiryTime) {
      otpStore.delete(phone);
      return {
        success: false,
        message: 'OTP expired. Please request a new OTP.'
      };
    }
    
    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(phone);
      return {
        success: false,
        message: 'Maximum attempts exceeded. Please request a new OTP.'
      };
    }
    
    // Verify OTP
    if (storedData.otp === otp) {
      // OTP verified successfully
      otpStore.delete(phone);
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      // Increment attempts
      storedData.attempts += 1;
      otpStore.set(phone, storedData);
      
      return {
        success: false,
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.`
      };
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw new Error('Failed to verify OTP');
  }
};

/**
 * Resend OTP
 * @param {string} phone - Phone number
 * @returns {string} New OTP
 */
const resendOTP = async (phone) => {
  try {
    const storedData = otpStore.get(phone);
    
    // Check if cooldown period (1 minute)
    if (storedData && Date.now() - storedData.createdAt < 60000) {
      const waitTime = Math.ceil((60000 - (Date.now() - storedData.createdAt)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting new OTP`);
    }
    
    // Send new OTP
    return await sendOTP(phone);
  } catch (error) {
    throw error;
  }
};

/**
 * Clear OTP (for testing)
 * @param {string} phone - Phone number
 */
const clearOTP = (phone) => {
  otpStore.delete(phone);
};

/**
 * Get OTP info (for development/testing only)
 * @param {string} phone - Phone number
 */
const getOTPInfo = (phone) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const storedData = otpStore.get(phone);
  if (!storedData) return null;
  
  return {
    otp: storedData.otp,
    expiresIn: Math.ceil((storedData.expiryTime - Date.now()) / 1000),
    attempts: storedData.attempts
  };
};

module.exports = {
  sendOTP,
  verifyOTP,
  resendOTP,
  clearOTP,
  getOTPInfo
};