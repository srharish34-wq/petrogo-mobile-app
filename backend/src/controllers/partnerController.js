/**
 * Delivery Partner Controller - FIXED
 * Handles delivery partner operations with proper ID validation
 */

const mongoose = require('mongoose');
const DeliveryPartner = require('../models/DeliveryPartner');
const User = require('../models/User');
const Order = require('../models/Order');
const { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES, PARTNER_STATUS } = require('../config/constants');

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Register new delivery partner
 * POST /api/v1/partners/register
 */
exports.registerPartner = async (req, res) => {
  try {
    const {
      phone,
      name,
      vehicle,
      license,
      documents
    } = req.body;
    
    // Create or find user
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({
        phone,
        name,
        role: USER_ROLES.DELIVERY_PARTNER,
        isVerified: false
      });
    } else if (user.role !== USER_ROLES.DELIVERY_PARTNER) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'User already exists with different role'
      });
    }
    
    // Check if partner profile already exists
    let partner = await DeliveryPartner.findOne({ user: user._id });
    
    if (partner) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Partner profile already exists'
      });
    }
    
    // Create delivery partner profile
    partner = await DeliveryPartner.create({
      user: user._id,
      vehicle,
      license,
      documents,
      kycStatus: 'approved', // ✅ Auto-approve for testing
      currentStatus: PARTNER_STATUS.OFFLINE,
      isAvailable: false
    });
    
    console.log('✅ Delivery partner registered:', name);
    
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: 'Partner registered successfully.',
      data: { partner }
    });
  } catch (error) {
    console.error('Register Partner Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get partner by phone
 * GET /api/v1/partners/phone/:phone
 */
exports.getPartnerByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ phone, role: USER_ROLES.DELIVERY_PARTNER });
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    const partner = await DeliveryPartner.findOne({ user: user._id })
      .populate('user', 'name phone email profilePicture');
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner profile not found'
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { partner }
    });
  } catch (error) {
    console.error('Get Partner Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update partner availability
 * PATCH /api/v1/partners/:partnerId/availability
 */
exports.updateAvailability = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { isAvailable, status } = req.body;
    
    // ✅ Validate ObjectId
    if (!isValidObjectId(partnerId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid partner ID. Please login again to get a valid session.'
      });
    }
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    if (isAvailable !== undefined) {
      partner.isAvailable = isAvailable;
    }
    
    if (status) {
      partner.currentStatus = status;
    }
    
    partner.lastActiveAt = new Date();
    await partner.save();
    
    console.log(`✅ Partner availability updated: ${partner.currentStatus}`);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Availability updated',
      data: { partner }
    });
  } catch (error) {
    console.error('Update Availability Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update partner location
 * PATCH /api/v1/partners/:partnerId/location
 */
exports.updateLocation = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { longitude, latitude, address } = req.body;
    
    // ✅ Validate ObjectId
    if (!isValidObjectId(partnerId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid partner ID. Please login again.'
      });
    }
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    await partner.updateLocation(longitude, latitude, address);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Location updated',
      data: { 
        location: partner.currentLocation
      }
    });
  } catch (error) {
    console.error('Update Location Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get partner orders - FIXED WITH VALIDATION
 * GET /api/v1/partners/:partnerId/orders
 */
exports.getPartnerOrders = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.query;
    
    console.log('📦 Getting orders for partner:', partnerId);
    
    // ✅ Validate ObjectId
    if (!isValidObjectId(partnerId)) {
      console.error('❌ Invalid partner ID format:', partnerId);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid partner ID. Please logout and login again to refresh your session.',
        data: { orders: [] }
      });
    }
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      console.error('❌ Partner not found in database:', partnerId);
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found. Please login again.',
        data: { orders: [] }
      });
    }
    
    const query = { deliveryPartner: partner.user };
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone')
      .populate('petrolBunk', 'name address location');
    
    console.log('✅ Found orders:', orders.length);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        orders,
        count: orders.length
      }
    });
  } catch (error) {
    console.error('Get Partner Orders Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message,
      data: { orders: [] }
    });
  }
};

/**
 * Assign partner to order
 * POST /api/v1/partners/:partnerId/assign-order
 */
exports.assignOrder = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { orderId } = req.body;
    
    // ✅ Validate ObjectId
    if (!isValidObjectId(partnerId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid partner ID. Please login again.'
      });
    }
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    // KYC check removed for testing
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.ORDER_NOT_FOUND
      });
    }
    
    // Check if order already assigned
    if (order.deliveryPartner) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Order already assigned to another partner'
      });
    }
    
    // Assign partner to order
    order.deliveryPartner = partner.user;
    order.status = 'partner_assigned';
    order.partnerAssignedAt = new Date();
    await order.save();
    
    // Update partner status
    partner.currentStatus = 'on_delivery';
    partner.isAvailable = false;
    await partner.save();
    
    console.log('✅ Partner assigned to order:', order.orderNumber);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Partner assigned to order',
      data: { order }
    });
  } catch (error) {
    console.error('Assign Order Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get partner earnings
 * GET /api/v1/partners/:partnerId/earnings
 */
exports.getEarnings = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    // ✅ Validate ObjectId
    if (!isValidObjectId(partnerId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid partner ID. Please login again.'
      });
    }
    
    const partner = await DeliveryPartner.findById(partnerId);
    
    if (!partner) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Partner not found'
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        earnings: partner.earnings,
        performance: partner.performance
      }
    });
  } catch (error) {
    console.error('Get Earnings Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Find available partners near location
 * POST /api/v1/partners/nearby
 */
exports.findNearbyPartners = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.body;
    
    const partners = await DeliveryPartner.findAvailableNearby(
      longitude, 
      latitude, 
      maxDistance || 5000
    );
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        partners,
        count: partners.length
      }
    });
  } catch (error) {
    console.error('Find Nearby Partners Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};