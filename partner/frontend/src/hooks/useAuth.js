/**
 * useAuth Hook
 * Authentication and user management (ULTRA FIXED)
 * Location: partner/src/hooks/useAuth.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const hasInitialized = useRef(false); // Prevent double initialization
  
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage - ONLY ONCE
  useEffect(() => {
    // Prevent double initialization
    if (hasInitialized.current) {
      console.log('⚠️ Skipping duplicate auth initialization');
      return;
    }

    console.log('🔄 First time auth initialization starting...');
    hasInitialized.current = true;

    const initializeAuth = () => {
      try {
        console.log('🔍 Checking auth state...');
        
        const userPhone = localStorage.getItem('userPhone');
        const userData = localStorage.getItem('userData');

        console.log('📦 LocalStorage check:', { 
          hasPhone: !!userPhone, 
          hasUserData: !!userData,
          phone: userPhone,
          dataLength: userData ? userData.length : 0
        });

        if (userPhone && userData) {
          try {
            const parsedData = JSON.parse(userData);
            
            console.log('✅ Successfully parsed user data');
            console.log('👤 User name:', parsedData.name);
            console.log('📱 Phone:', parsedData.phone);
            
            // Set both user and partner from the same data
            const userObj = {
              _id: parsedData._id,
              phone: parsedData.phone,
              name: parsedData.name,
              email: parsedData.email,
              role: 'partner'
            };
            
            setUser(userObj);
            setPartner(parsedData);
            setIsAuthenticated(true);
            
            console.log('✅ Auth state set successfully!');
            console.log('🔐 isAuthenticated: true');
          } catch (parseErr) {
            console.error('❌ JSON parse error:', parseErr);
            console.error('📄 Raw data:', userData.substring(0, 100));
            // Don't clear data - might be temporary issue
            setIsAuthenticated(false);
          }
        } else {
          console.log('❌ No auth data found');
          console.log('  - userPhone:', userPhone);
          console.log('  - userData:', userData ? 'exists' : 'null');
          setIsAuthenticated(false);
          setUser(null);
          setPartner(null);
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        setError('Failed to initialize authentication');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - run ONLY ONCE

  /**
   * Logout
   */
  const logout = useCallback(() => {
    try {
      console.log('🚪 Logging out...');
      
      // Clear localStorage
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userData');
      localStorage.removeItem('tempPhone');
      localStorage.removeItem('tempRegistration');
      localStorage.removeItem('devOTP');

      // Reset state
      setUser(null);
      setPartner(null);
      setIsAuthenticated(false);
      setError(null);

      console.log('✅ Logout successful');

      // Redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  }, [navigate]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = localStorage.getItem('userData');
      const userPhone = localStorage.getItem('userPhone');
      
      console.log('🔄 Refreshing user data...');
      
      if (!userData || !userPhone) {
        console.error('❌ No data to refresh');
        return { success: false, error: 'No user data found' };
      }

      const parsedData = JSON.parse(userData);
      
      const userObj = {
        _id: parsedData._id,
        phone: parsedData.phone,
        name: parsedData.name,
        email: parsedData.email,
        role: 'partner'
      };
      
      setUser(userObj);
      setPartner(parsedData);
      setIsAuthenticated(true);

      console.log('✅ User data refreshed');
      return { success: true, data: parsedData };

    } catch (err) {
      console.error('❌ Refresh error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return {
    // State
    user,
    partner,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    logout,
    refreshUser
  };
};