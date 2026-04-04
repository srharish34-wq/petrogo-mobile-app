/**
 * Data Validators
 * Reusable validation functions
 */

const { REGEX_PATTERNS } = require('../config/constants');

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number
 * @returns {Object} Validation result
 */
const validatePhone = (phone) => {
  if (!phone) {
    return {
      valid: false,
      message: 'Phone number is required'
    };
  }
  
  if (typeof phone !== 'string') {
    return {
      valid: false,
      message: 'Phone number must be a string'
    };
  }
  
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return {
      valid: false,
      message: 'Invalid Indian mobile number. Must be 10 digits starting with 6-9'
    };
  }
  
  return {
    valid: true,
    message: 'Valid phone number'
  };
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {Object} Validation result
 */
const validateEmail = (email) => {
  if (!email) {
    return {
      valid: true, // Email is optional
      message: 'Email is optional'
    };
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return {
      valid: false,
      message: 'Invalid email format'
    };
  }
  
  return {
    valid: true,
    message: 'Valid email'
  };
};

/**
 * Validate OTP
 * @param {string} otp - OTP code
 * @returns {Object} Validation result
 */
const validateOTP = (otp) => {
  if (!otp) {
    return {
      valid: false,
      message: 'OTP is required'
    };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return {
      valid: false,
      message: 'OTP must be 6 digits'
    };
  }
  
  return {
    valid: true,
    message: 'Valid OTP'
  };
};

/**
 * Validate coordinates
 * @param {number} longitude
 * @param {number} latitude
 * @returns {Object} Validation result
 */
const validateCoordinates = (longitude, latitude) => {
  if (longitude === undefined || latitude === undefined) {
    return {
      valid: false,
      message: 'Longitude and latitude are required'
    };
  }
  
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return {
      valid: false,
      message: 'Coordinates must be numbers'
    };
  }
  
  if (longitude < -180 || longitude > 180) {
    return {
      valid: false,
      message: 'Longitude must be between -180 and 180'
    };
  }
  
  if (latitude < -90 || latitude > 90) {
    return {
      valid: false,
      message: 'Latitude must be between -90 and 90'
    };
  }
  
  return {
    valid: true,
    message: 'Valid coordinates'
  };
};

/**
 * Validate fuel quantity
 * @param {number} quantity - Fuel quantity in liters
 * @returns {Object} Validation result
 */
const validateFuelQuantity = (quantity) => {
  if (quantity === undefined || quantity === null) {
    return {
      valid: false,
      message: 'Quantity is required'
    };
  }
  
  if (typeof quantity !== 'number') {
    return {
      valid: false,
      message: 'Quantity must be a number'
    };
  }
  
  if (quantity <= 0) {
    return {
      valid: false,
      message: 'Quantity must be greater than 0'
    };
  }
  
  if (quantity < 0.5) {
    return {
      valid: false,
      message: 'Minimum quantity is 0.5 liters'
    };
  }
  
  if (quantity > 5) {
    return {
      valid: false,
      message: 'Maximum quantity is 5 liters for safety'
    };
  }
  
  return {
    valid: true,
    message: 'Valid quantity'
  };
};

/**
 * Validate fuel type
 * @param {string} fuelType - Type of fuel
 * @returns {Object} Validation result
 */
const validateFuelType = (fuelType) => {
  if (!fuelType) {
    return {
      valid: false,
      message: 'Fuel type is required'
    };
  }
  
  const validTypes = ['diesel', 'petrol'];
  
  if (!validTypes.includes(fuelType.toLowerCase())) {
    return {
      valid: false,
      message: 'Fuel type must be diesel or petrol'
    };
  }
  
  return {
    valid: true,
    message: 'Valid fuel type'
  };
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - Object ID
 * @returns {Object} Validation result
 */
const validateObjectId = (id) => {
  if (!id) {
    return {
      valid: false,
      message: 'ID is required'
    };
  }
  
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return {
      valid: false,
      message: 'Invalid ID format'
    };
  }
  
  return {
    valid: true,
    message: 'Valid ID'
  };
};

/**
 * Validate pincode
 * @param {string} pincode - Indian pincode
 * @returns {Object} Validation result
 */
