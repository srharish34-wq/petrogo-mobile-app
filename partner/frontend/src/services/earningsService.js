/**
 * Earnings Service
 * Earnings calculations and API calls
 * Location: partner/src/services/earningsService.js
 */

import api from './api';

export const earningsService = {
  /**
   * Get partner earnings summary
   * GET /api/v1/partners/:partnerId/earnings
   */
  getEarnings: async (partnerId) => {
    try {
      console.log('💰 Fetching earnings...');
      const response = await api.get(`/partners/${partnerId}/earnings`);
      console.log('✅ Earnings fetched:', response);
      return response;
    } catch (error) {
      console.error('❌ Get earnings error:', error);
      throw error;
    }
  },

  /**
   * Get earnings by timeframe
   * Calculate from orders data
   */
  getEarningsByTimeframe: async (partnerId, timeframe = 'today') => {
    try {
      // Get all partner orders
      const response = await api.get(`/partners/${partnerId}/orders`);
      const orders = response.data?.orders || [];
      
      // Filter orders by timeframe
      const now = new Date();
      let filteredOrders = [];
      
      switch (timeframe) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today && order.status === 'completed';
          });
          break;
          
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekAgo && order.status === 'completed';
          });
          break;
          
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= monthAgo && order.status === 'completed';
          });
          break;
          
        case 'total':
        default:
          filteredOrders = orders.filter(order => order.status === 'completed');
      }
      
      // Calculate total earnings
      const totalEarnings = filteredOrders.reduce((sum, order) => {
        const deliveryCharge = order.charges?.deliveryCharge || 0;
        const emergencyFee = order.charges?.emergencyFee || 0;
        return sum + deliveryCharge + emergencyFee;
      }, 0);
      
      return {
        timeframe,
        earnings: Math.round(totalEarnings),
        orderCount: filteredOrders.length,
        orders: filteredOrders
      };
    } catch (error) {
      console.error('❌ Get earnings by timeframe error:', error);
      throw error;
    }
  },

  /**
   * Calculate earnings breakdown
   */
  calculateEarningsBreakdown: (orders = []) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const breakdown = {
      totalOrders: completedOrders.length,
      totalEarnings: 0,
      deliveryCharges: 0,
      emergencyFees: 0,
      averagePerOrder: 0,
      highestEarning: 0,
      lowestEarning: Infinity
    };
    
    completedOrders.forEach(order => {
      const deliveryCharge = order.charges?.deliveryCharge || 0;
      const emergencyFee = order.charges?.emergencyFee || 0;
      const orderEarning = deliveryCharge + emergencyFee;
      
      breakdown.deliveryCharges += deliveryCharge;
      breakdown.emergencyFees += emergencyFee;
      breakdown.totalEarnings += orderEarning;
      
      if (orderEarning > breakdown.highestEarning) {
        breakdown.highestEarning = orderEarning;
      }
      if (orderEarning < breakdown.lowestEarning) {
        breakdown.lowestEarning = orderEarning;
      }
    });
    
    if (breakdown.totalOrders > 0) {
      breakdown.averagePerOrder = Math.round(breakdown.totalEarnings / breakdown.totalOrders);
    }
    
    if (breakdown.lowestEarning === Infinity) {
      breakdown.lowestEarning = 0;
    }
    
    // Round all values
    breakdown.totalEarnings = Math.round(breakdown.totalEarnings);
    breakdown.deliveryCharges = Math.round(breakdown.deliveryCharges);
    breakdown.emergencyFees = Math.round(breakdown.emergencyFees);
    breakdown.highestEarning = Math.round(breakdown.highestEarning);
    breakdown.lowestEarning = Math.round(breakdown.lowestEarning);
    
    return breakdown;
  },

  /**
   * Format currency (INR)
   */
  formatCurrency: (amount, showSymbol = true) => {
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return showSymbol ? `₹${formatted}` : formatted;
  },

  /**
   * Calculate earnings statistics for charts
   */
  calculateEarningsStats: (orders = []) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    // Group by date
    const earningsByDate = {};
    
    completedOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-IN');
      const earning = (order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0);
      
      if (!earningsByDate[date]) {
        earningsByDate[date] = {
          date,
          earnings: 0,
          orders: 0
        };
      }
      
      earningsByDate[date].earnings += earning;
      earningsByDate[date].orders += 1;
    });
    
    // Convert to array and sort by date
    const dailyStats = Object.values(earningsByDate).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    return dailyStats;
  },

  /**
   * Get earnings trend (increasing/decreasing)
   */
  getEarningsTrend: (currentPeriod, previousPeriod) => {
    if (previousPeriod === 0) {
      return currentPeriod > 0 ? 100 : 0;
    }
    
    const change = ((currentPeriod - previousPeriod) / previousPeriod) * 100;
    return Math.round(change * 10) / 10; // Round to 1 decimal
  },

  /**
   * Calculate daily average earnings
   */
  calculateDailyAverage: (orders = [], days = 30) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    const totalEarnings = completedOrders.reduce((sum, order) => {
      const deliveryCharge = order.charges?.deliveryCharge || 0;
      const emergencyFee = order.charges?.emergencyFee || 0;
      return sum + deliveryCharge + emergencyFee;
    }, 0);
    
    return Math.round(totalEarnings / days);
  },

  /**
   * Get top earning orders
   */
  getTopEarningOrders: (orders = [], limit = 5) => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    
    return completedOrders
      .sort((a, b) => {
        const earningA = (a.charges?.deliveryCharge || 0) + (a.charges?.emergencyFee || 0);
        const earningB = (b.charges?.deliveryCharge || 0) + (b.charges?.emergencyFee || 0);
        return earningB - earningA;
      })
      .slice(0, limit);
  },

  /**
   * Calculate partner performance score
   */
  calculatePerformanceScore: (partnerData) => {
    const { performance } = partnerData;
    
    if (!performance) return 0;
    
    const completionRate = performance.totalDeliveries > 0
      ? (performance.completedDeliveries / performance.totalDeliveries) * 100
      : 0;
    
    const rating = performance.rating?.average || 0;
    const onTimeRate = performance.onTimeDeliveryRate || 0;
    
    // Weighted score: 40% completion, 30% rating, 30% on-time
    const score = (completionRate * 0.4) + (rating * 20 * 0.3) + (onTimeRate * 0.3);
    
    return Math.round(score);
  }
};

export default earningsService;