/**
 * Analytics Service
 * Analytics, reports, and insights API calls
 * Location: admin/src/services/analyticsService.js
 */

import api from './api';

/**
 * DASHBOARD ANALYTICS
 */
export const analyticsDashboard = {
  getOverview: async (startDate, endDate) => {
    return api.get(`/analytics/dashboard/overview?startDate=${startDate}&endDate=${endDate}`);
  },

  getKeyMetrics: async () => {
    return api.get('/analytics/dashboard/metrics');
  }
};

/**
 * ORDER ANALYTICS
 */
export const analyticsOrders = {
  getTrend: async (days = 30) => {
    return api.get(`/analytics/orders/trend?days=${days}`);
  },

  getStatusDistribution: async (startDate, endDate) => {
    return api.get(`/analytics/orders/status-distribution?startDate=${startDate}&endDate=${endDate}`);
  },

  getFuelTypeDistribution: async (startDate, endDate) => {
    return api.get(`/analytics/orders/fuel-distribution?startDate=${startDate}&endDate=${endDate}`);
  },

  getTimeSeriesData: async (startDate, endDate, interval = 'daily') => {
    return api.get(`/analytics/orders/timeseries?startDate=${startDate}&endDate=${endDate}&interval=${interval}`);
  },

  getAverageOrderValue: async (startDate, endDate) => {
    return api.get(`/analytics/orders/average-value?startDate=${startDate}&endDate=${endDate}`);
  },

  getCompletionRate: async (startDate, endDate) => {
    return api.get(`/analytics/orders/completion-rate?startDate=${startDate}&endDate=${endDate}`);
  },

  getPeakHours: async (days = 7) => {
    return api.get(`/analytics/orders/peak-hours?days=${days}`);
  }
};

/**
 * REVENUE ANALYTICS
 */
