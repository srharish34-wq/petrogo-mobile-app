/**
 * Petrol Bunk Controller
 * Handles petrol bunk operations
 */

const PetrolBunk = require('../models/PetrolBunk');
const Order = require('../models/Order');
const User = require('../models/User');
const { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } = require('../config/constants');

/**
 * Create new petrol bunk
 * POST /api/v1/bunks/create
 */
exports.createBunk = async (req, res) => {
  try {
    const {
      name,
      registrationNumber,
      contactPerson,
      address,
      location,
      fuelAvailability,
      status
    } = req.body;

    console.log('📦 Creating bunk with data:', {
      name,
      registrationNumber,
      contactPerson,
      address
    });


    // Get current logged-in bunk profile
exports.getCurrentBunk = async (req, res) => {
  try {
    const bunkId = req.user.id; // or req.user.bunk depending on your auth

    const bunk = await PetrolBunk.findById(bunkId)
      .select('-password'); // Don't send password

    if (!bunk) {
      return res.status(404).json({
        success: false,
        message: 'Bunk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { bunk }
    });
  } catch (error) {
    console.error('Get current bunk error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bunk profile'
    });
  }
};

// Update current bunk profile
exports.updateCurrentBunk = async (req, res) => {
  try {
    const bunkId = req.user.id;
    const updateData = req.body;

    // Don't allow password update through this endpoint
    delete updateData.password;

    const bunk = await PetrolBunk.findByIdAndUpdate(
      bunkId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!bunk) {
      return res.status(404).json({
        success: false,
        message: 'Bunk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { bunk }
    });
  } catch (error) {
    console.error('Update bunk error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bunk profile'
    });
  }
};

    // ✅ Validate required fields
    if (!name || !registrationNumber || !contactPerson?.phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Name, Registration Number, and Contact Phone are required'
      });
    }

    // ✅ Validate phone format
    if (!/^[6-9]\d{9}$/.test(contactPerson.phone)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Phone must be 10 digits starting with 6-9'
      });
    }

    // ✅ Use contactPerson.phone instead of ownerPhone
    let owner = await User.findOne({ phone: contactPerson.phone });

    if (!owner) {
      // Create new user for bunk owner
      owner = await User.create({
        phone: contactPerson.phone,
        name: contactPerson.name || name,
        email: contactPerson.email || '',
        role: USER_ROLES.PETROL_BUNK,
        isVerified: true,
        isActive: true
      });

      console.log('✅ New owner user created:', owner._id);
    } else {
      console.log('✅ Existing owner user found:', owner._id);
    }

    // ✅ Create petrol bunk with proper data
    const bunkData = {
      name: name.trim(),
      registrationNumber: registrationNumber.trim(),
      contactPerson: {
        name: contactPerson.name || name,
        phone: contactPerson.phone,
        email: contactPerson.email || ''
      },
      address: {
        street: address?.street || '',
        landmark: address?.landmark || '',
        city: address?.city || '',
        state: address?.state || '',
        pincode: address?.pincode || '',
        country: 'India'
      },
      location: {
        type: 'Point',
        coordinates: location?.coordinates || [77.5, 12.9]
      },
      fuelAvailability: fuelAvailability || {
        diesel: {
          available: true,
          price: 95,
          stock: 1000
        },
        petrol: {
          available: true,
          price: 105,
          stock: 1000
        }
      },
      userId: owner._id,
      status: status || 'active',
      isVerified: true,
      isPesoApproved: true
    };

    console.log('📝 Bunk data prepared');

    const bunk = await PetrolBunk.create(bunkData);

    console.log('✅ Petrol bunk created:', bunk.name);

    // ✅ Populate and return
    await bunk.populate('userId', 'name phone email');

    res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: 'Petrol bunk created successfully',
      data: { bunk }
    });

  } catch (error) {
    console.error('❌ Create Bunk Error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Validation failed: ' + messages
      });
    }

    // Handle duplicate registration number
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Registration number already exists'
      });
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message || 'Failed to create petrol bunk'
    });
  }
};

/**
 * Get all petrol bunks
 * GET /api/v1/bunks
 */
