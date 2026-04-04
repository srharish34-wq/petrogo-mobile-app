/**
 * Location Service
 * GPS tracking and location utilities
 * Location: partner/src/services/locationService.js
 */

import api from './api';

export const locationService = {
  /**
   * Get current device location using Geolocation API
   * Returns: { latitude, longitude, accuracy, timestamp }
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          resolve({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            timestamp: new Date(position.timestamp)
          });
          
          console.log('✅ Location obtained:', latitude, longitude);
        },
        (error) => {
          let errorMessage = 'Unable to get location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location.';
          }
          
          console.error('❌ Location Error:', errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  /**
   * Watch location continuously
   * Returns watchId that can be used to stop watching
   */
  watchLocation: (onSuccess, onError) => {
    if (!navigator.geolocation) {
      if (onError) onError(new Error('Geolocation not supported'));
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        if (onSuccess) {
          onSuccess({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            timestamp: new Date(position.timestamp)
          });
        }
      },
      (error) => {
        if (onError) {
          onError(new Error('Location watch error: ' + error.message));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    console.log('📍 Started watching location, watchId:', watchId);
    return watchId;
  },

  /**
   * Stop watching location
   */
  stopWatchingLocation: (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      console.log('⏸️ Stopped watching location');
    }
  },

  /**
   * Update partner location to backend
   * PATCH /api/v1/partners/:partnerId/location
   */
  updatePartnerLocation: async (partnerId, latitude, longitude, address = '') => {
    try {
      const response = await api.patch(`/partners/${partnerId}/location`, {
        longitude,
        latitude,
        address
      });
      
      return response;
    } catch (error) {
      console.error('❌ Update partner location error:', error);
      throw error;
    }
  },

  /**
   * Calculate distance between two coordinates (in kilometers)
   * Uses Haversine formula
   */
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  },

  /**
   * Calculate estimated time based on distance
   * Assumes average speed of 40 km/h
   */
  calculateEstimatedTime: (distanceInKm, averageSpeed = 40) => {
    const timeInHours = distanceInKm / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    return timeInMinutes;
  },

  /**
   * Get address from coordinates using Reverse Geocoding
   * Uses OpenStreetMap Nominatim API (free, no key required)
   */
  getAddressFromCoordinates: async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'PetroGo-Partner-App'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      // Extract relevant address components
      const address = {
        full: data.display_name || '',
        road: data.address?.road || '',
        suburb: data.address?.suburb || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        postcode: data.address?.postcode || '',
        country: data.address?.country || 'India'
      };
      
      return address;
    } catch (error) {
      console.error('❌ Reverse geocoding error:', error);
      return {
        full: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        road: '',
        suburb: '',
        city: '',
        state: '',
        postcode: '',
        country: 'India'
      };
    }
  },

  /**
   * Check if location permissions are granted
   */
  checkLocationPermission: async () => {
    try {
      if (!navigator.permissions) {
        return 'unknown';
      }
      
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.error('❌ Permission check error:', error);
      return 'unknown';
    }
  },

  /**
   * Request location permission
   */
  requestLocationPermission: async () => {
    try {
      await locationService.getCurrentLocation();
      return true;
    } catch (error) {
      console.error('❌ Permission request error:', error);
      return false;
    }
  },

  /**
   * Format coordinates for display
   */
  formatCoordinates: (latitude, longitude, decimals = 6) => {
    return {
      latitude: latitude.toFixed(decimals),
      longitude: longitude.toFixed(decimals),
      formatted: `${latitude.toFixed(decimals)}, ${longitude.toFixed(decimals)}`
    };
  },

  /**
   * Check if coordinates are valid
   */
  isValidCoordinates: (latitude, longitude) => {
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  },

  /**
   * Get location accuracy level
   */
  getAccuracyLevel: (accuracy) => {
    if (accuracy < 10) return 'excellent';
    if (accuracy < 20) return 'good';
    if (accuracy < 50) return 'fair';
    return 'poor';
  }
};

export default locationService;