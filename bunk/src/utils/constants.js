/**
 * Constants
 * Location: bunk/src/utils/constants.js
 */

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  READY_FOR_PICKUP: 'ready_for_pickup',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

export const ORDER_STATUS_DISPLAY = {
  pending: 'New Order',
  accepted: 'Accepted',
  ready_for_pickup: 'Ready for Pickup',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected'
};

export const FUEL_TYPES = {
  PETROL: 'petrol',
  DIESEL: 'diesel'
};

export const FUEL_TYPE_DISPLAY = {
  petrol: 'Petrol',
  diesel: 'Diesel'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHOD = {
  CASH: 'cash',
  ONLINE: 'online',
  UPI: 'upi',
  CARD: 'card'
};

export const REJECTION_REASONS = [
  { id: 'out_of_stock', label: '⛽ Fuel Out of Stock' },
  { id: 'technical_issue', label: '🔧 Technical Issue' },
  { id: 'maintenance', label: '🚧 Under Maintenance' },
  { id: 'delivery_unavailable', label: '🚫 Delivery Not Available' },
  { id: 'other', label: '📝 Other Reason' }
];

export const STOCK_ALERT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  CRITICAL: 'critical'
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const PREPARATION_TIME_OPTIONS = [10, 15, 20, 30];

export const DATE_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

export const API_ENDPOINTS = {
  LOGIN: '/bunks/login',
  LOGOUT: '/bunks/logout',
  ORDERS: '/bunks/orders',
  STOCK: '/bunks/stock',
  EARNINGS: '/bunks/earnings',
  PROFILE: '/bunks/me'
};

export const POLLING_INTERVALS = {
  ORDERS: 30000,
  STOCK: 60000,
  EARNINGS: 120000
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default {
  ORDER_STATUS,
  ORDER_STATUS_DISPLAY,
  FUEL_TYPES,
  FUEL_TYPE_DISPLAY,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  REJECTION_REASONS,
  STOCK_ALERT_LEVELS,
  DAYS_OF_WEEK,
  PREPARATION_TIME_OPTIONS,
  DATE_FILTERS,
  API_ENDPOINTS,
  POLLING_INTERVALS,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES
};