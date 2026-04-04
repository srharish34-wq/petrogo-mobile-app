/**
 * Constants & Enums
 * Application-wide constants and enumerations
 * Location: admin/src/utils/constants.js
 */

/**
 * ORDER STATUSES
 */
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PARTNER_ASSIGNED: 'partner_assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  partner_assigned: 'Partner Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

/**
 * ORDER STATUS COLORS
 */
export const ORDER_STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  partner_assigned: 'info',
  picked_up: 'info',
  in_transit: 'info',
  delivered: 'success',
  completed: 'success',
  cancelled: 'danger'
};

/**
 * PAYMENT STATUSES
 */
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded'
};

/**
 * PAYMENT METHODS
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
  WALLET: 'wallet'
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  online: 'Online',
  wallet: 'Wallet'
};

/**
 * USER STATUSES
 */
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

export const USER_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended'
};

/**
 * USER ROLES
 */
export const USER_ROLES = {
  CUSTOMER: 'customer',
  DELIVERY_PARTNER: 'delivery_partner',
  BUNK_OWNER: 'bunk_owner',
  ADMIN: 'admin',
  SUPERUSER: 'superuser'
};

export const USER_ROLE_LABELS = {
  customer: 'Customer',
  delivery_partner: 'Delivery Partner',
  bunk_owner: 'Bunk Owner',
  admin: 'Admin',
  superuser: 'Superuser'
};

/**
 * PARTNER STATUSES
 */
export const PARTNER_STATUSES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  ON_DELIVERY: 'on_delivery',
  AVAILABLE: 'available'
};

export const PARTNER_STATUS_LABELS = {
  online: 'Online',
  offline: 'Offline',
  on_delivery: 'On Delivery',
  available: 'Available'
};

/**
 * KYC STATUSES
 */
export const KYC_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const KYC_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected'
};

/**
 * BUNK STATUSES
 */
export const BUNK_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOW_STOCK: 'low_stock',
  MAINTENANCE: 'maintenance'
};

export const BUNK_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  low_stock: 'Low Stock',
  maintenance: 'Maintenance'
};

/**
 * FUEL TYPES
 */
export const FUEL_TYPES = {
  PETROL: 'petrol',
  DIESEL: 'diesel'
};

export const FUEL_TYPE_LABELS = {
  petrol: 'Petrol',
  diesel: 'Diesel'
};

/**
 * VEHICLE TYPES
 */
export const VEHICLE_TYPES = {
  BIKE: 'bike',
  CAR: 'car',
  VAN: 'van',
  TRUCK: 'truck'
};

export const VEHICLE_TYPE_LABELS = {
  bike: 'Bike',
  car: 'Car',
  van: 'Van',
  truck: 'Truck'
};

/**
 * PERMISSIONS
 */
export const PERMISSIONS = {
  // Users
  MANAGE_USERS: 'manage_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_USER: 'view_user',

  // Orders
  MANAGE_ORDERS: 'manage_orders',
  CREATE_ORDER: 'create_order',
  EDIT_ORDER: 'edit_order',
  DELETE_ORDER: 'delete_order',
  VIEW_ORDER: 'view_order',
  CANCEL_ORDER: 'cancel_order',

  // Partners
  MANAGE_PARTNERS: 'manage_partners',
  APPROVE_KYC: 'approve_kyc',
  REJECT_KYC: 'reject_kyc',
  VIEW_PARTNER: 'view_partner',

  // Bunks
  MANAGE_BUNKS: 'manage_bunks',
  CREATE_BUNK: 'create_bunk',
  EDIT_BUNK: 'edit_bunk',
  DELETE_BUNK: 'delete_bunk',
  VIEW_BUNK: 'view_bunk',

  // Payments
  MANAGE_PAYMENTS: 'manage_payments',
  PROCESS_REFUND: 'process_refund',
  VIEW_PAYMENT: 'view_payment',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_REPORTS: 'export_reports',

  // Settings
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_SETTINGS: 'view_settings'
};

