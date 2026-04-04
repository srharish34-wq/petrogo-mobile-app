/**
 * Order Controller
 * Handles order creation, updates, and management
 */

const Order = require('../models/Order');
const PetrolBunk = require('../models/PetrolBunk');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { ORDER_STATUS, APP_SETTINGS, DELIVERY_CHARGES, HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Calculate distance between two coordinates (in km)
 */
const calculateDistance = (coord1, coord2) => {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimals
};

/**
 * Create new order
 * POST /api/v1/orders/create
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      customerPhone,
      petrolBunkId,
      fuelType,
      quantity,
      deliveryLocation
    } = req.body;
    
    console.log('📦 Received order request:', {
      customerPhone,
      petrolBunkId,
      fuelType,
      quantity,
      deliveryLocation
    });
    
    // ✅ FIXED: Validate only essential fields (petrolBunkId is optional for emergency orders)
    if (!customerPhone || !fuelType || !quantity || !deliveryLocation) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Required fields: customerPhone, fuelType, quantity, deliveryLocation'
      });
    }
    
    // Validate fuel quantity
    if (quantity > APP_SETTINGS.MAX_FUEL_LIMIT) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: `Maximum fuel limit is ${APP_SETTINGS.MAX_FUEL_LIMIT} liters`
      });
    }
    
    // Find customer
    const customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    let bunk = null;
    let distance = 5; // Default distance for emergency orders
    let pricePerLiter = fuelType === 'petrol' ? 105 : 95; // Default prices
    
    // ✅ If petrolBunkId provided, fetch bunk details
    if (petrolBunkId) {
      bunk = await PetrolBunk.findById(petrolBunkId);
      
      if (!bunk) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: 'error',
          message: 'Petrol bunk not found'
        });
      }
      
      // Check fuel availability
      if (!bunk.checkFuelAvailability(fuelType, quantity)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: 'error',
          message: 'Fuel not available or insufficient stock'
        });
      }
      
      // Calculate distance
      distance = calculateDistance(
        bunk.location.coordinates,
        deliveryLocation.coordinates
      );
      
      // Get price from bunk
      pricePerLiter = bunk.fuelAvailability[fuelType].price;
    } else {
      console.log('⚠️ No bunk assigned - creating emergency order with defaults');
    }
    
    // Calculate charges
    const fuelCost = quantity * pricePerLiter;
    
    const deliveryCharge = Math.min(
      DELIVERY_CHARGES.BASE_CHARGE + (distance * DELIVERY_CHARGES.PER_KM_CHARGE),
      DELIVERY_CHARGES.MAX_DELIVERY_CHARGE
    );
    
    const emergencyFee = APP_SETTINGS.EMERGENCY_FEE;
    const totalAmount = fuelCost + deliveryCharge + emergencyFee;
    
    // ✅ Create order (with or without bunk)
    const orderData = {
      customer: customer._id,
      fuelDetails: {
        type: fuelType,
        quantity,
        pricePerLiter,
        totalFuelCost: fuelCost
      },
      deliveryLocation: {
        type: 'Point',
        coordinates: deliveryLocation.coordinates,
        address: deliveryLocation.address || '',
        landmark: deliveryLocation.landmark || ''
      },
      distance: {
        toCustomer: distance
      },
      charges: {
        fuelCost,
        deliveryCharge,
        emergencyFee,
        totalAmount
      },
      safetyAcknowledged: true,
      status: ORDER_STATUS.PENDING
    };
    
    // Only add petrolBunk if it exists
    if (bunk) {
      orderData.petrolBunk = bunk._id;
    }
    
    const order = await Order.create(orderData);
    
    // Generate delivery OTP
    const otp = order.generateDeliveryOtp();
    await order.save();
    
    // Create payment record
    await Payment.create({
      order: order._id,
      customer: customer._id,
      amount: {
        total: totalAmount,
        paid: 0
      },
      method: 'cash', // Default to cash
      status: 'pending'
    });
    
    // Populate order details
    await order.populate('customer', 'name phone');
    if (bunk) {
      await order.populate('petrolBunk', 'name address location');
    }
    
    console.log('✅ Order created:', order.orderNumber);
    console.log('📱 Delivery OTP:', otp);
    
    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order,
        deliveryOtp: otp // Send OTP in response
      }
    });
  } catch (error) {
    console.error('❌ Create Order Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all orders (for partner panel available orders)
 * GET /api/v1/orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('customer', 'name phone')
      .populate('petrolBunk', 'name address')
      .populate('deliveryPartner', 'name phone');
    
    console.log(`📋 Fetched ${orders.length} orders (status: ${status || 'all'})`);
    
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
 * Get order by ID
 * GET /api/v1/orders/:orderId
 */
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('customer', 'name phone')
      .populate('deliveryPartner', 'name phone partnerDetails.vehicleNumber')
      .populate('petrolBunk', 'name address location contactPerson');
    
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.ORDER_NOT_FOUND
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get customer orders
 * GET /api/v1/orders/customer/:phone
 */
exports.getCustomerOrders = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const customer = await User.findOne({ phone });
    if (!customer) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }
    
    const orders = await Order.find({ customer: customer._id })
      .sort({ createdAt: -1 })
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
    console.error('Get Customer Orders Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update order status
 * PATCH /api/v1/orders/:orderId/status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.ORDER_NOT_FOUND
      });
    }
    
    // Update status
    order.status = status;
    
    // Update specific timestamps
    if (status === ORDER_STATUS.CONFIRMED) {
      order.timeline.push({
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(),
        notes: notes || 'Order confirmed by bunk'
      });
    } else if (status === ORDER_STATUS.PARTNER_ASSIGNED) {
      order.partnerAssignedAt = new Date();
    } else if (status === ORDER_STATUS.PICKED_UP) {
      order.pickedUpAt = new Date();
    } else if (status === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Verify delivery OTP and complete order
 * POST /api/v1/orders/:orderId/verify-otp
 */
exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.ORDER_NOT_FOUND
      });
    }
    
    // Verify OTP
    if (!order.verifyDeliveryOtp(otp)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: ERROR_MESSAGES.INVALID_OTP
      });
    }
    
    // Mark as completed
    order.status = ORDER_STATUS.COMPLETED;
    order.actualDeliveryTime = new Date();
    await order.save();
    
    // Update payment status
    await Payment.findOneAndUpdate(
      { order: order._id },
      { status: 'completed', paidAt: new Date() }
    );
    
    console.log('✅ Order completed:', order.orderNumber);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Delivery verified and order completed',
      data: { order }
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Cancel order
 * POST /api/v1/orders/:orderId/cancel
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, cancelledBy } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.ORDER_NOT_FOUND
      });
    }
    
    // Check if order can be cancelled
    if ([ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED].includes(order.status)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Cannot cancel completed order'
      });
    }
    
    order.status = ORDER_STATUS.CANCELLED;
    order.cancellation = {
      cancelledBy: cancelledBy || 'customer',
      reason,
      cancelledAt: new Date()
    };
    
    await order.save();
    
    console.log('❌ Order cancelled:', order.orderNumber);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};