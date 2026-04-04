/**
 * useAuth Hook
 * Custom hook for authentication state management
 * Location: admin/src/hooks/useAuth.js
 */

import { useState, useCallback, useEffect } from 'react';
import { adminAuth } from '../services/adminService';

export const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');

      if (token && adminData) {
        try {
          setAdmin(JSON.parse(adminData));
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Error parsing admin data:', err);
          logout();
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuth.login(email, password);

      if (response.status === 'success' && response.data) {
        // Save token
        localStorage.setItem('adminToken', response.data.token);

        // Save admin data
        const adminData = response.data.admin || response.data;
        localStorage.setItem('adminData', JSON.stringify(adminData));

        setAdmin(adminData);
        setIsLoggedIn(true);

        return {
          success: true,
          message: 'Login successful'
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      setIsLoggedIn(false);

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Call logout API
      await adminAuth.logout();
    } catch (err) {
      console.error('Logout API error:', err);
      // Continue with logout even if API fails
    } finally {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      // Reset state
      setAdmin(null);
      setIsLoggedIn(false);
      setLoading(false);

      return {
        success: true,
        message: 'Logout successful'
      };
    }
  }, []);

  /**
   * Update admin profile
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      // Update admin data locally
      const updatedAdmin = {
        ...admin,
        ...profileData
      };

      // Save to localStorage
      localStorage.setItem('adminData', JSON.stringify(updatedAdmin));

      setAdmin(updatedAdmin);

      return {
        success: true,
        message: 'Profile updated successfully',
        data: updatedAdmin
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [admin]);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would call an API endpoint
      // For now, just simulate the change
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await adminAuth.refreshToken();

      if (response.status === 'success' && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return false;
    }
  }, [logout]);

  /**
   * Get current admin
   */
  const getCurrentAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuth.getCurrentAdmin();

      if (response.status === 'success' && response.data) {
        const adminData = response.data;
        localStorage.setItem('adminData', JSON.stringify(adminData));
        setAdmin(adminData);

        return {
          success: true,
          data: adminData
        };
      } else {
        throw new Error('Failed to fetch admin data');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch admin data';
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if admin has specific permission
   */
  const hasPermission = useCallback((permission) => {
    if (!admin || !admin.permissions) {
      return false;
    }

    return admin.permissions.includes(permission);
  }, [admin]);

  /**
   * Check if admin has specific role
   */
  const hasRole = useCallback((role) => {
    if (!admin) {
      return false;
    }

    return admin.role === role;
  }, [admin]);

  /**
   * Check if admin is superuser
   */
  const isSuperUser = useCallback(() => {
    return hasRole('superuser') || hasRole('admin');
  }, [hasRole]);

  return {
    // State
    admin,
    loading,
    error,
    isLoggedIn,

    // Methods
    login,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    getCurrentAdmin,

    // Permissions
    hasPermission,
    hasRole,
    isSuperUser
  };
};

export default useAuth;