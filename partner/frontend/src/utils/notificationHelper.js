/**
 * Notification Helper
 * Browser notification utilities
 * Location: partner/src/utils/notificationHelper.js
 */

// ============================================
// NOTIFICATION SUPPORT CHECK
// ============================================

/**
 * Check if browser supports notifications
 * @returns {boolean} True if supported
 */
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

/**
 * Get current notification permission status
 * @returns {string} 'granted', 'denied', or 'default'
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

// ============================================
// PERMISSION MANAGEMENT
// ============================================

/**
 * Request notification permission
 * @returns {Promise<boolean>} True if granted
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.warn('⚠️ Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('📱 Notification permission:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('❌ Notification permission error:', error);
    return false;
  }
};

/**
 * Check if notifications are allowed
 * @returns {boolean} True if allowed
 */
export const areNotificationsAllowed = () => {
  return isNotificationSupported() && Notification.permission === 'granted';
};

// ============================================
// NOTIFICATION CREATION
// ============================================

/**
 * Show notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} Notification instance or null
 */
export const showNotification = (title, options = {}) => {
  if (!areNotificationsAllowed()) {
    console.warn('⚠️ Notifications not allowed');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      ...options
    });

    console.log('✅ Notification shown:', title);
    return notification;
  } catch (error) {
    console.error('❌ Notification error:', error);
    return null;
  }
};

// ============================================
// PREDEFINED NOTIFICATIONS
// ============================================

/**
 * Show new order notification
 * @param {Object} order - Order object
 * @returns {Notification|null}
 */
export const showNewOrderNotification = (order) => {
  if (!order) return null;

  const fuelType = order.fuelDetails?.type?.toUpperCase() || 'FUEL';
  const quantity = order.fuelDetails?.quantity || 0;
  const earning = (order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0);

  return showNotification('🆕 New Order Available!', {
    body: `${quantity}L ${fuelType} - Earn ₹${Math.round(earning)}`,
    tag: 'new-order',
    requireInteraction: true,
    data: { orderId: order._id, type: 'new_order' }
  });
};

/**
 * Show order accepted notification
 * @param {Object} order - Order object
 * @returns {Notification|null}
 */
export const showOrderAcceptedNotification = (order) => {
  if (!order) return null;

  return showNotification('✅ Order Accepted', {
    body: `Order ${order.orderNumber} accepted. Start delivery when ready.`,
    tag: 'order-accepted',
    requireInteraction: false,
    data: { orderId: order._id, type: 'order_accepted' }
  });
};

/**
 * Show delivery started notification
 * @param {Object} order - Order object
 * @returns {Notification|null}
 */
export const showDeliveryStartedNotification = (order) => {
  if (!order) return null;

  return showNotification('🚚 Delivery Started', {
    body: `On the way to deliver ${order.fuelDetails?.quantity}L fuel`,
    tag: 'delivery-started',
    requireInteraction: false,
    data: { orderId: order._id, type: 'delivery_started' }
  });
};

/**
 * Show delivery completed notification
 * @param {Object} order - Order object
 * @param {number} earning - Earning amount
 * @returns {Notification|null}
 */
export const showDeliveryCompletedNotification = (order, earning) => {
  if (!order) return null;

  return showNotification('🎉 Delivery Completed!', {
    body: `You earned ₹${Math.round(earning)} for this delivery. Great job!`,
    tag: 'delivery-completed',
    requireInteraction: false,
    data: { orderId: order._id, type: 'delivery_completed', earning }
  });
};

/**
 * Show earning notification
 * @param {number} amount - Earning amount
 * @param {string} period - Period (e.g., 'today', 'this week')
 * @returns {Notification|null}
 */
export const showEarningNotification = (amount, period = 'today') => {
  return showNotification('💰 Earnings Update', {
    body: `You've earned ₹${Math.round(amount)} ${period}!`,
    tag: 'earning-update',
    requireInteraction: false,
    data: { type: 'earning_update', amount, period }
  });
};

/**
 * Show location update reminder
 * @returns {Notification|null}
 */
export const showLocationUpdateReminder = () => {
  return showNotification('📍 Location Update', {
    body: 'Please ensure your location is enabled for better order matching.',
    tag: 'location-reminder',
    requireInteraction: false,
    data: { type: 'location_reminder' }
  });
};

/**
 * Show offline reminder
 * @returns {Notification|null}
 */
export const showOfflineReminder = () => {
  return showNotification('⚫ You are Offline', {
    body: 'Go online to start receiving orders.',
    tag: 'offline-reminder',
    requireInteraction: false,
    data: { type: 'offline_reminder' }
  });
};

/**
 * Show KYC pending reminder
 * @returns {Notification|null}
 */
export const showKYCPendingReminder = () => {
  return showNotification('🆔 KYC Pending', {
    body: 'Complete your KYC to start accepting orders.',
    tag: 'kyc-reminder',
    requireInteraction: true,
    data: { type: 'kyc_reminder' }
  });
};

