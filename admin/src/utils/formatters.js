/**
 * Formatters Utility
 * Functions for formatting data for display
 * Location: admin/src/utils/formatters.js
 */

/**
 * Format currency with rupees
 */
export const formatCurrency = (amount, decimals = 0) => {
  if (!amount && amount !== 0) return '₹0';

  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num, decimals = 0) => {
  if (!num && num !== 0) return '0';

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(parseFloat(num));
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';

  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Format date to readable format
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    const parts = {
      DD: day,
      MM: month,
      YYYY: year,
      D: dateObj.getDate(),
      M: dateObj.getMonth() + 1
    };

    let result = format;
    Object.entries(parts).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value);
    });

    return result;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (date, dateFormat = 'DD/MM/YYYY', timeFormat = 'HH:mm') => {
  if (!date) return '-';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';

    const formattedDate = formatDate(date, dateFormat);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    let time = timeFormat
      .replace('HH', hours)
      .replace('H', dateObj.getHours())
      .replace('mm', minutes)
      .replace('m', dateObj.getMinutes())
      .replace('ss', seconds)
      .replace('s', dateObj.getSeconds());

    return `${formattedDate} ${time}`;
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '-';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';

    const seconds = Math.floor((new Date() - dateObj) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
    return `${Math.floor(seconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '-';
  }
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';

  const cleaned = phone.toString().replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return phone;

  const [, part1, part2, part3] = match;
  if (!part2) return part1;
  if (!part3) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
};

/**
 * Format email (truncate if too long)
 */
export const formatEmail = (email, maxLength = 30) => {
  if (!email) return '-';

  if (email.length <= maxLength) return email;
  return `${email.substring(0, maxLength - 3)}...`;
};

/**
 * Format name (capitalize words)
 */
export const formatName = (name) => {
  if (!name) return '-';

  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format status with styling
 */
export const getStatusBadge = (status) => {
  const statusMap = {
    // Order statuses
    pending: { label: 'Pending', color: 'warning', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: 'info', icon: '✅' },
    partner_assigned: { label: 'Partner Assigned', color: 'info', icon: '👤' },
    picked_up: { label: 'Picked Up', color: 'info', icon: '📦' },
    in_transit: { label: 'In Transit', color: 'info', icon: '🚗' },
    delivered: { label: 'Delivered', color: 'success', icon: '✔️' },
    completed: { label: 'Completed', color: 'success', icon: '🎉' },
    cancelled: { label: 'Cancelled', color: 'danger', icon: '❌' },

    // User statuses
    active: { label: 'Active', color: 'success', icon: '🟢' },
    inactive: { label: 'Inactive', color: 'danger', icon: '⚫' },
    suspended: { label: 'Suspended', color: 'warning', icon: '🚫' },

    // KYC statuses
    approved: { label: 'Approved', color: 'success', icon: '✅' },
    rejected: { label: 'Rejected', color: 'danger', icon: '❌' },

    // Payment statuses
    paid: { label: 'Paid', color: 'success', icon: '✔️' },
    unpaid: { label: 'Unpaid', color: 'warning', icon: '⏳' },
    failed: { label: 'Failed', color: 'danger', icon: '❌' },
    refunded: { label: 'Refunded', color: 'info', icon: '↩️' },

    // Bunk statuses
    available: { label: 'Available', color: 'success', icon: '🟢' },
    low_stock: { label: 'Low Stock', color: 'warning', icon: '🟡' },
    maintenance: { label: 'Maintenance', color: 'info', icon: '🔧' },

    // Partner statuses
    online: { label: 'Online', color: 'success', icon: '🟢' },
    offline: { label: 'Offline', color: 'danger', icon: '⚫' },
    on_delivery: { label: 'On Delivery', color: 'info', icon: '🚗' }
  };

  return statusMap[status?.toLowerCase()] || { label: status || '-', color: 'gray', icon: '?' };
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  if (!address) return '-';

  const { street, city, state, pincode } = address;
  const parts = [street, city, state, pincode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '-';
};

/**
 * Format time duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format JSON for display
 */
export const formatJSON = (obj, indent = 2) => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    console.error('JSON formatting error:', error);
    return '{}';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text) return '-';

  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Format URL for display
 */
export const formatURL = (url) => {
  if (!url) return '-';

  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
};

/**
 * Format rating
 */
export const formatRating = (rating) => {
  if (!rating && rating !== 0) return '0⭐';

  const value = parseFloat(rating);
  return `${value.toFixed(1)}⭐`;
};

/**
 * Format vehicle number
 */
export const formatVehicleNumber = (number) => {
  if (!number) return '-';

  const cleaned = number.toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length < 10) return cleaned;

  // Format: TN01AB1234
  return `${cleaned.slice(0, 2)}${cleaned.slice(2, 4)}${cleaned.slice(4, 6)}${cleaned.slice(6)}`;
};

/**
 * Format distance
 */
export const formatDistance = (km) => {
  if (!km && km !== 0) return '0 km';

  const value = parseFloat(km);
  if (value >= 1) {
    return `${value.toFixed(1)} km`;
  }
  return `${Math.round(value * 1000)} m`;
};

/**
 * Format speed
 */
export const formatSpeed = (kmph) => {
  if (!kmph && kmph !== 0) return '0 km/h';

  return `${parseFloat(kmph).toFixed(1)} km/h`;
};

/**
 * Format litres
 */
export const formatLitres = (litres) => {
  if (!litres && litres !== 0) return '0 L';

  return `${parseFloat(litres).toFixed(2)} L`;
};

/**
 * Export all formatters
 */
export default {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatEmail,
  formatName,
  getStatusBadge,
  formatAddress,
  formatDuration,
  formatFileSize,
  formatJSON,
  truncateText,
  formatURL,
  formatRating,
  formatVehicleNumber,
  formatDistance,
  formatSpeed,
  formatLitres
};