const validatePincode = (pincode) => {
  if (!pincode) {
    return {
      valid: false,
      message: 'Pincode is required'
    };
  }
  
  if (!REGEX_PATTERNS.PINCODE.test(pincode)) {
    return {
      valid: false,
      message: 'Invalid pincode. Must be 6 digits'
    };
  }
  
  return {
    valid: true,
    message: 'Valid pincode'
  };
};

/**
 * Validate amount
 * @param {number} amount - Amount in rupees
 * @param {number} min - Minimum amount
 * @param {number} max - Maximum amount
 * @returns {Object} Validation result
 */
const validateAmount = (amount, min = 0, max = Infinity) => {
  if (amount === undefined || amount === null) {
    return {
      valid: false,
      message: 'Amount is required'
    };
  }
  
  if (typeof amount !== 'number') {
    return {
      valid: false,
      message: 'Amount must be a number'
    };
  }
  
  if (amount < min) {
    return {
      valid: false,
      message: `Amount must be at least ₹${min}`
    };
  }
  
  if (amount > max) {
    return {
      valid: false,
      message: `Amount cannot exceed ₹${max}`
    };
  }
  
  return {
    valid: true,
    message: 'Valid amount'
  };
};

/**
 * Validate name
 * @param {string} name - Name
 * @returns {Object} Validation result
 */
const validateName = (name) => {
  if (!name) {
    return {
      valid: false,
      message: 'Name is required'
    };
  }
  
  if (typeof name !== 'string') {
    return {
      valid: false,
      message: 'Name must be a string'
    };
  }
  
  if (name.trim().length < 2) {
    return {
      valid: false,
      message: 'Name must be at least 2 characters'
    };
  }
  
  if (name.length > 100) {
    return {
      valid: false,
      message: 'Name cannot exceed 100 characters'
    };
  }
  
  return {
    valid: true,
    message: 'Valid name'
  };
};

/**
 * Validate vehicle number
 * @param {string} vehicleNumber - Vehicle registration number
 * @returns {Object} Validation result
 */
const validateVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber) {
    return {
      valid: false,
      message: 'Vehicle number is required'
    };
  }
  
  // Basic format: XX00XX0000 or XX-00-XX-0000
  const pattern = /^[A-Z]{2}[-]?[0-9]{2}[-]?[A-Z]{1,2}[-]?[0-9]{4}$/;
  
  if (!pattern.test(vehicleNumber.toUpperCase().replace(/\s/g, ''))) {
    return {
      valid: false,
      message: 'Invalid vehicle number format'
    };
  }
  
  return {
    valid: true,
    message: 'Valid vehicle number'
  };
};

/**
 * Validate all fields in object
 * @param {Object} data - Data object
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
const validateAll = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    let result;
    
    switch (rule.type) {
      case 'phone':
        result = validatePhone(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'otp':
        result = validateOTP(value);
        break;
      case 'name':
        result = validateName(value);
        break;
      case 'amount':
        result = validateAmount(value, rule.min, rule.max);
        break;
      case 'fuelQuantity':
        result = validateFuelQuantity(value);
        break;
      case 'fuelType':
        result = validateFuelType(value);
        break;
      case 'objectId':
        result = validateObjectId(value);
        break;
      default:
        result = { valid: true };
    }
    
    if (!result.valid) {
      errors[field] = result.message;
      isValid = false;
    }
  });
  
  return {
    valid: isValid,
    errors: isValid ? null : errors
  };
};

/**
 * Sanitize string (remove special characters)
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Sanitize phone number (remove spaces, dashes, etc.)
 * @param {string} phone - Phone number
 * @returns {string} Sanitized phone number
 */
const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return phone;
  
  return phone
    .replace(/\D/g, '') // Remove all non-digit characters
    .slice(-10); // Take last 10 digits
};

module.exports = {
  validatePhone,
  validateEmail,
  validateOTP,
  validateCoordinates,
  validateFuelQuantity,
  validateFuelType,
  validateObjectId,
  validatePincode,
  validateAmount,
  validateName,
  validateVehicleNumber,
  validateAll,
  sanitizeString,
  sanitizePhone
};