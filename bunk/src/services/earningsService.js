/**
 * Earnings Service
 * Handles revenue, earnings, and payment APIs
 * Location: bunk/src/services/earningsService.js
 */

import api from './api';

const earningsService = {
  /**
   * Get earnings summary
   * @returns {Promise} Response with total, monthly, and daily earnings
   */
  getEarningsSummary: async () => {
    try {
      const response = await api.get('/bunks/earnings/summary');
      return response.data;
    } catch (error) {
      console.error('Get earnings summary error:', error);
      throw error;
    }
  },

  /**
   * Get earnings breakdown by date range
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Response with daily earnings breakdown
   */
  getEarningsBreakdown: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/breakdown', { params });
      return response.data;
    } catch (error) {
      console.error('Get earnings breakdown error:', error);
      throw error;
    }
  },

  /**
   * Get today's earnings
   * @returns {Promise} Response with today's earnings
   */
  getTodayEarnings: async () => {
    try {
      const response = await api.get('/bunks/earnings/today');
      return response.data;
    } catch (error) {
      console.error('Get today earnings error:', error);
      throw error;
    }
  },

  /**
   * Get this month's earnings
   * @returns {Promise} Response with current month earnings
   */
  getMonthlyEarnings: async () => {
    try {
      const response = await api.get('/bunks/earnings/monthly');
      return response.data;
    } catch (error) {
      console.error('Get monthly earnings error:', error);
      throw error;
    }
  },

  /**
   * Get earnings by fuel type
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Response with earnings by petrol/diesel
   */
  getEarningsByFuelType: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/by-fuel-type', { params });
      return response.data;
    } catch (error) {
      console.error('Get earnings by fuel type error:', error);
      throw error;
    }
  },

  /**
   * Get revenue statistics
   * @param {Object} params - Query parameters (startDate, endDate, groupBy)
   * @returns {Promise} Response with revenue stats
   */
  getRevenueStats: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get revenue stats error:', error);
      throw error;
    }
  },

  /**
   * Get withdrawal balance (available to withdraw)
   * @returns {Promise} Response with available and pending amounts
   */
  getWithdrawalBalance: async () => {
    try {
      const response = await api.get('/bunks/earnings/balance');
      return response.data;
    } catch (error) {
      console.error('Get withdrawal balance error:', error);
      throw error;
    }
  },

  /**
   * Request withdrawal
   * @param {number} amount - Amount to withdraw
   * @returns {Promise} Response with withdrawal request details
   */
  requestWithdrawal: async (amount) => {
    try {
      const response = await api.post('/bunks/earnings/withdraw', {
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Request withdrawal error:', error);
      throw error;
    }
  },

  /**
   * Get withdrawal history
   * @param {Object} params - Query parameters (limit, page, status)
   * @returns {Promise} Response with withdrawal history
   */
  getWithdrawalHistory: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/withdrawals', { params });
      return response.data;
    } catch (error) {
      console.error('Get withdrawal history error:', error);
      throw error;
    }
  },

  /**
   * Get payment transactions
   * @param {Object} params - Query parameters (startDate, endDate, status)
   * @returns {Promise} Response with transaction history
   */
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },

  /**
   * Export earnings report
   * @param {Object} params - Query parameters (startDate, endDate, format)
   * @returns {Promise} Response with report file
   */
  exportEarningsReport: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/export', {
        params,
        responseType: 'blob' // For file download
      });
      return response.data;
    } catch (error) {
      console.error('Export earnings report error:', error);
      throw error;
    }
  },

  /**
   * Get earnings comparison
   * @param {string} period1 - First period (e.g., 'this-month')
   * @param {string} period2 - Second period (e.g., 'last-month')
   * @returns {Promise} Response with comparison data
   */
  compareEarnings: async (period1, period2) => {
    try {
      const response = await api.get('/bunks/earnings/compare', {
        params: { period1, period2 }
      });
      return response.data;
    } catch (error) {
      console.error('Compare earnings error:', error);
      throw error;
    }
  },

  /**
   * Get top earning days
   * @param {Object} params - Query parameters (startDate, endDate, limit)
   * @returns {Promise} Response with top earning days
   */
  getTopEarningDays: async (params = {}) => {
    try {
      const response = await api.get('/bunks/earnings/top-days', { params });
      return response.data;
    } catch (error) {
      console.error('Get top earning days error:', error);
      throw error;
    }
  },

  /**
   * Get earnings forecast
   * @param {number} days - Number of days to forecast
   * @returns {Promise} Response with earnings projection
   */
  getEarningsForecast: async (days = 30) => {
    try {
      const response = await api.get('/bunks/earnings/forecast', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Get earnings forecast error:', error);
      throw error;
    }
  },

  /**
   * Calculate commission/platform fee
   * @param {number} amount - Total amount
   * @returns {Promise} Response with commission breakdown
   */
  calculateCommission: async (amount) => {
    try {
      const response = await api.post('/bunks/earnings/calculate-commission', {
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Calculate commission error:', error);
      throw error;
    }
  }
};

export default earningsService;