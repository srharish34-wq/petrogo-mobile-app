/**
 * Validators
 * Input validation utilities
 * Location: partner/src/utils/validators.js
 */

import { REGEX_PATTERNS } from './constants';

// ============================================
// PHONE NUMBER VALIDATORS
// ============================================

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  return REGEX_PATTERNS.PHONE.test(cleaned);
};

/**
 * Get phone validation error message
 * @param {string} phone - Phone number
 * @returns {string} Error message or empty string
 */
export const getPhoneError = (phone) => {
  if (!phone) return 'Phone number is required';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 0) return 'Phone number is required';
  if (cleaned.length < 10) return 'Phone number must be 10 digits';
  if (cleaned.length > 10) return 'Phone number must be exactly 10 digits';
  if (!REGEX_PATTERNS.PHONE.test(cleaned)) return 'Invalid phone number format';
  
  return '';
};

// ============================================
// EMAIL VALIDATORS
// ============================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  return REGEX_PATTERNS.EMAIL.test(email);
};

/**
 * Get email validation error message
 * @param {string} email - Email address
 * @param {boolean} required - Whether email is required
 * @returns {string} Error message or empty string
 */
export const getEmailError = (email, required = true) => {
  if (!email) {
    return required ? 'Email is required' : '';
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return 'Invalid email format';
  }
  
  return '';
};

// ============================================
// OTP VALIDATORS
// ============================================

/**
 * Validate OTP
 * @param {string} otp - OTP to validate
 * @returns {boolean} True if valid
 */
export const validateOTP = (otp) => {
  if (!otp) return false;
  return REGEX_PATTERNS.OTP.test(otp);
};

/**
 * Get OTP validation error message
 * @param {string} otp - OTP
 * @returns {string} Error message or empty string
 */
export const getOTPError = (otp) => {
  if (!otp) return 'OTP is required';
  if (otp.length < 6) return 'OTP must be 6 digits';
  if (!REGEX_PATTERNS.OTP.test(otp)) return 'OTP must contain only numbers';
  
  return '';
};

// ============================================
// NAME VALIDATORS
// ============================================

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if valid
 */
export const validateName = (name, minLength = 2) => {
  if (!name) return false;
  
  const trimmed = name.trim();
  return trimmed.length >= minLength && /^[a-zA-Z\s]+$/.test(trimmed);
};

/**
 * Get name validation error message
 * @param {string} name - Name
 * @param {number} minLength - Minimum length
 * @returns {string} Error message or empty string
 */
export const getNameError = (name, minLength = 2) => {
  if (!name) return 'Name is required';
  
  const trimmed = name.trim();
  
  if (trimmed.length === 0) return 'Name is required';
  if (trimmed.length < minLength) return `Name must be at least ${minLength} characters`;
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) return 'Name can only contain letters and spaces';
  
  return '';
};

// ============================================
// VEHICLE NUMBER VALIDATORS
// ============================================

/**
 * Validate vehicle number (Indian format)
 * @param {string} vehicleNumber - Vehicle number to validate
 * @returns {boolean} True if valid
 */
export const validateVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber) return false;
  
  const cleaned = vehicleNumber.toUpperCase().replace(/\s/g, '');
  
  // Flexible validation for various Indian formats
  // Minimum 6 characters, alphanumeric
  return cleaned.length >= 6 && /^[A-Z0-9]+$/.test(cleaned);
};

/**
 * Get vehicle number validation error message
 * @param {string} vehicleNumber - Vehicle number
 * @returns {string} Error message or empty string
 */
export const getVehicleNumberError = (vehicleNumber) => {
  if (!vehicleNumber) return 'Vehicle number is required';
  
  const cleaned = vehicleNumber.toUpperCase().replace(/\s/g, '');
  
  if (cleaned.length === 0) return 'Vehicle number is required';
  if (cleaned.length < 6) return 'Vehicle number must be at least 6 characters';
  if (!/^[A-Z0-9]+$/.test(cleaned)) return 'Vehicle number can only contain letters and numbers';
  
  return '';
};

// ============================================
// LICENSE NUMBER VALIDATORS
// ============================================

/**
 * Validate driving license number
 * @param {string} licenseNumber - License number to validate
 * @returns {boolean} True if valid
 */
export const validateLicenseNumber = (licenseNumber) => {
  if (!licenseNumber) return false;
  
  const cleaned = licenseNumber.toUpperCase().replace(/\s/g, '');
  
  // Minimum 8 characters, alphanumeric
  return cleaned.length >= 8 && /^[A-Z0-9]+$/.test(cleaned);
};

