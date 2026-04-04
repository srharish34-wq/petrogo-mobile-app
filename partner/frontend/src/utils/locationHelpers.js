/**
 * Location Helpers
 * Distance calculation and location utilities
 * Location: partner/src/utils/locationHelpers.js
 */

// ============================================
// DISTANCE CALCULATIONS
// ============================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Validate inputs
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    console.error('Invalid coordinates provided');
    return 0;
  }

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
 * Calculate distance from coordinates array
 * @param {Array} coords1 - [longitude, latitude]
 * @param {Array} coords2 - [longitude, latitude]
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceFromCoords = (coords1, coords2) => {
  if (!coords1 || !coords2 || coords1.length < 2 || coords2.length < 2) {
    return 0;
  }

  // coords format: [longitude, latitude]
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  return calculateDistance(lat1, lon1, lat2, lon2);
};

/**
 * Calculate distance from location objects
 * @param {Object} location1 - { latitude, longitude }
 * @param {Object} location2 - { latitude, longitude }
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceFromObjects = (location1, location2) => {
  if (!location1 || !location2) return 0;

  return calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
};

// ============================================
// TIME CALCULATIONS
// ============================================

/**
 * Calculate estimated time based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} averageSpeed - Average speed in km/h (default: 40)
 * @returns {number} Estimated time in minutes
 */
export const calculateEstimatedTime = (distanceKm, averageSpeed = 40) => {
  if (!distanceKm || distanceKm <= 0) return 0;

  const hours = distanceKm / averageSpeed;
  const minutes = Math.round(hours * 60);

  return minutes;
};

/**
 * Calculate ETA (Estimated Time of Arrival)
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} averageSpeed - Average speed in km/h
 * @returns {Date} ETA date object
 */
export const calculateETA = (distanceKm, averageSpeed = 40) => {
  const minutes = calculateEstimatedTime(distanceKm, averageSpeed);
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + minutes);

  return eta;
};

// ============================================
// COORDINATE VALIDATION
// ============================================

/**
 * Validate if coordinates are valid
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} True if valid
 */
export const isValidCoordinate = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Validate coordinates array
 * @param {Array} coords - [longitude, latitude]
 * @returns {boolean} True if valid
 */
export const isValidCoordinatesArray = (coords) => {
  if (!Array.isArray(coords) || coords.length < 2) return false;

  const [lon, lat] = coords;
  return isValidCoordinate(lat, lon);
};

// ============================================
// COORDINATE CONVERSION
// ============================================

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
export const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
export const toDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (latitude, longitude, decimals = 6) => {
  if (!isValidCoordinate(latitude, longitude)) {
    return 'Invalid coordinates';
  }

  return `${latitude.toFixed(decimals)}, ${longitude.toFixed(decimals)}`;
};

// ============================================
// BEARING CALCULATIONS
// ============================================

/**
 * Calculate bearing between two points
 * @param {number} lat1 - Start latitude
 * @param {number} lon1 - Start longitude
 * @param {number} lat2 - End latitude
 * @param {number} lon2 - End longitude
 * @returns {number} Bearing in degrees (0-360)
 */
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    return 0;
  }

  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
            Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

  const bearing = toDegrees(Math.atan2(y, x));

  return (bearing + 360) % 360; // Normalize to 0-360
};

/**
 * Get direction from bearing
 * @param {number} bearing - Bearing in degrees
 * @returns {string} Direction (N, NE, E, SE, S, SW, W, NW)
 */
export const getDirectionFromBearing = (bearing) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

// ============================================
// BOUNDS CALCULATIONS
// ============================================

/**
 * Calculate bounding box for a set of coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {Object} Bounding box {minLat, maxLat, minLng, maxLng}
 */
export const calculateBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const bounds = {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity
  };

  coordinates.forEach(coord => {
    if (coord.latitude < bounds.minLat) bounds.minLat = coord.latitude;
    if (coord.latitude > bounds.maxLat) bounds.maxLat = coord.latitude;
    if (coord.longitude < bounds.minLng) bounds.minLng = coord.longitude;
    if (coord.longitude > bounds.maxLng) bounds.maxLng = coord.longitude;
  });

  return bounds;
};

