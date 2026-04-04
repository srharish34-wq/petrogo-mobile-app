/**
 * Notification Service
 * Handles push notifications and alerts
 */

/**
 * Send notification to user
 * @param {string} userId - User ID
 * @param {Object} notification - Notification data
 */
const sendNotification = async (userId, notification) => {
  try {
    const { title, body, data } = notification;
    
    // In production, integrate with Firebase Cloud Messaging
    // or other push notification service
    
    console.log(`🔔 Notification sent to user ${userId}:`);
    console.log(`   Title: ${title}`);
    console.log(`   Body: ${body}`);
    
    if (data) {
      console.log(`   Data:`, data);
    }
    
    // Mock notification delivery
    return {
      success: true,
      messageId: `MSG_${Date.now()}`,
      userId,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('Send Notification Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send order notification
 * @param {string} userId - User ID
 * @param {Object} order - Order details
 * @param {string} type - Notification type
 */
const sendOrderNotification = async (userId, order, type) => {
  const notifications = {
    order_created: {
      title: '🎉 Order Placed!',
      body: `Your fuel order #${order.orderNumber} has been placed successfully.`
    },
    order_confirmed: {
      title: '✅ Order Confirmed',
      body: `Your order #${order.orderNumber} has been confirmed by the petrol bunk.`
    },
    partner_assigned: {
      title: '🚴 Partner Assigned',
      body: `A delivery partner has been assigned to your order #${order.orderNumber}.`
    },
    picked_up: {
      title: '📦 Fuel Picked Up',
      body: `Your fuel has been picked up and is on the way!`
    },
    in_transit: {
      title: '🚚 On the Way',
      body: `Your delivery partner is heading to your location.`
    },
    delivered: {
      title: '🎊 Delivered',
      body: `Your fuel has been delivered. Please verify with OTP.`
    },
    completed: {
      title: '✨ Order Completed',
      body: `Thank you for using PetroGo! Order #${order.orderNumber} is complete.`
    },
    cancelled: {
      title: '❌ Order Cancelled',
      body: `Your order #${order.orderNumber} has been cancelled.`
    }
  };
  
  const notification = notifications[type] || {
    title: 'Order Update',
    body: `Your order #${order.orderNumber} has been updated.`
  };
  
  return await sendNotification(userId, {
    ...notification,
    data: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      type
    }
  });
};

/**
 * Send partner notification
 * @param {string} partnerId - Partner ID
 * @param {Object} data - Notification data
 */
const sendPartnerNotification = async (partnerId, data) => {
  const { type, order } = data;
  
  const notifications = {
    new_order: {
      title: '🆕 New Order Available',
      body: `New fuel delivery request near you. Order #${order.orderNumber}`
    },
    order_assigned: {
      title: '📋 Order Assigned',
      body: `You have been assigned order #${order.orderNumber}.`
    },
    order_cancelled: {
      title: '🚫 Order Cancelled',
      body: `Order #${order.orderNumber} has been cancelled.`
    }
  };
  
  const notification = notifications[type] || {
    title: 'PetroGo Update',
    body: 'You have a new update.'
  };
  
  return await sendNotification(partnerId, {
    ...notification,
    data: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      type
    }
  });
};

/**
 * Send bulk notifications
 * @param {Array} userIds - Array of user IDs
 * @param {Object} notification - Notification data
 */
const sendBulkNotifications = async (userIds, notification) => {
  try {
    console.log(`📣 Sending bulk notification to ${userIds.length} users`);
    
    const results = await Promise.all(
      userIds.map(userId => sendNotification(userId, notification))
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Sent: ${successful}, ❌ Failed: ${failed}`);
    
    return {
      total: userIds.length,
      successful,
      failed,
      results
    };
  } catch (error) {
    console.error('Send Bulk Notifications Error:', error);
    throw error;
  }
};

/**
 * Send SMS notification
 * @param {string} phone - Phone number
 * @param {string} message - SMS message
 */
const sendSMS = async (phone, message) => {
  try {
    // In production, integrate with SMS gateway (Twilio, MSG91, etc.)
    
    console.log(`📱 SMS sent to ${phone}:`);
    console.log(`   ${message}`);
    
    return {
      success: true,
      messageId: `SMS_${Date.now()}`,
      phone,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('Send SMS Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send email notification
 * @param {string} email - Email address
 * @param {Object} emailData - Email data
 */
const sendEmail = async (email, emailData) => {
  try {
    const { subject, body } = emailData;
    
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    
    console.log(`📧 Email sent to ${email}:`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${body}`);
    
    return {
      success: true,
      messageId: `EMAIL_${Date.now()}`,
      email,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('Send Email Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendNotification,
  sendOrderNotification,
  sendPartnerNotification,
  sendBulkNotifications,
  sendSMS,
  sendEmail
};