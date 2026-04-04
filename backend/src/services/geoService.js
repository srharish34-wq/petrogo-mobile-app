/**
 * Geo Service
 * Handles geospatial calculations and location services
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [longitude, latitude]
 * @param {Array} coord2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate delivery charge based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {Object} Charge breakdown
 */
const calculateDeliveryCharge = (distance) => {
  const { DELIVERY_CHARGES } = require('../config/constants');
  
  const baseCharge = DELIVERY_CHARGES.BASE_CHARGE;
  const perKmCharge = DELIVERY_CHARGES.PER_KM_CHARGE;
  const maxCharge = DELIVERY_CHARGES.MAX_DELIVERY_CHARGE;
  
  // Calculate charge
  let charge = baseCharge + (distance * perKmCharge);
  
  // Apply maximum cap
  charge = Math.min(charge, maxCharge);
  
  return {
    distance: distance,
    baseCharge: baseCharge,
    perKmCharge: perKmCharge,
    calculatedCharge: Math.round(charge * 100) / 100,
    appliedCap: charge >= maxCharge
  };
};

/**
 * Check if coordinates are within delivery radius
 * @param {Array} center - Center coordinates [longitude, latitude]
 * @param {Array} point - Point coordinates [longitude, latitude]
 * @param {number} radius - Radius in kilometers
 * @returns {boolean} True if within radius
 */
const isWithinRadius = (center, point, radius) => {
  const distance = calculateDistance(center, point);
  return distance <= radius;
};

/**
 * Get coordinates from address (Mock - integrate with Google Maps Geocoding API)
 * @param {string} address - Address string
 * @returns {Object} Coordinates
 */
const geocodeAddress = async (address) => {
  try {
    // In production, use Google Maps Geocoding API
    // const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    //   params: { address, key: apiKey }
    // });
    
    // Mock response for now
    console.log(`🗺️ Geocoding address: ${address}`);
    
    return {
      success: true,
      coordinates: [80.2707, 13.0827], // Chennai coordinates as default
      formattedAddress: address
    };
  } catch (error) {
    console.error('Geocoding Error:', error);
    return {
      success: false,
      error: 'Failed to geocode address'
    };
  }
};

/**
 * Get address from coordinates (Reverse Geocoding)
 * @param {number} longitude
 * @param {number} latitude
 * @returns {Object} Address details
 */
const reverseGeocode = async (longitude, latitude) => {
  try {
    // In production, use Google Maps Geocoding API
    console.log(`🗺️ Reverse geocoding: ${latitude}, ${longitude}`);
    
    // Mock response
    return {
      success: true,
      address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600001'
    };
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    return {
      success: false,
      error: 'Failed to reverse geocode'
    };
  }
};

/**
 * Calculate ETA (Estimated Time of Arrival)
 * @param {number} distance - Distance in kilometers
 * @param {string} vehicleType - Type of vehicle (bike, car, etc.)
 * @returns {number} ETA in minutes
 */
const calculateETA = (distance, vehicleType = 'bike') => {
  // Average speeds (km/h)
  const speeds = {
    bike: 30,
    scooter: 25,
    car: 40
  };
  
  const speed = speeds[vehicleType] || speeds.bike;
  
  // Calculate time in hours, convert to minutes
  const timeInHours = distance / speed;
  const timeInMinutes = timeInHours * 60;
  
  // Add buffer time (5 minutes for pickup, 5 for delivery)
  const totalTime = timeInMinutes + 10;
  
  return Math.ceil(totalTime);
};

/**
 * Find nearest location from array of locations
 * @param {Array} origin - Origin coordinates [longitude, latitude]
 * @param {Array} locations - Array of locations with coordinates
 * @returns {Object} Nearest location with distance
 */
const findNearest = (origin, locations) => {
  if (!locations || locations.length === 0) {
    return null;
  }
  
  let nearest = null;
  let minDistance = Infinity;
  
  locations.forEach(location => {
    const distance = calculateDistance(origin, location.coordinates);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        ...location,
        distance
      };
    }
  });
  
  return nearest;
};

/**
 * Sort locations by distance from origin
 * @param {Array} origin - Origin coordinates [longitude, latitude]
 * @param {Array} locations - Array of locations with coordinates
 * @returns {Array} Sorted locations with distances
 */
const sortByDistance = (origin, locations) => {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(origin, location.coordinates)
    }))
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Validate coordinates
 * @param {number} longitude
 * @param {number} latitude
 * @returns {boolean} True if valid
 */
const validateCoordinates = (longitude, latitude) => {
  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
};

/**
 * Format coordinates for display
 * @param {Array} coordinates - [longitude, latitude]
 * @returns {string} Formatted string
 */
const formatCoordinates = (coordinates) => {
  const [lon, lat] = coordinates;
  return `${lat.toFixed(6)}°N, ${lon.toFixed(6)}°E`;
};

module.exports = {
  calculateDistance,
  calculateDeliveryCharge,
  isWithinRadius,
  geocodeAddress,
  reverseGeocode,
  calculateETA,
  findNearest,
  sortByDistance,
  validateCoordinates,
  formatCoordinates
};