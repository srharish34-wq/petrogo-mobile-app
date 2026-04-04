/**
 * LocationUpdater Component
 * Handle real-time location updates and tracking
 * Location: partner/src/components/maps/LocationUpdater.jsx
 */

import { useEffect, useState, useCallback } from 'react';
import { partnerService } from '../../services/partnerService';

export default function LocationUpdater({ 
  partnerId, 
  order,
  onLocationUpdate,
  updateInterval = 5000 // Update every 5 seconds
}) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current location using Geolocation API
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp: new Date()
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, []);

  // Update location to backend
  const updateLocationToBackend = useCallback(async (latitude, longitude, address = '') => {
    if (!partnerId || !order) return;

    try {
      setIsUpdating(true);
      const response = await partnerService.updateLocation(
        partnerId,
        latitude,
        longitude,
        address
      );

      console.log('✅ Location updated to backend:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating location:', error);
      setLocationError(error.message || 'Failed to update location');
    } finally {
      setIsUpdating(false);
    }
  }, [partnerId, order]);

  // Get reverse geocoding address
  const getAddressFromCoordinates = useCallback(async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.address?.road || data.address?.suburb || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.warn('Error getting address:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }, []);

  // Start tracking
  const startTracking = useCallback(async () => {
    try {
      setIsTracking(true);
      setLocationError('');
      console.log('📍 Starting location tracking...');

      // Get initial location
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setAccuracy(Math.round(location.accuracy));

      // Get address
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);

      // Update backend
      await updateLocationToBackend(location.latitude, location.longitude, address);

      // Notify parent component
      onLocationUpdate?.(location);
    } catch (error) {
      console.error('Error starting tracking:', error);
      setLocationError(error.message || 'Failed to get location. Please enable location services.');
      setIsTracking(false);
    }
  }, [getCurrentLocation, getAddressFromCoordinates, updateLocationToBackend, onLocationUpdate]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    console.log('⏸️ Location tracking stopped');
  }, []);

  // Auto-update location when tracking
  useEffect(() => {
    if (!isTracking || !order) return;

    const interval = setInterval(async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        setAccuracy(Math.round(location.accuracy));

        // Get address
        const address = await getAddressFromCoordinates(location.latitude, location.longitude);

        // Update backend
        await updateLocationToBackend(location.latitude, location.longitude, address);

        // Notify parent component
        onLocationUpdate?.(location);

        console.log(`📍 Location updated: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [
    isTracking,
    order,
    updateInterval,
    getCurrentLocation,
    getAddressFromCoordinates,
    updateLocationToBackend,
    onLocationUpdate
  ]);

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <div className={`rounded-xl shadow-md p-4 ${
        isTracking 
          ? 'bg-green-50 border-l-4 border-green-500' 
          : 'bg-gray-50 border-l-4 border-gray-500'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className={`font-bold ${isTracking ? 'text-green-700' : 'text-gray-700'}`}>
              {isTracking ? '🔴 Live Tracking' : '⚫ Tracking Inactive'}
            </p>
          </div>
          {isUpdating && <span className="text-sm text-gray-600">⏳ Updating...</span>}
        </div>

        {/* Current Coordinates */}
        {currentLocation && (
          <div className="bg-white rounded-lg p-3 mt-2">
            <p className="text-xs text-gray-600 mb-1">Current Location</p>
            <p className="text-sm font-mono text-gray-900">
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">Accuracy: {accuracy}m</span>
              <span className="text-xs text-gray-600">
                {new Date(currentLocation.timestamp).toLocaleTimeString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {locationError && (
          <div className="bg-red-100 text-red-700 text-xs p-2 rounded mt-2">
            ❌ {locationError}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={startTracking}
          disabled={isTracking || !order}
          className={`py-3 px-4 rounded-lg font-bold transition ${
            isTracking || !order
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isTracking ? '✓ Tracking' : '▶️ Start Tracking'}
        </button>
        <button
          onClick={stopTracking}
          disabled={!isTracking}
          className={`py-3 px-4 rounded-lg font-bold transition ${
            !isTracking
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isTracking ? '⏸️ Stop' : 'Stop Tracking'}
        </button>
      </div>

      {/* Accuracy Info */}
      {currentLocation && accuracy > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>📍 GPS Accuracy:</strong> ±{accuracy}m from actual location
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {accuracy < 10 && '✓ Excellent accuracy'}
            {accuracy >= 10 && accuracy < 20 && '✓ Good accuracy'}
            {accuracy >= 20 && accuracy < 50 && '⚠️ Fair accuracy'}
            {accuracy >= 50 && '⚠️ Low accuracy'}
          </p>
        </div>
      )}

      {/* Location Permissions Info */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
        <p className="text-xs font-bold text-yellow-900 mb-1">📍 Location Permissions</p>
        <p className="text-xs text-yellow-800">
          Make sure location permissions are enabled for accurate tracking. Check your device settings.
        </p>
      </div>

      {/* Live Status Badge */}
      {isTracking && (
        <div className="bg-green-100 rounded-lg p-3 text-center">
          <p className="text-sm font-bold text-green-700">
            🟢 You are live tracking. Customer can see your location.
          </p>
        </div>
      )}

      {/* Distance Info */}
      {currentLocation && order?.deliveryLocation?.coordinates && (
        <LocationDistance
          partnerLat={currentLocation.latitude}
          partnerLng={currentLocation.longitude}
          customerLat={order.deliveryLocation.coordinates[1]}
          customerLng={order.deliveryLocation.coordinates[0]}
        />
      )}
    </div>
  );
}

/**
 * Helper component to show distance between partner and customer
 */
function LocationDistance({ partnerLat, partnerLng, customerLat, customerLng }) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance = calculateDistance(partnerLat, partnerLng, customerLat, customerLng);
  const estimatedTime = Math.round((distance / 40) * 60); // Assuming 40 km/h average

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">Distance to Customer</p>
          <p className="text-2xl font-bold text-orange-600">{distance.toFixed(2)} km</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Estimated Time</p>
          <p className="text-lg font-bold text-blue-600">~{estimatedTime} min</p>
        </div>
      </div>
    </div>
  );
}