/**
 * Location Picker Component - FIXED VERSION
 * Shows real address, nearby bunks list, and interactive map
 * Location: frontend/src/components/maps/LocationPicker.jsx
 */

import { useState, useEffect, useRef } from 'react';
import { bunkService } from '../../services/bunkService';
import Button from '../common/Button';

// ✅ FIXED: Helper to safely convert address to string
const safeAddressString = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.landmark) parts.push(address.landmark);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    if (address.country) parts.push(address.country);
    return parts.filter(Boolean).join(', ');
  }
  return String(address);
};

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const [location, setLocation] = useState(initialLocation || null);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBunks, setLoadingBunks] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nearbyBunks, setNearbyBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState(null);
  
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const infoWindowRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc';

  /**
   * Get address from coordinates using Google Geocoding
   */
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) throw new Error('Failed to fetch address');

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error getting address:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  /**
   * Find nearby bunks and display them on map
   */
  const findAndDisplayBunks = async (latitude, longitude) => {
    try {
      setLoadingBunks(true);
      console.log('🔍 Searching for bunks near:', latitude, longitude);
      
      const response = await bunkService.findNearbyBunks(
        latitude,
        longitude,
        'petrol',
        2
      );

      const bunks = response?.data?.bunks || [];
      console.log('✅ Found bunks:', bunks.length);
      
      setNearbyBunks(bunks);
      
      if (bunks.length > 0 && mapRef.current) {
        displayBunkMarkers(bunks);
      }
      
      setLoadingBunks(false);
      return bunks;
    } catch (err) {
      console.warn('⚠️ Could not fetch bunks:', err);
      setNearbyBunks([]);
      setLoadingBunks(false);
      return [];
    }
  };

  /**
   * Display bunk markers on map
   */
  const displayBunkMarkers = (bunks) => {
    if (!mapRef.current || !window.google) return;

    // Clear existing bunk markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create info window if it doesn't exist
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    // Add marker for each bunk
    bunks.forEach((bunk, index) => {
      const position = {
        lat: bunk.location.coordinates[1], // latitude
        lng: bunk.location.coordinates[0]  // longitude
      };

      // ✅ FIXED: Safely get bunk address
      const bunkAddress = safeAddressString(bunk.address);
      const bunkDistance = bunk.distance?.toCustomer ? bunk.distance.toCustomer.toFixed(2) : 'N/A';

      // Create custom marker icon for bunks
      const marker = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
        title: bunk.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">⛽</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        },
        animation: window.google.maps.Animation.DROP
      });

      // Add click listener to show info
      marker.addListener('click', () => {
        const content = `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              ${bunk.name || 'Unnamed Bunk'}
            </h3>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              📍 ${bunkAddress}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #6b7280;">
              📏 ${bunkDistance} km away
            </p>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 4px 0; font-size: 13px; color: #059669;">
                ⛽ Petrol: ₹${bunk.fuelAvailability?.petrol?.price || 'N/A'}/L
              </p>
              <p style="margin: 4px 0; font-size: 13px; color: #059669;">
                🛢️ Diesel: ₹${bunk.fuelAvailability?.diesel?.price || 'N/A'}/L
              </p>
            </div>
            <button 
              onclick="window.selectBunkFromMap(${index})"
              style="
                margin-top: 12px;
                width: 100%;
                padding: 8px;
                background: #ea580c;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-size: 13px;
              "
            >
              Select This Bunk
            </button>
          </div>
        `;
        
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Make selectBunk function globally available
    window.selectBunkFromMap = (index) => {
      handleBunkSelect(bunks[index]);
      infoWindowRef.current.close();
    };
  };

  /**
   * Handle bunk selection
   */
  const handleBunkSelect = (bunk) => {
    setSelectedBunk(bunk);
    console.log('✅ Bunk selected:', bunk.name);
    
    // Pan map to selected bunk
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: bunk.location.coordinates[1],
        lng: bunk.location.coordinates[0]
      });
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

        // Get real address
        const addressResult = await getAddressFromCoordinates(coords.latitude, coords.longitude);
        setAddress(addressResult);

        // Find nearby bunks automatically
        await findAndDisplayBunks(coords.latitude, coords.longitude);

        // Update map center
        if (mapRef.current) {
          mapRef.current.setCenter({ lat: coords.latitude, lng: coords.longitude });
          
          // Update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition({ lat: coords.latitude, lng: coords.longitude });
          }
        }

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

  /**
   * Initialize Google Map
   */
  const initializeMap = () => {
    if (!window.google || !document.getElementById('map')) return;

    const centerLat = location?.latitude || 13.0827;
    const centerLng = location?.longitude || 80.2707;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: centerLat, lng: centerLng },
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true
    });

    mapRef.current = map;

    // Add user location marker
    userMarkerRef.current = new window.google.maps.Marker({
      position: { lat: centerLat, lng: centerLng },
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="2"/>
            <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">📍</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    // Handle map click
    map.addListener('click', async (mapsMouseEvent) => {
      const clickedLat = mapsMouseEvent.latLng.lat();
      const clickedLng = mapsMouseEvent.latLng.lng();

      setLocation({
        latitude: clickedLat,
        longitude: clickedLng
      });

      // Update user marker
      userMarkerRef.current.setPosition({ lat: clickedLat, lng: clickedLng });

      // Get real address
      const addressResult = await getAddressFromCoordinates(clickedLat, clickedLng);
      setAddress(addressResult);

      // Find bunks
      await findAndDisplayBunks(clickedLat, clickedLng);
    });

    console.log('✅ Map initialized');
  };

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
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

  // Auto-get location on mount
  useEffect(() => {
    if (!initialLocation && mapLoaded) {
      getCurrentLocation();
    }
  }, [mapLoaded]);

  /**
   * ✅ FIXED: Handle confirm location - ensure all data is strings
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

    // ✅ FIXED: Ensure everything is a string
    onLocationSelect({
      coordinates: [location.latitude, location.longitude],
      address: String(address.trim()), // ✅ Force string
      landmark: String(landmark.trim()), // ✅ Force string
      selectedBunk: selectedBunk
    });
  };

  return (
    <div className="space-y-6">
      {/* Google Map Container */}
      <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden border-2 border-blue-300 shadow-lg">
        <div id="map" className="h-96 w-full"></div>

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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

      {/* Nearby Bunks Section */}
      {loadingBunks && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-700">Finding nearby petrol bunks...</p>
        </div>
      )}

      {!loadingBunks && nearbyBunks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              ⛽ {nearbyBunks.length} Petrol Bunk{nearbyBunks.length > 1 ? 's' : ''} Nearby
            </h3>
          </div>

          {/* Bunks List */}
          <div className="grid grid-cols-1 gap-3">
            {nearbyBunks.map((bunk, index) => {
              const bunkAddress = safeAddressString(bunk.address);
              const bunkDistance = bunk.distance?.toCustomer ? bunk.distance.toCustomer.toFixed(2) : 'N/A';
              
              return (
                <div
                  key={bunk._id || index}
                  onClick={() => handleBunkSelect(bunk)}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all
                    ${selectedBunk?._id === bunk._id
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-green-500 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⛽</span>
                        <h4 className="font-bold text-gray-900">{bunk.name || 'Unnamed Bunk'}</h4>
                        {selectedBunk?._id === bunk._id && (
                          <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                            SELECTED
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">📍 {bunkAddress}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-700">
                          📏 {bunkDistance} km
                        </span>
                        {bunk.rating?.average > 0 && (
                          <span className="text-yellow-600">
                            ⭐ {bunk.rating.average.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-semibold">⛽ Petrol:</span>
                          <span className="font-bold text-gray-900">₹{bunk.fuelAvailability?.petrol?.price || 'N/A'}/L</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700 font-semibold">🛢️ Diesel:</span>
                          <span className="font-bold text-gray-900">₹{bunk.fuelAvailability?.diesel?.price || 'N/A'}/L</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {selectedBunk?._id === bunk._id ? (
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loadingBunks && nearbyBunks.length === 0 && location && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-yellow-800">
            ⚠️ No petrol bunks found nearby. You can still place an order and we'll find the nearest available bunk.
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
            placeholder="Enter your complete address"
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
            placeholder="e.g., Near Apollo Hospital"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
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
        Confirm Location & Continue
      </Button>
    </div>
  );
}