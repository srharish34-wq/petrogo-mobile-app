/**
 * Partner Context
 * Global partner profile state management (Simplified)
 * Location: partner/src/context/PartnerContext.jsx
 */

import { createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';

// Create Context
const PartnerContext = createContext(null);

/**
 * Partner Provider Component
 */
export const PartnerProvider = ({ children }) => {
  const { partner, isAuthenticated, loading } = useAuthContext();

  console.log('🔧 PartnerContext state:', { 
    hasPartner: !!partner, 
    isAuthenticated, 
    loading 
  });

  // Simple pass-through - all data comes from AuthContext
  const partnerData = {
    partner,
    loading,
    error: null,
    fetchPartner: () => {
      console.log('ℹ️ fetchPartner called (using AuthContext data)');
    },
    updateAvailability: (isAvailable, status) => {
      console.log('✅ Availability would be updated:', { isAvailable, status });
    },
    updateLocation: (latitude, longitude) => {
      console.log('✅ Location would be updated:', { latitude, longitude });
    }
  };

  return (
    <PartnerContext.Provider value={partnerData}>
      {children}
    </PartnerContext.Provider>
  );
};

/**
 * Custom hook to use Partner Context
 */
export const usePartnerContext = () => {
  const context = useContext(PartnerContext);
  
  if (!context) {
    throw new Error('usePartnerContext must be used within PartnerProvider');
  }
  
  return context;
};

export default PartnerContext;