/**
 * Show generic alert
 * @param {string} message - Alert message
 * @param {string} type - Alert type (info, warning, error)
 * @returns {Notification|null}
 */
export const showAlert = (message, type = 'info') => {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  };

  const icon = icons[type] || icons.info;

  return showNotification(`${icon} Alert`, {
    body: message,
    tag: `alert-${type}`,
    requireInteraction: type === 'warning' || type === 'error',
    data: { type: 'alert', alertType: type }
  });
};

// ============================================
// SOUND NOTIFICATIONS
// ============================================

/**
 * Play notification sound
 * @param {string} soundUrl - URL of sound file
 * @returns {Promise<void>}
 */
export const playNotificationSound = async (soundUrl = '/assets/sounds/new-order.mp3') => {
  try {
    const audio = new Audio(soundUrl);
    audio.volume = 0.5; // 50% volume
    await audio.play();
    console.log('🔊 Notification sound played');
  } catch (error) {
    console.error('❌ Sound play error:', error);
  }
};

/**
 * Play new order sound
 * @returns {Promise<void>}
 */
export const playNewOrderSound = async () => {
  await playNotificationSound('/assets/sounds/new-order.mp3');
};

// ============================================
// NOTIFICATION WITH SOUND
// ============================================

/**
 * Show notification with sound
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @param {string} soundUrl - Sound URL (optional)
 * @returns {Notification|null}
 */
export const showNotificationWithSound = async (title, options = {}, soundUrl = null) => {
  const notification = showNotification(title, options);

  if (soundUrl) {
    await playNotificationSound(soundUrl);
  }

  return notification;
};

/**
 * Show new order with sound
 * @param {Object} order - Order object
 * @returns {Promise<Notification|null>}
 */
export const showNewOrderWithSound = async (order) => {
  const notification = showNewOrderNotification(order);
  await playNewOrderSound();
  return notification;
};

// ============================================
// NOTIFICATION CLICK HANDLERS
// ============================================

/**
 * Add click handler to notification
 * @param {Notification} notification - Notification instance
 * @param {Function} handler - Click handler function
 */
export const addNotificationClickHandler = (notification, handler) => {
  if (!notification) return;

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    
    if (handler) {
      handler(notification.data);
    }

    notification.close();
  };
};

/**
 * Setup default notification click handler
 * @param {Notification} notification - Notification instance
 * @param {Function} navigate - React Router navigate function
 */
export const setupDefaultClickHandler = (notification, navigate) => {
  if (!notification || !navigate) return;

  addNotificationClickHandler(notification, (data) => {
    if (data?.type === 'new_order') {
      navigate('/available-orders');
    } else if (data?.orderId) {
      navigate(`/my-orders`);
    } else if (data?.type === 'kyc_reminder') {
      navigate('/profile');
    }
  });
};

// ============================================
// NOTIFICATION MANAGEMENT
// ============================================

/**
 * Close notification by tag
 * @param {string} tag - Notification tag
 */
export const closeNotificationByTag = (tag) => {
  // Note: Browser API limitation - cannot programmatically close notifications
  console.log('Attempting to close notification with tag:', tag);
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => {
  console.log('Clearing all notifications');
  // Note: Browser API limitation
};

// ============================================
// NOTIFICATION SETTINGS
// ============================================

/**
 * Get notification settings from localStorage
 * @returns {Object} Notification settings
 */
export const getNotificationSettings = () => {
  try {
    const settings = localStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : {
      enabled: true,
      sound: true,
      newOrders: true,
      deliveryUpdates: true,
      earnings: true,
      system: true
    };
  } catch (error) {
    console.error('Error reading notification settings:', error);
    return { enabled: true, sound: true };
  }
};

/**
 * Save notification settings to localStorage
 * @param {Object} settings - Notification settings
 */
export const saveNotificationSettings = (settings) => {
  try {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    console.log('✅ Notification settings saved');
  } catch (error) {
    console.error('❌ Error saving notification settings:', error);
  }
};

/**
 * Check if notification type is enabled
 * @param {string} type - Notification type
 * @returns {boolean} True if enabled
 */
export const isNotificationTypeEnabled = (type) => {
  const settings = getNotificationSettings();
  return settings.enabled && settings[type] !== false;
};

// ============================================
// EXPORT ALL
// ============================================
export default {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  areNotificationsAllowed,
  showNotification,
  showNewOrderNotification,
  showOrderAcceptedNotification,
  showDeliveryStartedNotification,
  showDeliveryCompletedNotification,
  showEarningNotification,
  showLocationUpdateReminder,
  showOfflineReminder,
  showKYCPendingReminder,
  showAlert,
  playNotificationSound,
  playNewOrderSound,
  showNotificationWithSound,
  showNewOrderWithSound,
  addNotificationClickHandler,
  setupDefaultClickHandler,
  closeNotificationByTag,
  clearAllNotifications,
  getNotificationSettings,
  saveNotificationSettings,
  isNotificationTypeEnabled
};