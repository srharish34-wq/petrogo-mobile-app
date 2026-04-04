/**
 * Admin Controller
 * Handles admin operations and analytics
 */

const User = require('../models/User');
const PetrolBunk = require('../models/PetrolBunk');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const DeliveryPartner = require('../models/DeliveryPartner');
const Settings = require('../models/Settings');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Get dashboard statistics
 * GET /api/v1/admin/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    // Count documents
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalPartners = await DeliveryPartner.countDocuments();
    const totalBunks = await PetrolBunk.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const activeOrders = await Order.countDocuments({ 
      status: { $in: ['pending', 'confirmed', 'partner_assigned', 'picked_up', 'in_transit'] }
    });
    
    // Calculate revenue
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, payment) => {
  const amount = payment.amount?.total || payment.amount?.paid || 0;
  return sum + amount;
}, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name phone')
      .populate('petrolBunk', 'name')
      .populate('deliveryPartner', 'name');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        stats: {
          users: totalUsers,
          partners: totalPartners,
          bunks: totalBunks,
          orders: {
            total: totalOrders,
            completed: completedOrders,
            active: activeOrders
          },
          revenue: Math.round(totalRevenue * 100) / 100
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get Dashboard Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all users
 * GET /api/v1/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    const query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all orders with filters
 * GET /api/v1/admin/orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone')
      .populate('petrolBunk', 'name address')
      .populate('deliveryPartner', 'name phone');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        orders,
        count: orders.length
      }
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all delivery partners
 * GET /api/v1/admin/partners
 */
exports.getAllPartners = async (req, res) => {
  try {
    const { kycStatus } = req.query;
    
    const query = {};
    if (kycStatus) {
      query.kycStatus = kycStatus;
    }
    
    const partners = await DeliveryPartner.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name phone email');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        partners,
        count: partners.length
      }
    });
  } catch (error) {
    console.error('Get All Partners Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Approve/Reject partner KYC
 * PATCH /api/v1/admin/partners/:partnerId/kyc
 */
exports.updatePartnerKYC = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { kycStatus, rejectionReason } = req.body;
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    partner.kycStatus = kycStatus;
    
    if (kycStatus === 'approved') {
      partner.verifiedAt = new Date();
      partner.isAvailable = true;
    } else if (kycStatus === 'rejected') {
      partner.kycRejectionReason = rejectionReason;
    }
    
    await partner.save();
    
    console.log(`✅ Partner KYC ${kycStatus}:`, partner._id);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: `Partner KYC ${kycStatus}`,
      data: { partner }
    });
  } catch (error) {
    console.error('Update Partner KYC Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get app settings
 * GET /api/v1/admin/settings
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { settings }
    });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update app settings
 * PATCH /api/v1/admin/settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    const settings = await Settings.getSettings();
    
    // Update settings
    Object.keys(updates).forEach(key => {
      if (settings[key] !== undefined) {
        settings[key] = updates[key];
      }
    });
    
    await settings.save();
    
    console.log('✅ Settings updated');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get analytics data
 * GET /api/v1/admin/analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    
    let startDate = new Date();
    
    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Orders analytics
    const orders = await Order.find({
      createdAt: { $gte: startDate }
    });
    
    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Revenue analytics
    const payments = await Payment.find({
      status: 'completed',
      paidAt: { $gte: startDate }
    });
    
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount.paid, 0);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        period,
        orders: {
          total: orders.length,
          byStatus: ordersByStatus
        },
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          average: orders.length > 0 ? Math.round((totalRevenue / orders.length) * 100) / 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};