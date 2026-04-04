/**
 * Formatters
 * Date, currency, and other formatting utilities
 * Location: partner/src/utils/formatters.js
 */

// ============================================
// DATE & TIME FORMATTERS
// ============================================

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'en-IN')
 * @returns {string} Formatted date
 */
export const formatDate = (date, locale = 'en-IN') => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Date format error:', error);
    return '-';
  }
};

/**
 * Format time to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'en-IN')
 * @returns {string} Formatted time
 */
export const formatTime = (date, locale = 'en-IN') => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Time format error:', error);
    return '-';
  }
};

/**
 * Format date and time together
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'en-IN')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, locale = 'en-IN') => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('DateTime format error:', error);
    return '-';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return formatDate(date);
  } catch (error) {
    console.error('Relative time format error:', error);
    return '-';
  }
};

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '-';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min${mins > 1 ? 's' : ''}`;
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  
  return `${hours}h ${mins}m`;
};

// ============================================
// CURRENCY FORMATTERS
// ============================================

/**
 * Format currency (INR)
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show ₹ symbol
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return showSymbol ? '₹0' : '0';
  
  try {
    const rounded = Math.round(amount);
    const formatted = rounded.toLocaleString('en-IN');
    return showSymbol ? `₹${formatted}` : formatted;
  } catch (error) {
    console.error('Currency format error:', error);
    return showSymbol ? '₹0' : '0';
  }
};

/**
 * Format amount with decimal places
 * @param {number} amount - Amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount, decimals = 2) => {
  if (amount === null || amount === undefined) return '0.00';
  
  try {
    return amount.toFixed(decimals);
  } catch (error) {
    console.error('Amount format error:', error);
    return '0.00';
  }
};

// ============================================
// DISTANCE FORMATTERS
// ============================================

/**
 * Format distance in kilometers
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (km) => {
  if (!km || km < 0) return '-';
  
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  
  return `${km.toFixed(1)} km`;
};

// ============================================
// PHONE NUMBER FORMATTERS
// ============================================

/**
 * Format phone number (Indian format)
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  // If already has country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Mask phone number (show last 4 digits)
 * @param {string} phone - Phone number
 * @returns {string} Masked phone number
 */
export const maskPhoneNumber = (phone) => {
  if (!phone) return '-';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `******${cleaned.slice(-4)}`;
  }
  
  return phone;
};

// ============================================
// VEHICLE NUMBER FORMATTERS
// ============================================

/**
 * Format vehicle number
 * @param {string} vehicleNumber - Vehicle number
 * @returns {string} Formatted vehicle number
 */
export const formatVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber) return '-';
  
  // Convert to uppercase and remove spaces
  const cleaned = vehicleNumber.toUpperCase().replace(/\s/g, '');
  
  // Format as TN 01 AB 1234
  if (cleaned.length >= 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
  }
  
  return cleaned;
};

// ============================================
// PERCENTAGE FORMATTERS
// ============================================

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

// ============================================
// RATING FORMATTERS
// ============================================

/**
 * Format rating
 * @param {number} rating - Rating value
 * @param {number} maxRating - Maximum rating (default: 5)
 * @returns {string} Formatted rating
 */
export const formatRating = (rating, maxRating = 5) => {
  if (!rating || rating < 0) return '0.0';
  
  return `${Math.min(rating, maxRating).toFixed(1)}`;
};

/**
 * Get star display for rating
 * @param {number} rating - Rating value
 * @returns {string} Star emoji string
 */
export const getStarDisplay = (rating) => {
  if (!rating || rating < 0) return '☆☆☆☆☆';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '⯨' : '') + 
         '☆'.repeat(emptyStars);
};

// ============================================
// FUEL QUANTITY FORMATTERS
// ============================================

/**
 * Format fuel quantity
 * @param {number} liters - Fuel quantity in liters
 * @returns {string} Formatted fuel quantity
 */
export const formatFuelQuantity = (liters) => {
  if (!liters || liters < 0) return '-';
  
  return `${liters.toFixed(1)}L`;
};

// ============================================
// ORDER NUMBER FORMATTERS
// ============================================

/**
 * Format order number
 * @param {string} orderNumber - Order number
 * @returns {string} Formatted order number
 */
export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '-';
  
  // If order number is long, show shortened version
  if (orderNumber.length > 12) {
    return `${orderNumber.slice(0, 6)}...${orderNumber.slice(-4)}`;
  }
  
  return orderNumber;
};

// ============================================
// TEXT FORMATTERS
// ============================================

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 * @param {string} text - Text to capitalize
 * @returns {string} Title cased text
 */
export const titleCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatCurrency,
  formatAmount,
  formatDistance,
  formatPhoneNumber,
  maskPhoneNumber,
  formatVehicleNumber,
  formatPercentage,
  formatRating,
  getStarDisplay,
  formatFuelQuantity,
  formatOrderNumber,
  capitalize,
  titleCase,
  truncate
};