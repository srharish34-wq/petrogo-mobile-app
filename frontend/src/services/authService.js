/**
 * Auth Service
 * Authentication API calls
 */

import api from './api';

export const authService = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (phone, otp, name) => {
    try {
      const response = await api.post('/auth/verify-otp', { 
        phone, 
        otp,
        name: name || `User${phone.slice(-4)}`
      });
      
      // Save user data
      if (response.status === 'success') {
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user profile
   */
  getProfile: async (phone) => {
    try {
      const response = await api.get(`/auth/profile/${phone}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (phone, data) => {
    try {
      const response = await api.patch(`/auth/profile/${phone}`, data);
      
      // Update local storage
      if (response.status === 'success') {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout
   */
  logout: async (phone) => {
    try {
      await api.post(`/auth/logout/${phone}`);
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      window.location.href = '/';
    } catch (error) {
      // Clear local data anyway
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem('userPhone');
  },

  /**
   * Get current user data
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};