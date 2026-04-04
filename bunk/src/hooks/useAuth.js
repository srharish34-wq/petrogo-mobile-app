/**
 * useAuth Hook
 * Location: bunk/src/hooks/useAuth.js
 */

import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bunk, setBunk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    const authenticated = authService.isAuthenticated();
    const bunkData = authService.getBunkData();
    
    setIsAuthenticated(authenticated);
    setBunk(bunkData);
    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    checkAuth();
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setBunk(null);
  };

  const updateBunk = (updatedData) => {
    setBunk(updatedData);
    localStorage.setItem('bunkData', JSON.stringify(updatedData));
  };

  return {
    isAuthenticated,
    bunk,
    loading,
    login,
    logout,
    updateBunk,
    checkAuth
  };
};

export default useAuth;