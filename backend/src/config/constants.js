/**
 * Application Constants
 * All constant values used throughout the app
 */

// User Roles
const USER_ROLES = {
  CUSTOMER: 'customer',
  DELIVERY_PARTNER: 'delivery_partner',
  PETROL_BUNK: 'petrol_bunk',
  ADMIN: 'admin'
};

// Order Status
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PARTNER_ASSIGNED: 'partner_assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Fuel Types
const FUEL_TYPES = {
  DIESEL: 'diesel',
  PETROL: 'petrol'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Delivery Partner Status
const PARTNER_STATUS = {
  OFFLINE: 'offline',
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_DELIVERY: 'on_delivery'
};

// Application Settings
const APP_SETTINGS = {
  MAX_FUEL_LIMIT: 5, // Liters
  DELIVERY_RADIUS_KM: 5, // Kilometers
  EMERGENCY_FEE: 50, // INR
  MIN_ORDER_AMOUNT: 100,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10
};

// Delivery Charges
const DELIVERY_CHARGES = {
  BASE_CHARGE: 30, // Base charge
  PER_KM_CHARGE: 10, // Per km
  MAX_DELIVERY_CHARGE: 100 // Maximum cap
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  ORDER_NOT_FOUND: 'Order not found',
  NO_BUNK_AVAILABLE: 'No petrol bunk available in your area',
  FUEL_LIMIT_EXCEEDED: 'Fuel quantity exceeds maximum limit',
  INVALID_LOCATION: 'Invalid location coordinates',
  INVALID_OTP: 'Invalid or expired OTP',
  INVALID_PHONE: 'Invalid phone number'
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  OTP_SENT: 'OTP sent successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// Regex Patterns
const REGEX_PATTERNS = {
  PHONE: /^[6-9]\d{9}$/, // Indian mobile number
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE: /^[1-9][0-9]{5}$/
};

// Safety & Legal Constants
const SAFETY_CONSTANTS = {
  CONTAINER_TYPE: 'PESO-approved safety container',
  MAX_FUEL_PER_DELIVERY: 5,
  PREFERRED_FUEL: 'diesel',
  SERVICE_TYPE: 'Emergency Fuel Assistance',
  LEGAL_DISCLAIMER: 'Emergency fuel assistance only using PESO-approved containers'
};

module.exports = {
  USER_ROLES,
  ORDER_STATUS,
  FUEL_TYPES,
  PAYMENT_STATUS,
  PARTNER_STATUS,
  APP_SETTINGS,
  DELIVERY_CHARGES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REGEX_PATTERNS,
  SAFETY_CONSTANTS
};