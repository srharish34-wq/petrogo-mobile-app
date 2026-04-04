/**
 * useLocation Hook
 * Geolocation functionality
 */

import { useState, useEffect, useCallback } from 'react';

export default function useLocation(options = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false, // Set to true for continuous tracking
    autoFetch = false // Set to true to fetch on mount
  } = options;

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // Check permission status
  useEffect(() => {
    if (!isSupported) return;

    // Check permission API if available
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

  // Get current position
  const getCurrentLocation = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by your browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };

          setLocation(locationData);
          setLoading(false);
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
              setPermissionStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
          }

          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      );
    });
  }, [isSupported, enableHighAccuracy, timeout, maximumAge]);

  // Watch position (continuous tracking)
  useEffect(() => {
    if (!isSupported || !watch) return;

    let watchId;

    const startWatching = () => {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };

          setLocation(locationData);
          setError(null);
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      );
    };

    startWatching();

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isSupported, watch, enableHighAccuracy, timeout, maximumAge]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && isSupported) {
      getCurrentLocation();
    }
  }, [autoFetch, isSupported, getCurrentLocation]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
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

  // Helper: Convert degrees to radians
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Clear location data
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    error,
    loading,
    isSupported,
    permissionStatus,
    getCurrentLocation,
    calculateDistance,
    clearLocation
  };
}