export const analyticsRevenue = {
  getTrend: async (months = 12) => {
    return api.get(`/analytics/revenue/trend?months=${months}`);
  },

  getByPaymentMethod: async (startDate, endDate) => {
    return api.get(`/analytics/revenue/by-method?startDate=${startDate}&endDate=${endDate}`);
  },

  getByLocation: async (startDate, endDate) => {
    return api.get(`/analytics/revenue/by-location?startDate=${startDate}&endDate=${endDate}`);
  },

  getGrowthRate: async (startDate, endDate) => {
    return api.get(`/analytics/revenue/growth-rate?startDate=${startDate}&endDate=${endDate}`);
  },

  getProjection: async (months = 3) => {
    return api.get(`/analytics/revenue/projection?months=${months}`);
  },

  getSourceBreakdown: async (startDate, endDate) => {
    return api.get(`/analytics/revenue/source-breakdown?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * PARTNER ANALYTICS
 */
export const analyticsPartners = {
  getPerformance: async (startDate, endDate, limit = 10) => {
    return api.get(`/analytics/partners/performance?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
  },

  getUtilization: async (startDate, endDate) => {
    return api.get(`/analytics/partners/utilization?startDate=${startDate}&endDate=${endDate}`);
  },

  getRatings: async (startDate, endDate) => {
    return api.get(`/analytics/partners/ratings?startDate=${startDate}&endDate=${endDate}`);
  },

  getEarningsBreakdown: async (startDate, endDate, limit = 10) => {
    return api.get(`/analytics/partners/earnings?startDate=${startDate}&endDate=${endDate}&limit=${limit}`);
  },

  getOnboardingTrend: async (months = 12) => {
    return api.get(`/analytics/partners/onboarding?months=${months}`);
  },

  getAvailabilityStatus: async () => {
    return api.get('/analytics/partners/availability');
  },

  getDeliveryTimeAnalysis: async (startDate, endDate) => {
    return api.get(`/analytics/partners/delivery-time?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * CUSTOMER ANALYTICS
 */
export const analyticsCustomers = {
  getGrowth: async (months = 12) => {
    return api.get(`/analytics/customers/growth?months=${months}`);
  },

  getSegmentation: async (startDate, endDate) => {
    return api.get(`/analytics/customers/segmentation?startDate=${startDate}&endDate=${endDate}`);
  },

  getRetention: async (startDate, endDate) => {
    return api.get(`/analytics/customers/retention?startDate=${startDate}&endDate=${endDate}`);
  },

  getLifetimeValue: async () => {
    return api.get('/analytics/customers/ltv');
  },

  getSatisfaction: async (startDate, endDate) => {
    return api.get(`/analytics/customers/satisfaction?startDate=${startDate}&endDate=${endDate}`);
  },

  getRepeatCustomers: async (startDate, endDate) => {
    return api.get(`/analytics/customers/repeat?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * PAYMENT ANALYTICS
 */
export const analyticsPayments = {
  getMethodDistribution: async (startDate, endDate) => {
    return api.get(`/analytics/payments/method-distribution?startDate=${startDate}&endDate=${endDate}`);
  },

  getSuccessRate: async (startDate, endDate) => {
    return api.get(`/analytics/payments/success-rate?startDate=${startDate}&endDate=${endDate}`);
  },

  getFailureAnalysis: async (startDate, endDate) => {
    return api.get(`/analytics/payments/failures?startDate=${startDate}&endDate=${endDate}`);
  },

  getRefundTrend: async (startDate, endDate) => {
    return api.get(`/analytics/payments/refunds?startDate=${startDate}&endDate=${endDate}`);
  },

  getAverageTransactionTime: async (startDate, endDate) => {
    return api.get(`/analytics/payments/avg-time?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * FUEL ANALYTICS
 */
export const analyticsFuel = {
  getConsumption: async (startDate, endDate) => {
    return api.get(`/analytics/fuel/consumption?startDate=${startDate}&endDate=${endDate}`);
  },

  getDemandForecast: async (weeks = 4) => {
    return api.get(`/analytics/fuel/forecast?weeks=${weeks}`);
  },

  getPriceAnalysis: async (startDate, endDate) => {
    return api.get(`/analytics/fuel/prices?startDate=${startDate}&endDate=${endDate}`);
  },

  getInventoryLevels: async () => {
    return api.get('/analytics/fuel/inventory');
  },

  getDemandByType: async (startDate, endDate) => {
    return api.get(`/analytics/fuel/demand-by-type?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * GEOGRAPHIC ANALYTICS
 */
export const analyticsGeographic = {
  getOrdersByLocation: async (startDate, endDate) => {
    return api.get(`/analytics/geographic/orders?startDate=${startDate}&endDate=${endDate}`);
  },

  getRevenueByLocation: async (startDate, endDate) => {
    return api.get(`/analytics/geographic/revenue?startDate=${startDate}&endDate=${endDate}`);
  },

  getCoverageAnalysis: async () => {
    return api.get('/analytics/geographic/coverage');
  },

  getRegionalPerformance: async (startDate, endDate) => {
    return api.get(`/analytics/geographic/regional-performance?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * REPORTS
 */
export const analyticsReports = {
  generateCustomReport: async (parameters) => {
    return api.post('/analytics/reports/custom', parameters);
  },

  getPrebuiltReports: async () => {
    return api.get('/analytics/reports/prebuilt');
  },

  scheduleReport: async (reportConfig) => {
    return api.post('/analytics/reports/schedule', reportConfig);
  },

  getScheduledReports: async () => {
    return api.get('/analytics/reports/scheduled');
  },

  exportAnalytics: async (type, startDate, endDate, format = 'csv') => {
    return api.post('/analytics/export', {
      type,
      startDate,
      endDate,
      format
    });
  }
};

/**
 * INSIGHTS & PREDICTIONS
 */
export const analyticsInsights = {
  getKeyInsights: async (startDate, endDate) => {
    return api.get(`/analytics/insights/key?startDate=${startDate}&endDate=${endDate}`);
  },

  getAnomalies: async (startDate, endDate) => {
    return api.get(`/analytics/insights/anomalies?startDate=${startDate}&endDate=${endDate}`);
  },

  getTrendAnalysis: async (metric, startDate, endDate) => {
    return api.get(`/analytics/insights/trends?metric=${metric}&startDate=${startDate}&endDate=${endDate}`);
  },

  getPredictions: async (metric, weeks = 4) => {
    return api.get(`/analytics/insights/predictions?metric=${metric}&weeks=${weeks}`);
  },

  getRecommendations: async (startDate, endDate) => {
    return api.get(`/analytics/insights/recommendations?startDate=${startDate}&endDate=${endDate}`);
  }
};

/**
 * Export all analytics services as single object
 */
export default {
  dashboard: analyticsDashboard,
  orders: analyticsOrders,
  revenue: analyticsRevenue,
  partners: analyticsPartners,
  customers: analyticsCustomers,
  payments: analyticsPayments,
  fuel: analyticsFuel,
  geographic: analyticsGeographic,
  reports: analyticsReports,
  insights: analyticsInsights
};