/**
 * Get license number validation error message
 * @param {string} licenseNumber - License number
 * @returns {string} Error message or empty string
 */
export const getLicenseNumberError = (licenseNumber) => {
  if (!licenseNumber) return 'License number is required';
  
  const cleaned = licenseNumber.toUpperCase().replace(/\s/g, '');
  
  if (cleaned.length === 0) return 'License number is required';
  if (cleaned.length < 8) return 'License number must be at least 8 characters';
  if (!/^[A-Z0-9]+$/.test(cleaned)) return 'License number can only contain letters and numbers';
  
  return '';
};

// ============================================
// AADHAAR VALIDATORS
// ============================================

/**
 * Validate Aadhaar number
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {boolean} True if valid
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  
  const cleaned = aadhaar.replace(/\D/g, '');
  return REGEX_PATTERNS.AADHAAR.test(cleaned);
};

/**
 * Get Aadhaar validation error message
 * @param {string} aadhaar - Aadhaar number
 * @returns {string} Error message or empty string
 */
export const getAadhaarError = (aadhaar) => {
  if (!aadhaar) return 'Aadhaar number is required';
  
  const cleaned = aadhaar.replace(/\D/g, '');
  
  if (cleaned.length === 0) return 'Aadhaar number is required';
  if (cleaned.length < 12) return 'Aadhaar number must be 12 digits';
  if (cleaned.length > 12) return 'Aadhaar number must be exactly 12 digits';
  if (!/^\d+$/.test(cleaned)) return 'Aadhaar number must contain only numbers';
  
  return '';
};

// ============================================
// PASSWORD VALIDATORS (if needed)
// ============================================

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} True if valid
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) return false;
  
  return (
    password.length >= minLength &&
    /[A-Z]/.test(password) && // Has uppercase
    /[a-z]/.test(password) && // Has lowercase
    /[0-9]/.test(password)    // Has number
  );
};

/**
 * Get password validation error message
 * @param {string} password - Password
 * @param {number} minLength - Minimum length
 * @returns {string} Error message or empty string
 */
export const getPasswordError = (password, minLength = 8) => {
  if (!password) return 'Password is required';
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return '';
};

// ============================================
// PINCODE VALIDATORS
// ============================================

/**
 * Validate Indian pincode
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid
 */
export const validatePincode = (pincode) => {
  if (!pincode) return false;
  
  const cleaned = pincode.replace(/\D/g, '');
  return REGEX_PATTERNS.PINCODE.test(cleaned);
};

/**
 * Get pincode validation error message
 * @param {string} pincode - Pincode
 * @returns {string} Error message or empty string
 */
export const getPincodeError = (pincode) => {
  if (!pincode) return 'Pincode is required';
  
  const cleaned = pincode.replace(/\D/g, '');
  
  if (cleaned.length === 0) return 'Pincode is required';
  if (cleaned.length !== 6) return 'Pincode must be 6 digits';
  if (cleaned.startsWith('0')) return 'Pincode cannot start with 0';
  
  return '';
};

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate registration form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Errors object
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Phone
  const phoneError = getPhoneError(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  // Name
  const nameError = getNameError(formData.name);
  if (nameError) errors.name = nameError;
  
  // Email (optional)
  if (formData.email) {
    const emailError = getEmailError(formData.email, false);
    if (emailError) errors.email = emailError;
  }
  
  // Vehicle Number
  const vehicleError = getVehicleNumberError(formData.vehicleNumber);
  if (vehicleError) errors.vehicleNumber = vehicleError;
  
  // License Number
  const licenseError = getLicenseNumberError(formData.licenseNumber);
  if (licenseError) errors.licenseNumber = licenseError;
  
  // Aadhaar
  const aadhaarError = getAadhaarError(formData.aadhaarNumber);
  if (aadhaarError) errors.aadhaarNumber = aadhaarError;
  
  return errors;
};

/**
 * Check if form has errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  validatePhone,
  getPhoneError,
  validateEmail,
  getEmailError,
  validateOTP,
  getOTPError,
  validateName,
  getNameError,
  validateVehicleNumber,
  getVehicleNumberError,
  validateLicenseNumber,
  getLicenseNumberError,
  validateAadhaar,
  getAadhaarError,
  validatePassword,
  getPasswordError,
  validatePincode,
  getPincodeError,
  validateRegistrationForm,
  hasErrors
};