exports.getAllBunks = async (req, res) => {
  try {
    const bunks = await PetrolBunk.find({ status: 'active', isVerified: true })
      .select('name address location fuelAvailability rating contactPerson')
      .sort({ 'rating.average': -1 });
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        bunks,
        count: bunks.length
      }
    });
  } catch (error) {
    console.error('Get All Bunks Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get bunk by ID
 * GET /api/v1/bunks/:bunkId
 */
exports.getBunkById = async (req, res) => {
  try {
    const { bunkId } = req.params;
    
    const bunk = await PetrolBunk.findById(bunkId)
      .populate('userId', 'name phone email');
    
    if (!bunk) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Petrol bunk not found'
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: { bunk }
    });
  } catch (error) {
    console.error('Get Bunk Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Find nearby bunks based on location
 * POST /api/v1/bunks/nearby
 */
exports.findNearbyBunks = async (req, res) => {
  try {
    const { longitude, latitude, fuelType, quantity } = req.body;
    
    if (!longitude || !latitude) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Longitude and latitude are required'
      });
    }
    
    let bunks;
    
    if (fuelType && quantity) {
      // Find bunks with specific fuel availability
      bunks = await PetrolBunk.findAvailableBunks(longitude, latitude, fuelType, quantity);
    } else {
      // Find all nearby bunks
      bunks = await PetrolBunk.findNearbyBunks(longitude, latitude, 5000);
    }
    
    if (bunks.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: ERROR_MESSAGES.NO_BUNK_AVAILABLE
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        bunks,
        count: bunks.length
      }
    });
  } catch (error) {
    console.error('Find Nearby Bunks Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update bunk details
 * PATCH /api/v1/bunks/:bunkId
 */
exports.updateBunk = async (req, res) => {
  try {
    const { bunkId } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.registrationNumber;
    delete updates.userId;
    delete updates.stats;
    
    const bunk = await PetrolBunk.findByIdAndUpdate(
      bunkId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!bunk) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Petrol bunk not found'
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Bunk updated successfully',
      data: { bunk }
    });
  } catch (error) {
    console.error('Update Bunk Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update fuel prices
 * PATCH /api/v1/bunks/:bunkId/fuel-prices
 */
exports.updateFuelPrices = async (req, res) => {
  try {
    const { bunkId } = req.params;
    const { dieselPrice, petrolPrice } = req.body;
    
    const bunk = await PetrolBunk.findById(bunkId);
    
    if (!bunk) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Petrol bunk not found'
      });
    }
    
    if (dieselPrice) {
      bunk.fuelAvailability.diesel.price = dieselPrice;
    }
    
    if (petrolPrice) {
      bunk.fuelAvailability.petrol.price = petrolPrice;
    }
    
    await bunk.save();
    
    console.log('✅ Fuel prices updated for:', bunk.name);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Fuel prices updated',
      data: { bunk }
    });
  } catch (error) {
    console.error('Update Fuel Prices Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update fuel stock
 * PATCH /api/v1/bunks/:bunkId/fuel-stock
 */
exports.updateFuelStock = async (req, res) => {
  try {
    const { bunkId } = req.params;
    const { fuelType, stock } = req.body;
    
    const bunk = await PetrolBunk.findById(bunkId);
    
    if (!bunk) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Petrol bunk not found'
      });
    }
    
    if (fuelType === 'diesel') {
      bunk.fuelAvailability.diesel.stock = stock;
      bunk.fuelAvailability.diesel.available = stock > 0;
    } else if (fuelType === 'petrol') {
      bunk.fuelAvailability.petrol.stock = stock;
      bunk.fuelAvailability.petrol.available = stock > 0;
    }
    
    await bunk.save();
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: 'Fuel stock updated',
      data: { bunk }
    });
  } catch (error) {
    console.error('Update Fuel Stock Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get bunk orders
 * GET /api/v1/bunks/:bunkId/orders
 */
exports.getBunkOrders = async (req, res) => {
  try {
    const { bunkId } = req.params;
    const { status } = req.query;
    
    const query = { petrolBunk: bunkId };
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone')
      .populate('deliveryPartner', 'name phone');
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        orders,
        count: orders.length
      }
    });
  } catch (error) {
    console.error('Get Bunk Orders Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get bunk statistics
 * GET /api/v1/bunks/:bunkId/stats
 */
exports.getBunkStats = async (req, res) => {
  try {
    const { bunkId } = req.params;
    
    const bunk = await PetrolBunk.findById(bunkId);
    
    if (!bunk) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: 'Petrol bunk not found'
      });
    }
    
    // Get order statistics
    const totalOrders = await Order.countDocuments({ petrolBunk: bunkId });
    const completedOrders = await Order.countDocuments({ 
      petrolBunk: bunkId, 
      status: 'completed' 
    });
    const pendingOrders = await Order.countDocuments({ 
      petrolBunk: bunkId, 
      status: { $in: ['pending', 'confirmed', 'partner_assigned'] }
    });
    
    // Calculate total revenue
    const completedOrdersList = await Order.find({ 
      petrolBunk: bunkId, 
      status: 'completed' 
    });
    
    const totalRevenue = completedOrdersList.reduce((sum, order) => {
      return sum + order.charges.totalAmount;
    }, 0);
    
    res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: {
        bunkInfo: {
          name: bunk.name,
          rating: bunk.rating
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders
        },
        revenue: {
          total: Math.round(totalRevenue * 100) / 100,
          average: completedOrders > 0 ? Math.round((totalRevenue / completedOrders) * 100) / 100 : 0
        },
        fuel: bunk.fuelAvailability
      }
    });
  } catch (error) {
    console.error('Get Bunk Stats Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message
    });
  }
};