/**
 * Axios API Instance
 * Reused from customer frontend
 * Location: partner/src/services/api.js
 */

import axios from 'axios';

// ✅ Create Axios instance with base configuration
const api = axios.create({
  baseURL: '/api/v1', // Relative URL - Vite proxy will forward to backend
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: 30000 // 30 seconds
});

// ✅ Request Interceptor - Add auth headers
api.interceptors.request.use(
  (config) => {
    // Add phone number to headers if available
    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) {
      config.headers['x-user-phone'] = userPhone;
    }

    // Add partner ID to headers if available
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const partner = JSON.parse(userData);
        if (partner._id) {
          config.headers['x-partner-id'] = partner._id;
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    console.log('📡 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response.data; // Return only data part
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);

    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }

    // Return standardized error
    return Promise.reject(error.response?.data || { 
      status: 'error', 
      message: error.message || 'Network error. Please try again.' 
    });
  }
);

export default api;