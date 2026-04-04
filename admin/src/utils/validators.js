/**
 * Validators Utility
 * Functions for validating data
 * Location: admin/src/utils/validators.js
 */

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  const cleaned = phone?.replace(/\D/g, '') || '';
  return phoneRegex.test(cleaned);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, errors: ['Password is required'] };

  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain a special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 'weak';

  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'fair';
  if (strength <= 4) return 'good';
  return 'strong';
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate name
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 50) {
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  return { valid: true };
};

/**
 * Validate number
 */
export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Must be a valid number' };
  }

  if (min !== null && num < min) {
    return { valid: false, error: `Must be at least ${min}` };
  }

  if (max !== null && num > max) {
    return { valid: false, error: `Must not exceed ${max}` };
  }

  return { valid: true };
};

/**
 * Validate currency amount
 */
export const validateAmount = (amount) => {
  const validation = validateNumber(amount, 0);

  if (!validation.valid) {
    return validation;
  }

  const num = parseFloat(amount);
  const decimals = (num.toString().split('.')[1] || '').length;

  if (decimals > 2) {
    return { valid: false, error: 'Amount can have at most 2 decimal places' };
  }

  return { valid: true };
};

/**
 * Validate percentage
 */
export const validatePercent = (percent) => {
  const validation = validateNumber(percent, 0, 100);
  return validation;
};

/**
 * Validate length
 */
export const validateLength = (value, minLength, maxLength = null) => {
  if (!value) {
    return { valid: false, error: 'Value is required' };
  }

  const length = value.length;

  if (length < minLength) {
    return {
      valid: false,
      error: `Minimum length is ${minLength} characters (current: ${length})`
    };
  }

  if (maxLength && length > maxLength) {
    return {
      valid: false,
      error: `Maximum length is ${maxLength} characters (current: ${length})`
    };
  }

  return { valid: true };
};

/**
 * Validate date
 */
export const validateDate = (date) => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }

  return { valid: true };
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }

  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }

  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  return { valid: true };
};

/**
 * Validate vehicle number
 */
export const validateVehicleNumber = (number) => {
  if (!number) {
    return { valid: false, error: 'Vehicle number is required' };
  }

  // Indian vehicle number format: TN01AB1234
  const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  const cleaned = number.toUpperCase().replace(/\D/g, '').slice(0, 4) +
                  number.toUpperCase().replace(/\D/g, '').slice(4);

  if (!vehicleRegex.test(number.toUpperCase())) {
    return { valid: false, error: 'Invalid vehicle number format (e.g., TN01AB1234)' };
  }

  return { valid: true };
};

/**
 * Validate pincode
 */
export const validatePincode = (pincode) => {
  if (!pincode) {
    return { valid: false, error: 'Pincode is required' };
  }

  // Indian pincode: 6 digits
  const pincodeRegex = /^[0-9]{6}$/;
  const cleaned = pincode.replace(/\D/g, '');

  if (!pincodeRegex.test(cleaned)) {
    return { valid: false, error: 'Pincode must be 6 digits' };
  }

  return { valid: true };
};

/**
 * Validate coordinates (latitude, longitude)
 */
export const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return { valid: false, error: 'Invalid coordinates' };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size must not exceed ${maxSizeInMB}MB`
    };
  }

  return { valid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate form data
 */
export const validateFormData = (data, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field];

    for (let rule of rules) {
      if (typeof rule === 'function') {
        const result = rule(value);
        if (result && result.error) {
          errors[field] = result.error;
          break;
        }
      }
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate required field
 */
export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: 'This field is required' };
  }
  return { valid: true };
};

/**
 * Validate match fields (e.g., password confirmation)
 */
export const validateMatch = (value1, value2, fieldName = 'Field') => {
  if (value1 !== value2) {
    return { valid: false, error: `${fieldName}s do not match` };
  }
  return { valid: true };
};

/**
 * Sanitize string (remove HTML tags)
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate credit card
 */
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber?.replace(/\D/g, '') || '';

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const valid = sum % 10 === 0 && cleaned.length >= 13 && cleaned.length <= 19;

  return {
    valid,
    error: valid ? null : 'Invalid credit card number'
  };
};

/**
 * Export all validators
 */
export default {
  validateEmail,
  validatePhone,
  validatePassword,
  calculatePasswordStrength,
  validateURL,
  validateName,
  validateNumber,
  validateAmount,
  validatePercent,
  validateLength,
  validateDate,
  validateDateRange,
  validateVehicleNumber,
  validatePincode,
  validateCoordinates,
  validateFileSize,
  validateFileType,
  validateFormData,
  validateRequired,
  validateMatch,
  sanitizeString,
  validateCreditCard
};