/**
 * AuthContext
 * Location: bunk/src/context/AuthContext.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

  const refreshBunk = async () => {
    const response = await authService.getCurrentBunk();
    setBunk(response.data?.bunk);
    return response.data?.bunk;
  };

  const value = {
    isAuthenticated,
    bunk,
    loading,
    login,
    logout,
    updateBunk,
    refreshBunk,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;