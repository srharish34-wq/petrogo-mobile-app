/**
 * API Configuration
 * Centralized API setup with axios instance and interceptors
 * Location: admin/src/services/api.js
 */

import axios from 'axios';

// ✅ FIXED: Changed REACT_APP_API_URL to VITE_API_URL (Vite uses VITE_ prefix)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor
 * Attach auth token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle errors and token expiration
 */
api.interceptors.response.use(
  (response) => {
    // Success response
    return response.data || response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Token expired - redirect to login
      if (status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Server error
      if (status === 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      // Handle API error message
      const errorMessage = data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // No response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Request setup error
      return Promise.reject(new Error('Error setting up request'));
    }
  }
);

/**
 * API Methods
 * Wrapper methods for common HTTP operations
 */
export const apiMethods = {
  // GET request
  get: async (url, config = {}) => {
    try {
      return await api.get(url, config);
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      return await api.post(url, data, config);
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      return await api.put(url, data, config);
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      return await api.patch(url, data, config);
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      return await api.delete(url, config);
    } catch (error) {
      throw error;
    }
  }
};

export default api;