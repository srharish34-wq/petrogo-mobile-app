/**
 * useLocation Hook
 * GPS location tracking and management
 * Location: partner/src/hooks/useLocation.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { locationService } from '../services/locationService';

export const useLocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    updateInterval = 5000, // Update every 5 seconds
    autoStart = false,
    onLocationChange = null,
    onError = null
  } = options;

  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  const watchIdRef = useRef(null);
  const updateIntervalRef = useRef(null);

  /**
   * Get current location once
   */
  const getCurrentLocation = useCallback(async () => {
    try {
      setError(null);

      const position = await locationService.getCurrentLocation();

      const locationData = {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        timestamp: position.timestamp
      };

      setLocation(locationData);
      setAccuracy(position.accuracy);
      setLastUpdate(new Date());

      console.log('✅ Location obtained:', locationData);
      
      if (onLocationChange) {
        onLocationChange(locationData);
      }

      return locationData;
    } catch (err) {
      console.error('❌ Get location error:', err);
      setError(err.message);
      
      if (onError) {
        onError(err);
      }

      throw err;
    }
  }, [onLocationChange, onError]);

  /**
   * Start tracking location continuously
   */
  const startTracking = useCallback(() => {
    if (isTracking) {
      console.warn('⚠️ Location tracking already started');
      return;
    }

    try {
      setIsTracking(true);
      setError(null);

      console.log('📍 Starting location tracking...');

      // Start watching location
      const watchId = locationService.watchLocation(
        (position) => {
          const locationData = {
            latitude: position.latitude,
            longitude: position.longitude,
            accuracy: position.accuracy,
            timestamp: position.timestamp
          };

          setLocation(locationData);
          setAccuracy(position.accuracy);
          setLastUpdate(new Date());

          if (onLocationChange) {
            onLocationChange(locationData);
          }

          console.log('📍 Location updated:', locationData);
        },
        (err) => {
          console.error('❌ Location watch error:', err);
          setError(err.message);
          
          if (onError) {
            onError(err);
          }
        }
      );

      watchIdRef.current = watchId;

      // Also set up periodic updates
      updateIntervalRef.current = setInterval(async () => {
        try {
          await getCurrentLocation();
        } catch (err) {
          console.error('❌ Periodic location update error:', err);
        }
      }, updateInterval);

      console.log('✅ Location tracking started');
    } catch (err) {
      console.error('❌ Start tracking error:', err);
      setError(err.message);
      setIsTracking(false);
    }
  }, [isTracking, updateInterval, getCurrentLocation, onLocationChange, onError]);

  /**
   * Stop tracking location
   */
  const stopTracking = useCallback(() => {
    if (!isTracking) {
      console.warn('⚠️ Location tracking not active');
      return;
    }

    try {
      // Stop watching
      if (watchIdRef.current !== null) {
        locationService.stopWatchingLocation(watchIdRef.current);
        watchIdRef.current = null;
      }

      // Clear interval
      if (updateIntervalRef.current !== null) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      setIsTracking(false);
      console.log('⏸️ Location tracking stopped');
    } catch (err) {
      console.error('❌ Stop tracking error:', err);
    }
  }, [isTracking]);

  /**
   * Check location permission status
   */
  const checkPermission = useCallback(async () => {
    try {
      const status = await locationService.checkLocationPermission();
      setPermissionStatus(status);
      return status;
    } catch (err) {
      console.error('❌ Check permission error:', err);
      return 'unknown';
    }
  }, []);

  /**
   * Request location permission
   */
  const requestPermission = useCallback(async () => {
    try {
      const granted = await locationService.requestLocationPermission();
      
      if (granted) {
        setPermissionStatus('granted');
        await getCurrentLocation();
      } else {
        setPermissionStatus('denied');
      }

      return granted;
    } catch (err) {
      console.error('❌ Request permission error:', err);
      setPermissionStatus('denied');
      return false;
    }
  }, [getCurrentLocation]);

  /**
   * Get accuracy level
   */
  const getAccuracyLevel = useCallback(() => {
    return locationService.getAccuracyLevel(accuracy);
  }, [accuracy]);

  /**
   * Calculate distance from current location
   */
  const calculateDistanceFrom = useCallback((targetLat, targetLng) => {
    if (!location) return null;

    return locationService.calculateDistance(
      location.latitude,
      location.longitude,
      targetLat,
      targetLng
    );
  }, [location]);

  /**
   * Get address from current location
   */
  const getCurrentAddress = useCallback(async () => {
    if (!location) return null;

    try {
      const address = await locationService.getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );
      return address;
    } catch (err) {
      console.error('❌ Get address error:', err);
      return null;
    }
  }, [location]);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [autoStart]); // Only run on mount

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    // State
    location,
    isTracking,
    error,
    accuracy,
    lastUpdate,
    permissionStatus,

    // Actions
    getCurrentLocation,
    startTracking,
    stopTracking,
    checkPermission,
    requestPermission,

    // Utilities
    getAccuracyLevel,
    calculateDistanceFrom,
    getCurrentAddress
  };
};