/**
 * API ENDPOINTS
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/admin/login',
  LOGOUT: '/admin/logout',
  REFRESH_TOKEN: '/admin/refresh-token',
  GET_CURRENT_ADMIN: '/admin/me',

  // Users
  GET_USERS: '/admin/users',
  CREATE_USER: '/admin/users',
  GET_USER: '/admin/users/:id',
  UPDATE_USER: '/admin/users/:id',
  DELETE_USER: '/admin/users/:id',

  // Orders
  GET_ORDERS: '/admin/orders',
  CREATE_ORDER: '/admin/orders',
  GET_ORDER: '/admin/orders/:id',
  UPDATE_ORDER: '/admin/orders/:id',
  DELETE_ORDER: '/admin/orders/:id',

  // Partners
  GET_PARTNERS: '/admin/partners',
  CREATE_PARTNER: '/admin/partners',
  GET_PARTNER: '/admin/partners/:id',
  UPDATE_PARTNER: '/admin/partners/:id',
  DELETE_PARTNER: '/admin/partners/:id',
  APPROVE_KYC: '/admin/partners/:id/kyc/approve',
  REJECT_KYC: '/admin/partners/:id/kyc/reject',

  // Bunks
  GET_BUNKS: '/admin/bunks',
  CREATE_BUNK: '/admin/bunks',
  GET_BUNK: '/admin/bunks/:id',
  UPDATE_BUNK: '/admin/bunks/:id',
  DELETE_BUNK: '/admin/bunks/:id',

  // Payments
  GET_PAYMENTS: '/admin/payments',
  GET_PAYMENT: '/admin/payments/:id',
  PROCESS_REFUND: '/admin/payments/:id/refund'
};

/**
 * PAGINATION DEFAULTS
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_LIMITS: [10, 25, 50, 100]
};

/**
 * SORTING DEFAULTS
 */
export const SORTING = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
};

/**
 * VALIDATION RULES
 */
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MAX_EMAIL_LENGTH: 100,
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_IMAGE_MB: 2
};

/**
 * ALLOWED FILE TYPES
 */
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.ms-excel'],
  CSV: ['text/csv', 'application/vnd.ms-excel'],
  JSON: ['application/json'],
  ALL: ['*/*']
};

/**
 * TIME CONSTANTS
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

/**
 * DATE FORMATS
 */
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  ISO: 'YYYY-MM-DD',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm'
};

/**
 * NOTIFICATION TYPES
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * HTTP STATUS CODES
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * ERROR MESSAGES
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.'
};

/**
 * SUCCESS MESSAGES
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  SUBMITTED: 'Submitted successfully!',
  APPROVED: 'Approved successfully!',
  REJECTED: 'Rejected successfully!'
};

/**
 * CURRENCY
 */
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  LOCALE: 'en-IN'
};

/**
 * REGEX PATTERNS
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
  URL: /^https?:\/\/.+/,
  VEHICLE_NUMBER: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/,
  PINCODE: /^[0-9]{6}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^[0-9]+$/,
  ALPHA: /^[a-zA-Z\s]+$/
};

/**
 * LOCAL STORAGE KEYS
 */
export const LOCAL_STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken',
  ADMIN_DATA: 'adminData',
  ADMIN_THEME: 'adminTheme',
  ADMIN_PREFERENCES: 'adminPreferences'
};

/**
 * ENVIRONMENT VARIABLES
 */
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

/**
 * FEATURE FLAGS
 */
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_BULK_ACTIONS: true
};

/**
 * ROUTES
 */
export const ROUTES = {
  // Public
  LOGIN: '/admin/login',
  LOGOUT: '/admin/logout',

  // Admin
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  ORDERS: '/admin/orders',
  PAYMENTS: '/admin/payments',
  PARTNERS: '/admin/partners',
  BUNKS: '/admin/bunks',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings'
};

/**
 * DEFAULT VALUES
 */
export const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_RETRIES: 3,
  REQUEST_TIMEOUT: 30000,
  NOTIFICATION_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 500
};

/**
 * Export all constants
 */
export default {
  // Statuses
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  USER_STATUSES,
  USER_STATUS_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  PARTNER_STATUSES,
  PARTNER_STATUS_LABELS,
  KYC_STATUSES,
  KYC_STATUS_LABELS,
  BUNK_STATUSES,
  BUNK_STATUS_LABELS,

  // Types
  FUEL_TYPES,
  FUEL_TYPE_LABELS,
  VEHICLE_TYPES,
  VEHICLE_TYPE_LABELS,

  // Configuration
  PERMISSIONS,
  API_ENDPOINTS,
  PAGINATION,
  SORTING,
  VALIDATION_RULES,
  ALLOWED_FILE_TYPES,
  TIME,
  DATE_FORMATS,
  NOTIFICATION_TYPES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CURRENCY,
  REGEX,
  LOCAL_STORAGE_KEYS,
  ENVIRONMENT,
  FEATURE_FLAGS,
  ROUTES,
  DEFAULTS
};