/**
 * Check if point is within bounds
 * @param {Object} point - {latitude, longitude}
 * @param {Object} bounds - {minLat, maxLat, minLng, maxLng}
 * @returns {boolean} True if within bounds
 */
export const isPointInBounds = (point, bounds) => {
  if (!point || !bounds) return false;

  return (
    point.latitude >= bounds.minLat &&
    point.latitude <= bounds.maxLat &&
    point.longitude >= bounds.minLng &&
    point.longitude <= bounds.maxLng
  );
};

// ============================================
// NEARBY LOCATION CHECKS
// ============================================

/**
 * Check if location is nearby (within radius)
 * @param {Object} location1 - {latitude, longitude}
 * @param {Object} location2 - {latitude, longitude}
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean} True if within radius
 */
export const isNearby = (location1, location2, radiusKm = 5) => {
  const distance = calculateDistanceFromObjects(location1, location2);
  return distance <= radiusKm;
};

/**
 * Find nearest location from a list
 * @param {Object} currentLocation - {latitude, longitude}
 * @param {Array} locations - Array of {latitude, longitude} objects
 * @returns {Object} Nearest location with distance
 */
export const findNearestLocation = (currentLocation, locations) => {
  if (!currentLocation || !locations || locations.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  locations.forEach(location => {
    const distance = calculateDistanceFromObjects(currentLocation, location);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...location, distance };
    }
  });

  return nearest;
};

/**
 * Sort locations by distance from current location
 * @param {Object} currentLocation - {latitude, longitude}
 * @param {Array} locations - Array of {latitude, longitude} objects
 * @returns {Array} Sorted locations with distance added
 */
export const sortByDistance = (currentLocation, locations) => {
  if (!currentLocation || !locations || locations.length === 0) {
    return [];
  }

  return locations
    .map(location => ({
      ...location,
      distance: calculateDistanceFromObjects(currentLocation, location)
    }))
    .sort((a, b) => a.distance - b.distance);
};

// ============================================
// GEOCODING HELPERS
// ============================================

/**
 * Parse coordinates from string
 * @param {string} coordString - Coordinates string (e.g., "13.0827, 80.2707")
 * @returns {Object} {latitude, longitude} or null
 */
export const parseCoordinates = (coordString) => {
  if (!coordString) return null;

  const parts = coordString.split(',').map(s => s.trim());
  
  if (parts.length !== 2) return null;

  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);

  if (isValidCoordinate(latitude, longitude)) {
    return { latitude, longitude };
  }

  return null;
};

/**
 * Create Google Maps URL
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} zoom - Zoom level (default: 15)
 * @returns {string} Google Maps URL
 */
export const createGoogleMapsUrl = (latitude, longitude, zoom = 15) => {
  if (!isValidCoordinate(latitude, longitude)) {
    return '';
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;
};

/**
 * Create navigation URL (Google Maps)
 * @param {number} fromLat - Start latitude
 * @param {number} fromLng - Start longitude
 * @param {number} toLat - Destination latitude
 * @param {number} toLng - Destination longitude
 * @returns {string} Navigation URL
 */
export const createNavigationUrl = (fromLat, fromLng, toLat, toLng) => {
  if (!isValidCoordinate(fromLat, fromLng) || !isValidCoordinate(toLat, toLng)) {
    return '';
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  calculateDistance,
  calculateDistanceFromCoords,
  calculateDistanceFromObjects,
  calculateEstimatedTime,
  calculateETA,
  isValidCoordinate,
  isValidCoordinatesArray,
  toRadians,
  toDegrees,
  formatCoordinates,
  calculateBearing,
  getDirectionFromBearing,
  calculateBounds,
  isPointInBounds,
  isNearby,
  findNearestLocation,
  sortByDistance,
  parseCoordinates,
  createGoogleMapsUrl,
  createNavigationUrl
};