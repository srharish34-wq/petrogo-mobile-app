/**
 * Socket Service
 * Handles real-time updates using Socket.io
 */

let io = null;

/**
 * Initialize Socket.io
 * @param {Object} socketIO - Socket.io instance
 */
const initializeSocket = (socketIO) => {
  io = socketIO;
  
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    
    // Handle user joining order room
    socket.on('join_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`👤 Socket ${socket.id} joined order: ${orderId}`);
    });
    
    // Handle user leaving order room
    socket.on('leave_order', (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`👋 Socket ${socket.id} left order: ${orderId}`);
    });
    
    // Handle partner location updates
    socket.on('partner_location_update', (data) => {
      const { orderId, location } = data;
      
      // Broadcast to all users tracking this order
      io.to(`order_${orderId}`).emit('partner_location', {
        orderId,
        location,
        timestamp: new Date()
      });
      
      console.log(`📍 Location update for order: ${orderId}`);
    });
    
    // Handle partner joining
    socket.on('partner_online', (partnerId) => {
      socket.join(`partner_${partnerId}`);
      console.log(`🚴 Partner ${partnerId} online`);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
  
  console.log('🔌 Socket.io initialized');
};

/**
 * Emit order update to all subscribers
 * @param {string} orderId - Order ID
 * @param {Object} data - Update data
 */
const emitOrderUpdate = (orderId, data) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  io.to(`order_${orderId}`).emit('order_update', {
    orderId,
    ...data,
    timestamp: new Date()
  });
  
  console.log(`📡 Order update emitted for: ${orderId}`);
};

/**
 * Emit partner location update
 * @param {string} orderId - Order ID
 * @param {Object} location - Location data
 */
const emitPartnerLocation = (orderId, location) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  io.to(`order_${orderId}`).emit('partner_location', {
    orderId,
    location,
    timestamp: new Date()
  });
};

/**
 * Emit new order to available partners
 * @param {Object} order - Order details
 */
const emitNewOrderToPartners = (order) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  // Broadcast to all connected partners
  io.emit('new_order_available', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    location: order.deliveryLocation,
    fuelType: order.fuelDetails.type,
    quantity: order.fuelDetails.quantity,
    timestamp: new Date()
  });
  
  console.log(`📢 New order broadcasted to partners: ${order.orderNumber}`);
};

/**
 * Emit order assignment to specific partner
 * @param {string} partnerId - Partner ID
 * @param {Object} order - Order details
 */
const emitOrderAssignment = (partnerId, order) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  io.to(`partner_${partnerId}`).emit('order_assigned', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    customer: order.customer,
    deliveryLocation: order.deliveryLocation,
    timestamp: new Date()
  });
  
  console.log(`📋 Order assigned to partner: ${partnerId}`);
};

/**
 * Emit status update
 * @param {string} room - Room name
 * @param {string} status - Status message
 */
const emitStatus = (room, status) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  io.to(room).emit('status_update', {
    status,
    timestamp: new Date()
  });
};

/**
 * Get connected sockets count
 * @returns {number} Number of connected sockets
 */
const getConnectedSockets = () => {
  if (!io) {
    return 0;
  }
  
  return io.engine.clientsCount;
};

/**
 * Broadcast message to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Data to send
 */
const broadcast = (event, data) => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized');
    return;
  }
  
  io.emit(event, {
    ...data,
    timestamp: new Date()
  });
  
  console.log(`📡 Broadcasted event: ${event}`);
};

module.exports = {
  initializeSocket,
  emitOrderUpdate,
  emitPartnerLocation,
  emitNewOrderToPartners,
  emitOrderAssignment,
  emitStatus,
  getConnectedSockets,
  broadcast
};