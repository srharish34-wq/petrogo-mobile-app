/**
 * Storage Helper
 * localStorage wrapper with error handling
 * Location: partner/src/utils/storage.js
 */

import { STORAGE_KEYS } from './constants';

// ============================================
// BASIC STORAGE OPERATIONS
// ============================================

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} True if successful
 */
export const setItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    console.log(`✅ Stored: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error storing ${key}:`, error);
    return false;
  }
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Stored value or default value
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }

    // Try to parse as JSON, if fails return as string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`❌ Error reading ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    console.log(`✅ Removed: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing ${key}:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} True if successful
 */
export const clear = () => {
  try {
    localStorage.clear();
    console.log('✅ Storage cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if exists
 */
export const hasItem = (key) => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`❌ Error checking ${key}:`, error);
    return false;
  }
};

// ============================================
// USER DATA STORAGE
// ============================================

/**
 * Save user phone number
 * @param {string} phone - Phone number
 * @returns {boolean} True if successful
 */
export const saveUserPhone = (phone) => {
  return setItem(STORAGE_KEYS.USER_PHONE, phone);
};

/**
 * Get user phone number
 * @returns {string|null} Phone number or null
 */
export const getUserPhone = () => {
  return getItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Remove user phone number
 * @returns {boolean} True if successful
 */
export const removeUserPhone = () => {
  return removeItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Save user data
 * @param {Object} userData - User data object
 * @returns {boolean} True if successful
 */
export const saveUserData = (userData) => {
  return setItem(STORAGE_KEYS.USER_DATA, userData);
};

/**
 * Get user data
 * @returns {Object|null} User data or null
 */
export const getUserData = () => {
  return getItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Remove user data
 * @returns {boolean} True if successful
 */
export const removeUserData = () => {
  return removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Update user data (merge with existing)
 * @param {Object} updates - Updates to merge
 * @returns {boolean} True if successful
 */
export const updateUserData = (updates) => {
  try {
    const currentData = getUserData() || {};
    const updatedData = { ...currentData, ...updates };
    return saveUserData(updatedData);
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    return false;
  }
};

// ============================================
// AUTH STORAGE
// ============================================

/**
 * Save temporary phone (for OTP verification)
 * @param {string} phone - Phone number
 * @returns {boolean} True if successful
 */
export const saveTempPhone = (phone) => {
  return setItem(STORAGE_KEYS.TEMP_PHONE, phone);
};

/**
 * Get temporary phone
 * @returns {string|null} Phone number or null
 */
export const getTempPhone = () => {
  return getItem(STORAGE_KEYS.TEMP_PHONE);
};

/**
 * Remove temporary phone
 * @returns {boolean} True if successful
 */
export const removeTempPhone = () => {
  return removeItem(STORAGE_KEYS.TEMP_PHONE);
};

/**
 * Save temporary registration data
 * @param {Object} data - Registration data
 * @returns {boolean} True if successful
 */
export const saveTempRegistration = (data) => {
  return setItem(STORAGE_KEYS.TEMP_REGISTRATION, data);
};

/**
 * Get temporary registration data
 * @returns {Object|null} Registration data or null
 */
export const getTempRegistration = () => {
  return getItem(STORAGE_KEYS.TEMP_REGISTRATION);
};

/**
 * Remove temporary registration data
 * @returns {boolean} True if successful
 */
export const removeTempRegistration = () => {
  return removeItem(STORAGE_KEYS.TEMP_REGISTRATION);
};

/**
 * Clear all auth data
 * @returns {boolean} True if successful
 */
export const clearAuthData = () => {
  try {
    removeUserPhone();
    removeUserData();
    removeTempPhone();
    removeTempRegistration();
    console.log('✅ Auth data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

// ============================================
// SETTINGS STORAGE
// ============================================

/**
 * Save theme preference
 * @param {string} theme - Theme ('light' or 'dark')
 * @returns {boolean} True if successful
 */
export const saveTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Get theme preference
 * @returns {string} Theme ('light' or 'dark')
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'light');
};

/**
 * Save language preference
 * @param {string} language - Language code
 * @returns {boolean} True if successful
 */
export const saveLanguage = (language) => {
  return setItem(STORAGE_KEYS.LANGUAGE, language);
};

/**
 * Get language preference
 * @returns {string} Language code
 */
export const getLanguage = () => {
  return getItem(STORAGE_KEYS.LANGUAGE, 'en');
};

// ============================================
// CACHE MANAGEMENT
// ============================================

/**
 * Set cached data with expiry
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {boolean} True if successful
 */
export const setCachedData = (key, data, expiryMinutes = 60) => {
  try {
    const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
    const cacheObject = {
      data,
      expiry: expiryTime
    };
    return setItem(`cache_${key}`, cacheObject);
  } catch (error) {
    console.error(`❌ Error caching ${key}:`, error);
    return false;
  }
};

/**
 * Get cached data (returns null if expired)
 * @param {string} key - Cache key
 * @returns {any} Cached data or null
 */
export const getCachedData = (key) => {
  try {
    const cacheObject = getItem(`cache_${key}`);
    
    if (!cacheObject) return null;

    // Check if expired
    if (Date.now() > cacheObject.expiry) {
      removeItem(`cache_${key}`);
      return null;
    }

    return cacheObject.data;
  } catch (error) {
    console.error(`❌ Error reading cache ${key}:`, error);
    return null;
  }
};

/**
 * Clear all cached data
 * @returns {boolean} True if successful
 */
export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        removeItem(key);
      }
    });
    console.log('✅ Cache cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    return false;
  }
};

// ============================================
// STORAGE INFO
// ============================================

/**
 * Get storage size (approximate)
 * @returns {number} Size in bytes
 */
export const getStorageSize = () => {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    console.error('❌ Error calculating storage size:', error);
    return 0;
  }
};

