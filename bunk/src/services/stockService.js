/**
 * Stock Service
 * Handles fuel stock management APIs
 * Location: bunk/src/services/stockService.js
 */

import api from './api';

const stockService = {
  /**
   * Get current fuel stock levels
   * @returns {Promise} Response with stock data for all fuel types
   */
  getStock: async () => {
    try {
      const response = await api.get('/bunks/stock');
      return response.data;
    } catch (error) {
      console.error('Get stock error:', error);
      throw error;
    }
  },

  /**
   * Get stock for specific fuel type
   * @param {string} fuelType - Fuel type (petrol/diesel)
   * @returns {Promise} Response with stock data
   */
  getStockByType: async (fuelType) => {
    try {
      const response = await api.get(`/bunks/stock/${fuelType.toLowerCase()}`);
      return response.data;
    } catch (error) {
      console.error('Get stock by type error:', error);
      throw error;
    }
  },

  /**
   * Update fuel stock
   * @param {string} fuelType - Fuel type (petrol/diesel)
   * @param {number} quantity - New stock quantity in liters
   * @param {string} action - 'add' or 'set'
   * @returns {Promise} Response with updated stock
   */
  updateStock: async (fuelType, quantity, action = 'set') => {
    try {
      const response = await api.post(`/bunks/stock/${fuelType.toLowerCase()}`, {
        quantity,
        action
      });

      // Update localStorage with new stock
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      if (bunkData.fuelStock) {
        bunkData.fuelStock[fuelType.toLowerCase()].currentStock = quantity;
        localStorage.setItem('bunkData', JSON.stringify(bunkData));
      }

      return response.data;
    } catch (error) {
      console.error('Update stock error:', error);
      throw error;
    }
  },

  /**
   * Add fuel stock
   * @param {string} fuelType - Fuel type (petrol/diesel)
   * @param {number} quantity - Quantity to add in liters
   * @returns {Promise} Response with updated stock
   */
  addStock: async (fuelType, quantity) => {
    try {
      const response = await api.post(`/bunks/stock/${fuelType.toLowerCase()}/add`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Add stock error:', error);
      throw error;
    }
  },

  /**
   * Update fuel price
   * @param {string} fuelType - Fuel type (petrol/diesel)
   * @param {number} price - New price per liter
   * @param {string} effectiveDate - When to apply (immediate/tomorrow)
   * @returns {Promise} Response with updated price
   */
  updatePrice: async (fuelType, price, effectiveDate = 'immediate') => {
    try {
      const response = await api.post(`/bunks/stock/${fuelType.toLowerCase()}/price`, {
        pricePerLiter: price,
        effectiveDate
      });

      // Update localStorage with new price
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      if (bunkData.fuelStock) {
        bunkData.fuelStock[fuelType.toLowerCase()].pricePerLiter = price;
        localStorage.setItem('bunkData', JSON.stringify(bunkData));
      }

      return response.data;
    } catch (error) {
      console.error('Update price error:', error);
      throw error;
    }
  },

  /**
   * Get stock history/activity log
   * @param {Object} params - Query parameters (startDate, endDate, fuelType, limit)
   * @returns {Promise} Response with stock history
   */
  getStockHistory: async (params = {}) => {
    try {
      const response = await api.get('/bunks/stock/history', { params });
      return response.data;
    } catch (error) {
      console.error('Get stock history error:', error);
      throw error;
    }
  },

  /**
   * Get low stock alerts
   * @returns {Promise} Response with alerts for low stock
   */
  getLowStockAlerts: async () => {
    try {
      const response = await api.get('/bunks/stock/alerts');
      return response.data;
    } catch (error) {
      console.error('Get low stock alerts error:', error);
      throw error;
    }
  },

  /**
   * Set low stock threshold
   * @param {string} fuelType - Fuel type (petrol/diesel)
   * @param {number} threshold - Threshold in liters
   * @returns {Promise} Response with updated threshold
   */
  setLowStockThreshold: async (fuelType, threshold) => {
    try {
      const response = await api.post(`/bunks/stock/${fuelType.toLowerCase()}/threshold`, {
        threshold
      });
      return response.data;
    } catch (error) {
      console.error('Set threshold error:', error);
      throw error;
    }
  },

  /**
   * Get stock statistics
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Response with stock stats
   */
  getStockStats: async (params = {}) => {
    try {
      const response = await api.get('/bunks/stock/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get stock stats error:', error);
      throw error;
    }
  },

  /**
   * Calculate stock value (current stock * price)
   * @returns {Promise} Response with total stock value
   */
  getStockValue: async () => {
    try {
      const response = await api.get('/bunks/stock/value');
      return response.data;
    } catch (error) {
      console.error('Get stock value error:', error);
      throw error;
    }
  },

  /**
   * Export stock report
   * @param {Object} params - Query parameters (startDate, endDate, format)
   * @returns {Promise} Response with report data
   */
  exportStockReport: async (params = {}) => {
    try {
      const response = await api.get('/bunks/stock/export', {
        params,
        responseType: 'blob' // For file download
      });
      return response.data;
    } catch (error) {
      console.error('Export stock report error:', error);
      throw error;
    }
  }
};

export default stockService;