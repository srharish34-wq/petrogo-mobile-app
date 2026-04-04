/**
 * Validators
 * Input validation functions
 */

import { REGEX_PATTERNS, MAX_FUEL_LIMIT, MIN_FUEL_LIMIT } from './constants';

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, message: 'Phone number is required' };
  }

  if (typeof phone !== 'string') {
    return { valid: false, message: 'Phone number must be a string' };
  }

  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return { 
      valid: false, 
      message: 'Invalid phone number. Must be 10 digits starting with 6-9' 
    };
  }

  return { valid: true, message: 'Valid phone number' };
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: true, message: 'Email is optional' };
  }

  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true, message: 'Valid email' };
};

/**
 * Validate OTP
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { valid: false, message: 'OTP is required' };
  }

  if (!REGEX_PATTERNS.OTP.test(otp)) {
    return { valid: false, message: 'OTP must be 6 digits' };
  }

  return { valid: true, message: 'Valid OTP' };
};

/**
 * Validate fuel quantity
 */
export const validateFuelQuantity = (quantity) => {
  if (quantity === undefined || quantity === null) {
    return { valid: false, message: 'Quantity is required' };
  }

  if (typeof quantity !== 'number') {
    return { valid: false, message: 'Quantity must be a number' };
  }

  if (quantity < MIN_FUEL_LIMIT) {
    return { 
      valid: false, 
      message: `Minimum quantity is ${MIN_FUEL_LIMIT} liters` 
    };
  }

  if (quantity > MAX_FUEL_LIMIT) {
    return { 
      valid: false, 
      message: `Maximum quantity is ${MAX_FUEL_LIMIT} liters for safety` 
    };
  }

  return { valid: true, message: 'Valid quantity' };
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    return { valid: false, message: 'Coordinates are required' };
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return { valid: false, message: 'Coordinates must be numbers' };
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, message: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, message: 'Longitude must be between -180 and 180' };
  }

  return { valid: true, message: 'Valid coordinates' };
};

/**
 * Validate name
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }

  if (name.length > 100) {
    return { valid: false, message: 'Name cannot exceed 100 characters' };
  }

  return { valid: true, message: 'Valid name' };
};

/**
 * Validate pincode
 */
export const validatePincode = (pincode) => {
  if (!pincode) {
    return { valid: false, message: 'Pincode is required' };
  }

  if (!REGEX_PATTERNS.PINCODE.test(pincode)) {
    return { valid: false, message: 'Invalid pincode. Must be 6 digits' };
  }

  return { valid: true, message: 'Valid pincode' };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }

  return { valid: true, message: 'Valid' };
};

/**
 * Validate all fields
 */
export const validateAll = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach(fieldName => {
    const { value, validator, label } = fields[fieldName];
    const result = validator(value, label || fieldName);
    
    if (!result.valid) {
      errors[fieldName] = result.message;
      isValid = false;
    }
  });

  return { valid: isValid, errors };
};

/**
 * Sanitize string
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  
  return phone
    .replace(/\D/g, '')
    .slice(-10);
};

/**
 * Is valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};