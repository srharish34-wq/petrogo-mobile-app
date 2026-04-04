/**
 * Location Context
 * Global location state management
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved locations:', err);
      }
    }
  }, []);

  // Check permission status
  useEffect(() => {
    if (!isSupported) return;

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);
          
          result.addEventListener('change', () => {
            setPermissionStatus(result.state);
          });
        })
        .catch(() => {
          // Permission API not supported
        });
    }
  }, [isSupported]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Geolocation is not supported by your browser';
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };

          setCurrentLocation(location);
          setLoading(false);
          resolve(location);
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              setPermissionStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'Unknown error occurred';
          }

          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [isSupported]);

  // Save location
  const saveLocation = useCallback((location, name) => {
    const newLocation = {
      id: Date.now(),
      name: name || 'Saved Location',
      ...location,
      savedAt: new Date().toISOString()
    };

    const updated = [...savedLocations, newLocation];
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));

    return newLocation;
  }, [savedLocations]);

  // Remove saved location
  const removeSavedLocation = useCallback((locationId) => {
    const updated = savedLocations.filter(loc => loc.id !== locationId);
    setSavedLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
  }, [savedLocations]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimals
  }, []);

  // Format coordinates for display
  const formatCoordinates = useCallback((lat, lon) => {
    return `${lat.toFixed(6)}°N, ${lon.toFixed(6)}°E`;
  }, []);

  // Reverse geocode (get address from coordinates)
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    // In production, use Google Maps Geocoding API
    // For now, return formatted coordinates
    return {
      address: formatCoordinates(latitude, longitude),
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    };
  }, [formatCoordinates]);

  // Clear current location
  const clearCurrentLocation = useCallback(() => {
    setCurrentLocation(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    currentLocation,
    savedLocations,
    loading,
    error,
    isSupported,
    permissionStatus,
    getCurrentLocation,
    saveLocation,
    removeSavedLocation,
    calculateDistance,
    formatCoordinates,
    reverseGeocode,
    clearCurrentLocation,
    clearError
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  
  return context;
};

export default LocationContext;