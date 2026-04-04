/**
 * API Configuration
 * Axios instance with interceptors for authentication and error handling
 * Location: bunk/src/services/api.js
 */

import axios from 'axios';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('bunkToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', response.config.url, response.data);
    }

    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      console.error('❌ API Error:', status, data);

      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('bunkToken');
          localStorage.removeItem('bunkData');
          window.location.href = '/login';
          break;

        case 403:
          console.error('Access forbidden');
          break;

        case 404:
          console.error('Resource not found');
          break;

        case 500:
          console.error('Server error');
          break;

        default:
          console.error('API error:', data.message || 'Unknown error');
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        errors: data.errors || null
      });
    } else if (error.request) {
      // Request made but no response
      console.error('❌ No response from server');
      return Promise.reject({
        status: 0,
        message: 'No response from server. Please check your connection.'
      });
    } else {
      // Error in request setup
      console.error('❌ Request setup error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'Request failed'
      });
    }
  }
);

// Export axios instance
export default api;

// Export base URL for use in other modules
export { API_BASE_URL };