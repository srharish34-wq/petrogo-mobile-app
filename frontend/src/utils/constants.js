/**
 * Constants
 * Application-wide constants
 */

// Fuel Types
export const FUEL_TYPES = {
  DIESEL: 'diesel',
  PETROL: 'petrol'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PARTNER_ASSIGNED: 'partner_assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  DELIVERY_PARTNER: 'delivery_partner',
  PETROL_BUNK: 'petrol_bunk',
  ADMIN: 'admin'
};

// Fuel Limits
export const MAX_FUEL_LIMIT = 5; // Liters
export const MIN_FUEL_LIMIT = 0.5; // Liters

// Delivery Settings
export const DELIVERY_RADIUS_KM = 5; // Kilometers
export const BASE_DELIVERY_CHARGE = 30; // INR
export const PER_KM_CHARGE = 10; // INR
export const MAX_DELIVERY_CHARGE = 100; // INR
export const EMERGENCY_FEE = 50; // INR

// OTP Settings
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

// Map Settings
export const DEFAULT_LOCATION = {
  latitude: 13.0827,
  longitude: 80.2707,
  city: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India'
};

// API Settings
export const API_TIMEOUT = 30000; // 30 seconds
export const REQUEST_RETRY_LIMIT = 3;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card',
  ONLINE: 'online'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  PHONE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  OTP: /^\d{6}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_PHONE: 'Please enter a valid 10-digit mobile number.',
  INVALID_OTP: 'Please enter a valid 6-digit OTP.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  LOCATION_DENIED: 'Location permission denied. Please enable location access.',
  NO_BUNKS_AVAILABLE: 'No petrol bunks available in your area.',
  ORDER_FAILED: 'Failed to create order. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  OTP_SENT: 'OTP sent successfully!',
  ORDER_CREATED: 'Order created successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!'
};

// Order Status Display
export const ORDER_STATUS_DISPLAY = {
  pending: { label: 'Pending', color: 'yellow', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: 'blue', icon: '✅' },
  partner_assigned: { label: 'Partner Assigned', color: 'purple', icon: '🚴' },
  picked_up: { label: 'Picked Up', color: 'indigo', icon: '📦' },
  in_transit: { label: 'On the Way', color: 'orange', icon: '🚚' },
  delivered: { label: 'Delivered', color: 'teal', icon: '🎯' },
  completed: { label: 'Completed', color: 'green', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: 'red', icon: '❌' }
};

// Fuel Type Display
export const FUEL_TYPE_DISPLAY = {
  diesel: { 
    name: 'Diesel', 
    icon: '🛢️', 
    color: 'from-yellow-500 to-orange-500',
    description: 'Recommended for safety'
  },
  petrol: { 
    name: 'Petrol', 
    icon: '⛽', 
    color: 'from-red-500 to-pink-500',
    description: 'High performance'
  }
};

// Time Settings
export const TIME_CONSTANTS = {
  ESTIMATED_DELIVERY_TIME: 45, // minutes
  ORDER_AUTO_CANCEL_TIME: 30, // minutes
  PARTNER_ACCEPT_TIMEOUT: 5, // minutes
  LOCATION_UPDATE_INTERVAL: 5000, // milliseconds
  ORDER_REFRESH_INTERVAL: 10000 // milliseconds
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PHONE: 'userPhone',
  USER_DATA: 'userData',
  SAVED_LOCATIONS: 'savedLocations',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  EMERGENCY: '/emergency',
  TRACKING: '/tracking',
  ORDERS: '/orders',
  PROFILE: '/profile',
  NOT_FOUND: '*'
};

// Safety Constants
export const SAFETY_CONSTANTS = {
  CONTAINER_TYPE: 'PESO-approved safety container',
  MAX_FUEL_PER_DELIVERY: 5,
  PREFERRED_FUEL: 'diesel',
  SERVICE_TYPE: 'Emergency Fuel Assistance',
  LEGAL_DISCLAIMER: 'Emergency fuel assistance only using PESO-approved containers'
};

// Contact Information
export const CONTACT_INFO = {
  SUPPORT_PHONE: '1800-XXX-XXXX',
  SUPPORT_EMAIL: 'support@petrogo.com',
  EMERGENCY_PHONE: '911'
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/petrogo',
  TWITTER: 'https://twitter.com/petrogo',
  INSTAGRAM: 'https://instagram.com/petrogo',
  LINKEDIN: 'https://linkedin.com/company/petrogo'
};

// App Information
export const APP_INFO = {
  NAME: 'PetroGo',
  VERSION: '1.0.0',
  DESCRIPTION: 'Emergency Fuel Delivery Platform',
  TAGLINE: 'Fuel Delivered in Minutes',
  COPYRIGHT: `© ${new Date().getFullYear()} PetroGo. All rights reserved.`
};