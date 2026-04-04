/**
 * Location Picker Component - FIXED VERSION
 * Allows user to select delivery location
 * Location: frontend/src/components/order/LocationPicker.jsx
 */

import { useState, useEffect } from 'react';
import Button from '../common/Button';

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const [location, setLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  /**
   * Get address from coordinates
   */
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (!response.ok) throw new Error('Failed to fetch address');

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Error getting address:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  /**
   * Find nearby bunks
   */
  const findNearbyBunks = async (latitude, longitude) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bunks/findNearby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          latitude,
          longitude,
          fuelType: 'petrol',
          quantity: 0,
          maxDistance: 20,
          maxResults: 5
        })
      });

      if (!response.ok) {
        console.warn('Bunks API not available yet');
        return;
      }

      const data = await response.json();
      console.log('Bunks found:', data);
    } catch (err) {
      console.warn('Bunks search skipped:', err.message);
    }
  };

  /**
   * Get current location
   */
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        setLocation(coords);

        try {
          const addressResult = await getAddressFromCoordinates(coords.latitude, coords.longitude);
          setAddress(addressResult);
        } catch (err) {
          console.error('Error getting address:', err);
          setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
        }

        // Find nearby bunks
        await findNearbyBunks(coords.latitude, coords.longitude);

        console.log('📍 Current Location:', coords);
        setLoading(false);
      },
      (error) => {
        setError('Unable to get your location. Please enter manually.');
        setLoading(false);
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Auto-get location on mount
  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, []);

  // Load Google Map on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc`;
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  /**
   * Initialize Google Map
   */
  const initializeMap = () => {
    if (!window.google || !document.getElementById('map')) return;

    const centerLat = location?.latitude || 13.0827;
    const centerLng = location?.longitude || 80.2707;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat: centerLat, lng: centerLng },
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false
    });

    // Add marker for selected location
    if (location) {
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        title: 'Selected Location'
      });
    }

    // Handle map click
    map.addListener('click', async (mapsMouseEvent) => {
      const clickedLat = mapsMouseEvent.latLng.lat();
      const clickedLng = mapsMouseEvent.latLng.lng();

      setLocation({
        latitude: clickedLat,
        longitude: clickedLng
      });

      try {
        const addressResult = await getAddressFromCoordinates(clickedLat, clickedLng);
        setAddress(addressResult);
      } catch (err) {
        setAddress(`${clickedLat.toFixed(6)}, ${clickedLng.toFixed(6)}`);
      }

      await findNearbyBunks(clickedLat, clickedLng);
    });

    console.log('✅ Map initialized');
  };

  // Reinitialize map when location changes
  useEffect(() => {
    if (mapLoaded && document.getElementById('map')) {
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [mapLoaded, location]);

  /**
   * Handle confirm location
   */
  const handleConfirm = () => {
    if (!location) {
      setError('Please select a location');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your address');
      return;
    }

    onLocationSelect({
      coordinates: [location.longitude, location.latitude],
      address: address.trim(),
      landmark: landmark.trim()
    });
  };

  return (
    <div className="space-y-6">
      {/* Google Map Container */}
      <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden border-2 border-blue-300 shadow-lg">
        <div id="map" className="h-80 w-full"></div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium text-gray-700">
                Getting your location...
              </p>
            </div>
          </div>
        )}

        {/* Get Location Button */}
        {!loading && (
          <button
            onClick={getCurrentLocation}
            className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg transition flex items-center space-x-2 z-20"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-medium">Use My Location</span>
          </button>
        )}
      </div>

      {/* Current Location Info */}
      {location && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">📍 Location Selected:</span> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        </div>
      )}

      {/* Address Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Address *
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete address (e.g., 123 Main Street, Anna Nagar, Chennai)"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g., Near Apollo Hospital, Behind Big Bazaar"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        variant="primary"
        size="lg"
        fullWidth
        disabled={!location || !address.trim()}
      >
        Confirm Location
      </Button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Location Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Make sure location access is enabled in your browser</li>
              <li>Click "Use My Location" to auto-detect your position</li>
              <li>Or click on the map to select a delivery location</li>
              <li>Provide a detailed address for accurate delivery</li>
              <li>Add landmarks to help delivery partner find you easily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}