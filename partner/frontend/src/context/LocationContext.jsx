/**
 * Location Context
 * Global location tracking state management (Demo Mode)
 * Location: partner/src/context/LocationContext.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const LocationContext = createContext(null);

/**
 * Location Provider Component
 */
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with demo location (Chennai)
  useEffect(() => {
    const demoLocation = {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Chennai, Tamil Nadu',
      timestamp: new Date()
    };
    
    setLocation(demoLocation);
    console.log('✅ Location initialized (demo mode):', demoLocation);
  }, []);

  // Start tracking location
  const startTracking = () => {
    console.log('📍 Location tracking started (demo mode)');
    setTracking(true);
    
    // Update location every 30 seconds (demo mode - just update timestamp)
    const interval = setInterval(() => {
      setLocation(prev => ({
        ...prev,
        timestamp: new Date()
      }));
      console.log('📍 Location updated (demo mode)');
    }, 30000);

    return () => clearInterval(interval);
  };

  // Stop tracking location
  const stopTracking = () => {
    console.log('📍 Location tracking stopped');
    setTracking(false);
  };

  // Update location manually
  const updateLocation = (lat, lng, address) => {
    const newLocation = {
      latitude: lat,
      longitude: lng,
      address: address || location?.address,
      timestamp: new Date()
    };
    setLocation(newLocation);
    console.log('✅ Location updated manually:', newLocation);
  };

  const locationData = {
    location,
    tracking,
    error,
    startTracking,
    stopTracking,
    updateLocation
  };

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Custom hook to use Location Context
 */
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  
  return context;
};

export default LocationContext;