/**
 * Get storage size in human-readable format
 * @returns {string} Size with unit (KB or MB)
 */
export const getStorageSizeFormatted = () => {
  const bytes = getStorageSize();
  
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

/**
 * Get all storage keys
 * @returns {Array} Array of keys
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('❌ Error getting keys:', error);
    return [];
  }
};

/**
 * Get number of items in storage
 * @returns {number} Number of items
 */
export const getItemCount = () => {
  try {
    return localStorage.length;
  } catch (error) {
    console.error('❌ Error counting items:', error);
    return 0;
  }
};

// ============================================
// BACKUP & RESTORE
// ============================================

/**
 * Export all storage data
 * @returns {Object} All storage data
 */
export const exportStorage = () => {
  try {
    const data = {};
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = getItem(key);
      }
    }
    console.log('✅ Storage exported');
    return data;
  } catch (error) {
    console.error('❌ Error exporting storage:', error);
    return {};
  }
};

/**
 * Import storage data
 * @param {Object} data - Data to import
 * @returns {boolean} True if successful
 */
export const importStorage = (data) => {
  try {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        setItem(key, data[key]);
      }
    }
    console.log('✅ Storage imported');
    return true;
  } catch (error) {
    console.error('❌ Error importing storage:', error);
    return false;
  }
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  // Basic operations
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem,
  
  // User data
  saveUserPhone,
  getUserPhone,
  removeUserPhone,
  saveUserData,
  getUserData,
  removeUserData,
  updateUserData,
  
  // Auth data
  saveTempPhone,
  getTempPhone,
  removeTempPhone,
  saveTempRegistration,
  getTempRegistration,
  removeTempRegistration,
  clearAuthData,
  
  // Settings
  saveTheme,
  getTheme,
  saveLanguage,
  getLanguage,
  
  // Cache
  setCachedData,
  getCachedData,
  clearCache,
  
  // Storage info
  getStorageSize,
  getStorageSizeFormatted,
  getAllKeys,
  getItemCount,
  
  // Backup & restore
  exportStorage,
  importStorage
};