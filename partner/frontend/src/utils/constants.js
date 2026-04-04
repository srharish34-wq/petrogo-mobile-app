/**
 * Constants
 * Application-wide constants for delivery partner panel
 * Location: partner/src/utils/constants.js
 */

// ============================================
// ORDER STATUS
// ============================================
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

// Order Status Display Configuration
export const ORDER_STATUS_DISPLAY = {
  pending: { 
    label: 'Pending', 
    color: 'yellow', 
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
    icon: '⏳' 
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'blue', 
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-500',
    icon: '✅' 
  },
  partner_assigned: { 
    label: 'Assigned', 
    color: 'purple', 
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-500',
    icon: '🚴' 
  },
  picked_up: { 
    label: 'Picked Up', 
    color: 'indigo', 
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-500',
    icon: '📦' 
  },
  in_transit: { 
    label: 'On the Way', 
    color: 'orange', 
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-500',
    icon: '🚚' 
  },
  delivered: { 
    label: 'Delivered', 
    color: 'teal', 
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-500',
    icon: '🎯' 
  },
  completed: { 
    label: 'Completed', 
    color: 'green', 
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
    icon: '🎉' 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'red', 
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    icon: '❌' 
  }
};

// ============================================
// PARTNER STATUS
// ============================================
export const PARTNER_STATUS = {
  OFFLINE: 'offline',
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_DELIVERY: 'on_delivery'
};

// Partner Status Display Configuration
export const PARTNER_STATUS_DISPLAY = {
  offline: {
    label: 'Offline',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '⚫'
  },
  available: {
    label: 'Available',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '🟢'
  },
  busy: {
    label: 'Busy',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: '🟡'
  },
  on_delivery: {
    label: 'On Delivery',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '🔵'
  }
};

// ============================================
// FUEL TYPES
// ============================================
export const FUEL_TYPES = {
  DIESEL: 'diesel',
  PETROL: 'petrol'
};

// Fuel Type Display Configuration
export const FUEL_TYPE_DISPLAY = {
  diesel: { 
    name: 'Diesel', 
    icon: '🛢️', 
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  petrol: { 
    name: 'Petrol', 
    icon: '⛽', 
    color: 'from-red-500 to-pink-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-100'
  }
};

// ============================================
// PAYMENT STATUS
// ============================================
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment Status Display
export const PAYMENT_STATUS_DISPLAY = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    icon: '⏳'
  },
  completed: {
    label: 'Completed',
    color: 'green',
    icon: '✅'
  },
  failed: {
    label: 'Failed',
    color: 'red',
    icon: '❌'
  },
  refunded: {
    label: 'Refunded',
    color: 'blue',
    icon: '↩️'
  }
};

// ============================================
// PAYMENT METHODS
// ============================================
export const PAYMENT_METHODS = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card',
  ONLINE: 'online',
  WALLET: 'wallet'
};

// ============================================
// KYC STATUS
// ============================================
export const KYC_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// KYC Status Display
export const KYC_STATUS_DISPLAY = {
  pending: {
    label: 'Pending',
    color: 'gray',
    icon: '⏳'
  },
  under_review: {
    label: 'Under Review',
    color: 'blue',
    icon: '🔍'
  },
  approved: {
    label: 'Approved',
    color: 'green',
    icon: '✅'
  },
  rejected: {
    label: 'Rejected',
    color: 'red',
    icon: '❌'
  }
};

// ============================================
// VEHICLE TYPES
// ============================================
export const VEHICLE_TYPES = {
  BIKE: 'bike',
  SCOOTER: 'scooter',
  CAR: 'car'
};

// Vehicle Type Display
export const VEHICLE_TYPE_DISPLAY = {
  bike: {
    label: 'Bike/Motorcycle',
    icon: '🏍️'
  },
  scooter: {
    label: 'Scooter',
    icon: '🛵'
  },
  car: {
    label: 'Car',
    icon: '🚗'
  }
};

// ============================================
// APP SETTINGS
// ============================================
export const APP_SETTINGS = {
  MAX_FUEL_LIMIT: 5, // Liters
  MIN_FUEL_LIMIT: 0.5, // Liters
  DELIVERY_RADIUS_KM: 5, // Kilometers
  EMERGENCY_FEE: 50, // INR
  MIN_ORDER_AMOUNT: 100, // INR
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10
};

