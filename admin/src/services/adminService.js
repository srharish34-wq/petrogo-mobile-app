/**
 * Admin Service
 * Authentication API calls
 * Location: admin/src/services/adminService.js
 */

import api from './api';

/**
 * Admin Authentication Service
 */
export const adminAuth = {
  /**
   * Login admin user
   */
  login: async (email, password) => {
    try {
      // For development/testing: Mock login
      // Remove this in production and uncomment API call below
      
      if (email === 'admin@petrogo.com' && password === 'admin123') {
        return {
          status: 'success',
          message: 'Login successful',
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            admin: {
              id: 1,
              name: 'Admin User',
              email: email,
              role: 'admin',
              permissions: [
                'view_dashboard',
                'manage_users',
                'manage_orders',
                'manage_partners',
                'manage_payments',
                'view_analytics'
              ]
            }
          }
        };
      } else {
        return {
          status: 'error',
          message: 'Invalid email or password',
          data: null
        };
      }

      /* ==================== PRODUCTION API CALL ====================
      const response = await api.post('/auth/login', {
        email,
        password
      });

      return {
        status: 'success',
        message: 'Login successful',
        data: response.data
      };
      ==================== END PRODUCTION CALL ==================== */
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: error.message || 'Login failed',
        data: null
      };
    }
  },

  /**
   * Logout admin user
   */
  logout: async () => {
    try {
      // Optional: Call logout API endpoint
      // await api.post('/auth/logout');
      
      return {
        status: 'success',
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        status: 'error',
        message: error.message || 'Logout failed'
      };
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    try {
      // For mock: Just return success
      return {
        status: 'success',
        message: 'Token refreshed',
        data: {
          token: 'mock-jwt-token-' + Date.now()
        }
      };

      /* ==================== PRODUCTION API CALL ====================
      const response = await api.post('/auth/refresh-token');
      return response;
      ==================== END PRODUCTION CALL ==================== */
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        status: 'error',
        message: error.message || 'Token refresh failed'
      };
    }
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      return {
        status: 'success',
        message: 'Password changed successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to change password'
      };
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/request-password-reset', { email });

      return {
        status: 'success',
        message: 'Password reset email sent',
        data: response.data
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to request password reset'
      };
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });

      return {
        status: 'success',
        message: 'Password reset successful',
        data: response.data
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to reset password'
      };
    }
  },

  /**
   * Get current admin profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');

      return {
        status: 'success',
        message: 'Profile retrieved',
        data: response.data
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to get profile'
      };
    }
  },

  /**
   * Update admin profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);

      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to update profile'
      };
    }
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });

      return {
        status: 'success',
        message: 'Email verified successfully',
        data: response.data
      };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        status: 'error',
        message: error.message || 'Failed to verify email'
      };
    }
  }
};

export default adminAuth;