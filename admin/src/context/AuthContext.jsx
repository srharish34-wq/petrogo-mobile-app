/**
 * Auth Context
 * Global authentication state management
 * Location: admin/src/context/AuthContext.jsx
 */

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { adminAuth } from '../services/adminService';

/**
 * Create Auth Context
 */
export const AuthContext = createContext(null);

/**
 * Auth Context Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const token = localStorage.getItem('adminToken');
        const adminData = localStorage.getItem('adminData');

        if (token && adminData) {
          try {
            const parsedAdmin = JSON.parse(adminData);
            setAdmin(parsedAdmin);
            setIsLoggedIn(true);

            // Try to refresh token silently
            try {
              await adminAuth.refreshToken();
            } catch (err) {
              console.warn('Token refresh failed:', err);
              // Continue with existing token
            }
          } catch (err) {
            console.error('Error parsing admin data:', err);
            logout();
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
      } finally {
        setIsCheckingAuth(false);
        setLoading(false);
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
        setError(null);

        return {
          success: true,
          message: 'Login successful',
          data: adminData
        };
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);

        return {
          success: false,
          message: errorMessage
        };
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
      try {
        await adminAuth.logout();
      } catch (err) {
        console.warn('Logout API error:', err);
        // Continue with logout even if API fails
      }

      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      // Reset state
      setAdmin(null);
      setIsLoggedIn(false);
      setError(null);

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (err) {
      const errorMessage = err.message || 'Logout failed';
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
   * Update admin profile
   */
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedAdmin = {
        ...admin,
        ...profileData
      };

      // Save to localStorage
      localStorage.setItem('adminData', JSON.stringify(updatedAdmin));

      setAdmin(updatedAdmin);
      setError(null);

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      if (response && response.status === 'success' && response.data.token) {
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

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Context value
   */
  const value = {
    // State
    admin,
    isLoggedIn,
    loading,
    error,
    isCheckingAuth,

    // Methods
    login,
    logout,
    updateProfile,
    changePassword,
    refreshToken,

    // Permissions
    hasPermission,
    hasRole,
    isSuperUser,

    // Utilities
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;