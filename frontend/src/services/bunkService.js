/**
 * Bunk Service - Fixed Version
 * Location: frontend/src/services/bunkService.js
 */

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

export const bunkService = {
  /**
   * Find nearby bunks based on location
   * ✅ FIXED: Correct endpoint and parameter order
   */
  findNearbyBunks: async (latitude, longitude, fuelType = 'petrol', quantity = 0, maxResults = 5) => {
    try {
      const token = localStorage.getItem('token');

      // ✅ FIXED: Changed endpoint to /api/v1/bunks/nearby
      // ✅ FIXED: Send longitude first, then latitude (backend expects this order)
      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          longitude: longitude,  // ✅ longitude first
          latitude: latitude,    // ✅ latitude second
          fuelType,
          quantity,
          maxDistance: 20,
          maxResults
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();

      console.log('✅ Bunks found:', data.data?.bunks?.length || 0);

      return {
        status: data.status || 'success',
        data: {
          bunks: data.data?.bunks || data.bunks || []
        }
      };
    } catch (error) {
      console.error('❌ Error finding nearby bunks:', error);
      throw error.message || 'Failed to find nearby bunks';
    }
  },

  /**
   * Get all bunks
   */
  getAllBunks: async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bunks:', error);
      throw error;
    }
  },

  /**
   * Get bunk by ID
   */
  getBunkById: async (bunkId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/${bunkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bunk:', error);
      throw error;
    }
  },

  /**
   * Search bunks by name or location
   */
  searchBunks: async (searchQuery) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching bunks:', error);
      throw error;
    }
  },

  /**
   * Get bunk fuel prices
   */
  getBunkPrices: async (bunkId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/${bunkId}/prices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  },

  /**
   * Check fuel availability at a bunk
   */
  checkAvailability: async (bunkId, fuelType, quantity) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/${bunkId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          fuelType,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  /**
   * Get bunk ratings and reviews
   */
  getBunkReviews: async (bunkId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/v1/bunks/${bunkId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }
};