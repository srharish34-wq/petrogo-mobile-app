/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const loggedIn = authService.isLoggedIn();
      const currentUser = authService.getCurrentUser();
      
      setIsLoggedIn(loggedIn);
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();

    // Listen for storage changes (multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'userPhone' || e.key === 'userData') {
        initAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login
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
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update user
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Refresh user data
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

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

export default AuthContext;