// ============================================
// DELIVERY CHARGES
// ============================================
export const DELIVERY_CHARGES = {
  BASE_CHARGE: 30, // Base charge in INR
  PER_KM_CHARGE: 10, // Per km in INR
  MAX_DELIVERY_CHARGE: 100 // Maximum cap in INR
};

// ============================================
// TIME CONSTANTS
// ============================================
export const TIME_CONSTANTS = {
  ESTIMATED_DELIVERY_TIME: 45, // minutes
  ORDER_AUTO_CANCEL_TIME: 30, // minutes
  PARTNER_ACCEPT_TIMEOUT: 5, // minutes
  LOCATION_UPDATE_INTERVAL: 30000, // milliseconds (30 seconds)
  ORDER_REFRESH_INTERVAL: 15000, // milliseconds (15 seconds)
  AVAILABLE_ORDERS_POLL_INTERVAL: 15000, // milliseconds (15 seconds)
  PARTNER_ORDERS_POLL_INTERVAL: 30000 // milliseconds (30 seconds)
};

// ============================================
// ROUTES
// ============================================
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_PHONE: '/verify-phone',
  LOGOUT: '/logout',
  
  // Main
  DASHBOARD: '/dashboard',
  AVAILABLE_ORDERS: '/available-orders',
  MY_ORDERS: '/my-orders',
  ACTIVE_DELIVERY: '/active-delivery',
  ORDER_HISTORY: '/order-history',
  EARNINGS: '/earnings',
  PROFILE: '/profile',
  SUPPORT: '/support',
  SETTINGS: '/settings'
};

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  USER_PHONE: 'userPhone',
  USER_DATA: 'userData',
  TEMP_PHONE: 'tempPhone',
  TEMP_REGISTRATION: 'tempRegistration',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// ============================================
// REGEX PATTERNS
// ============================================
export const REGEX_PATTERNS = {
  PHONE: /^[6-9]\d{9}$/, // Indian mobile number
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  OTP: /^\d{6}$/,
  AADHAAR: /^\d{12}$/,
  VEHICLE_NUMBER: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
  LICENSE_NUMBER: /^[A-Z]{2}[0-9]{13}$/
};

// ============================================
// ERROR MESSAGES
// ============================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_PHONE: 'Please enter a valid 10-digit mobile number.',
  INVALID_OTP: 'Please enter a valid 6-digit OTP.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  LOCATION_DENIED: 'Location permission denied. Please enable location access.',
  NO_ORDERS_AVAILABLE: 'No orders available at the moment.',
  ORDER_FAILED: 'Failed to process order. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  PARTNER_NOT_FOUND: 'Partner not found. Please register.',
  KYC_NOT_APPROVED: 'Your KYC is not approved yet.',
  PARTNER_BLOCKED: 'Your account has been blocked. Contact support.'
};

// ============================================
// SUCCESS MESSAGES
// ============================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  OTP_SENT: 'OTP sent successfully!',
  ORDER_ACCEPTED: 'Order accepted successfully!',
  ORDER_STARTED: 'Delivery started!',
  ORDER_COMPLETED: 'Order completed successfully!',
  ORDER_CANCELLED: 'Order cancelled.',
  LOCATION_UPDATED: 'Location updated!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  AVAILABILITY_UPDATED: 'Availability updated!'
};

// ============================================
// NOTIFICATION TYPES
// ============================================
export const NOTIFICATION_TYPES = {
  NEW_ORDER: 'new_order',
  ORDER_UPDATE: 'order_update',
  DELIVERY_UPDATE: 'delivery_update',
  EARNING_UPDATE: 'earning_update',
  SYSTEM_ALERT: 'system_alert'
};

// ============================================
// DEFAULT VALUES
// ============================================
export const DEFAULT_LOCATION = {
  latitude: 13.0827,
  longitude: 80.2707,
  city: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India'
};

// ============================================
// CONTACT INFO
// ============================================
export const CONTACT_INFO = {
  SUPPORT_PHONE: '+91 88888 88888',
  SUPPORT_EMAIL: 'support@petrogo.com',
  EMERGENCY_PHONE: '911'
};

// ============================================
// APP INFO
// ============================================
export const APP_INFO = {
  NAME: 'PetroGo Partner',
  VERSION: '1.0.0',
  DESCRIPTION: 'Emergency Fuel Delivery - Partner App',
  COPYRIGHT: `© ${new Date().getFullYear()} PetroGo. All rights reserved.`
};