/**
 * Partner Service
 * API service for partner operations (Customer Backend)
 * Location: partner/src/services/partnerService.js
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const partnerService = {
  
  /**
   * Get partner by phone (from Customer Backend)
   * Uses: GET /api/v1/partners/phone/:phone
   */
  async getPartnerByPhone(phone) {
    try {
      const response = await axios.get(`${API_URL}/partners/phone/${phone}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching partner:', error);
      throw error.response?.data || { message: 'Failed to fetch partner' };
    }
  },

  /**
   * Register new partner (Customer Backend)
   * Uses: POST /api/v1/partners/register
   */
  async registerPartner(partnerData) {
    try {
      const response = await axios.post(`${API_URL}/partners/register`, partnerData);
      return response.data;
    } catch (error) {
      console.error('❌ Error registering partner:', error);
      throw error.response?.data || { message: 'Failed to register partner' };
    }
  },

  /**
   * Update partner availability
   * Uses: PATCH /api/v1/partners/:partnerId/availability
   */
  async updateAvailability(partnerId, isAvailable, status) {
    try {
      const response = await axios.patch(`${API_URL}/partners/${partnerId}/availability`, {
        isAvailable,
        status
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating availability:', error);
      throw error.response?.data || { message: 'Failed to update availability' };
    }
  },

  /**
   * Update partner location
   * Uses: PATCH /api/v1/partners/:partnerId/location
   */
  async updateLocation(partnerId, latitude, longitude, address) {
    try {
      const response = await axios.patch(`${API_URL}/partners/${partnerId}/location`, {
        latitude,
        longitude,
        address
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating location:', error);
      throw error.response?.data || { message: 'Failed to update location' };
    }
  },

  /**
   * Get partner orders
   * Uses: GET /api/v1/partners/:partnerId/orders
   */
  async getPartnerOrders(partnerId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/partners/${partnerId}/orders`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching partner orders:', error);
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  /**
   * Get partner earnings
   * Uses: GET /api/v1/partners/:partnerId/earnings
   */
  async getEarnings(partnerId) {
    try {
      const response = await axios.get(`${API_URL}/partners/${partnerId}/earnings`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching earnings:', error);
      throw error.response?.data || { message: 'Failed to fetch earnings' };
    }
  }
};