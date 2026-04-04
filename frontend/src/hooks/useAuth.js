/**
 * useAuth Hook
 * Authentication state and methods
 */

import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();
      const currentUser = authService.getCurrentUser();
      
      setIsLoggedIn(loggedIn);
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'userPhone' || e.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login method
  const login = async (phone, otp, name) => {
    try {
      const response = await authService.verifyOTP(phone, otp, name);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout method
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    if (!user?.phone) return;

    try {
      const response = await authService.getProfile(user.phone);
      if (response.status === 'success') {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    refreshUser
  };
}