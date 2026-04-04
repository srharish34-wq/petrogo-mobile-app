/**
 * Input Validation Middleware
 * Validates request data
 */

const { HTTP_STATUS, REGEX_PATTERNS, APP_SETTINGS } = require('../config/constants');

/**
 * Validate phone number
 */
const validatePhone = (req, res, next) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Phone number is required'
    });
  }
  
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid Indian mobile number. Must be 10 digits starting with 6-9'
    });
  }
  
  next();
};

/**
 * Validate OTP
 */
const validateOTP = (req, res, next) => {
  const { otp } = req.body;
  
  if (!otp) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'OTP is required'
    });
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'OTP must be 6 digits'
    });
  }
  
  next();
};

/**
 * Validate email (optional)
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !REGEX_PATTERNS.EMAIL.test(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid email format'
    });
  }
  
  next();
};

/**
 * Validate order creation data
 */
const validateOrderCreation = (req, res, next) => {
  const { customerPhone, petrolBunkId, fuelType, quantity, deliveryLocation } = req.body;
  
  // Check required fields
  if (!customerPhone || !petrolBunkId || !fuelType || !quantity || !deliveryLocation) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Missing required fields',
      required: ['customerPhone', 'petrolBunkId', 'fuelType', 'quantity', 'deliveryLocation']
    });
  }
  
  // Validate fuel type
  if (!['diesel', 'petrol'].includes(fuelType)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid fuel type. Must be diesel or petrol'
    });
  }
  
  // Validate quantity
  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Quantity must be a positive number'
    });
  }
  
  if (quantity > APP_SETTINGS.MAX_FUEL_LIMIT) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: `Maximum fuel limit is ${APP_SETTINGS.MAX_FUEL_LIMIT} liters for safety`
    });
  }
  
  if (quantity < 0.5) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Minimum quantity is 0.5 liters'
    });
  }
  
  // Validate delivery location
  if (!deliveryLocation.coordinates || !Array.isArray(deliveryLocation.coordinates)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid delivery location. Coordinates required [longitude, latitude]'
    });
  }
  
  const [longitude, latitude] = deliveryLocation.coordinates;
  
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Coordinates must be numbers'
    });
  }
  
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid coordinates range'
    });
  }
  
  if (!deliveryLocation.address) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Delivery address is required'
    });
  }
  
  next();
};

/**
 * Validate location coordinates
 */
const validateLocation = (req, res, next) => {
  const { longitude, latitude } = req.body;
  
  if (longitude === undefined || latitude === undefined) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Longitude and latitude are required'
    });
  }
  
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Coordinates must be numbers'
    });
  }
  
  if (longitude < -180 || longitude > 180) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Longitude must be between -180 and 180'
    });
  }
  
  if (latitude < -90 || latitude > 90) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Latitude must be between -90 and 90'
    });
  }
  
  next();
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: `${paramName} is required`
      });
    }
    
    // Check if valid MongoDB ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

/**
 * Validate bunk creation data
 */
const validateBunkCreation = (req, res, next) => {
  const { name, registrationNumber, contactPerson, address, location, ownerPhone } = req.body;
  
  // Check required fields
  if (!name || !registrationNumber || !contactPerson || !address || !location || !ownerPhone) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Missing required fields',
      required: ['name', 'registrationNumber', 'contactPerson', 'address', 'location', 'ownerPhone']
    });
  }
  
  // Validate location
  if (!location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Location coordinates must be [longitude, latitude]'
    });
  }
  
  // Validate owner phone
  if (!REGEX_PATTERNS.PHONE.test(ownerPhone)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid owner phone number'
    });
  }
  
  next();
};

/**
 * Validate partner registration data
 */
const validatePartnerRegistration = (req, res, next) => {
  const { phone, name, vehicle, license } = req.body;
  
  // Check required fields
  if (!phone || !name || !vehicle || !license) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Missing required fields',
      required: ['phone', 'name', 'vehicle', 'license']
    });
  }
  
  // Validate phone
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid phone number'
    });
  }
  
  // Validate vehicle
  if (!vehicle.number || !vehicle.type) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'Vehicle number and type are required'
    });
  }
  
  // Validate license
  if (!license.number) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: 'error',
      message: 'License number is required'
    });
  }
  
  next();
};

module.exports = {
  validatePhone,
  validateOTP,
  validateEmail,
  validateOrderCreation,
  validateLocation,
  validateObjectId,
  validateBunkCreation,
  validatePartnerRegistration
};