/**
 * useNotification Hook
 * Browser notifications and alerts
 * Location: partner/src/hooks/useNotification.js
 */

import { useState, useEffect, useCallback } from 'react';

export const useNotification = (options = {}) => {
  const {
    requestOnMount = false,
    defaultIcon = '/favicon.ico',
    defaultSound = null
  } = options;

  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  /**
   * Check if notifications are supported
   */
  const checkSupport = useCallback(() => {
    const supported = 'Notification' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
    
    return supported;
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('⚠️ Notifications not supported');
      return false;
    }

    if (permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        console.log('✅ Notification permission granted');
        return true;
      } else {
        console.warn('⚠️ Notification permission denied');
        return false;
      }
    } catch (err) {
      console.error('❌ Request permission error:', err);
      return false;
    }
  }, [isSupported, permission]);

  /**
   * Show notification
   */
  const showNotification = useCallback(async (title, options = {}) => {
    if (!isSupported) {
      console.warn('⚠️ Notifications not supported');
      return null;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        console.warn('⚠️ Cannot show notification without permission');
        return null;
      }
    }

    try {
      const notificationOptions = {
        icon: defaultIcon,
        badge: defaultIcon,
        ...options
      };

      const notification = new Notification(title, notificationOptions);

      // Play sound if provided
      if (defaultSound || options.sound) {
        const audio = new Audio(options.sound || defaultSound);
        audio.play().catch(err => console.error('Sound play error:', err));
      }

      console.log('✅ Notification shown:', title);
      return notification;
    } catch (err) {
      console.error('❌ Show notification error:', err);
      return null;
    }
  }, [isSupported, permission, requestPermission, defaultIcon, defaultSound]);

  /**
   * Show order notification
   */
  const showOrderNotification = useCallback(async (order) => {
    const title = '🆕 New Order Available!';
    const body = `${order.fuelDetails?.quantity}L ${order.fuelDetails?.type?.toUpperCase()} - ₹${Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))} earning`;

    return await showNotification(title, {
      body,
      tag: 'new-order',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { orderId: order._id }
    });
  }, [showNotification]);

  /**
   * Show delivery notification
   */
  const showDeliveryNotification = useCallback(async (message, type = 'info') => {
    const titles = {
      success: '✅ Delivery Completed',
      info: '📦 Delivery Update',
      warning: '⚠️ Attention Required',
      error: '❌ Delivery Issue'
    };

    return await showNotification(titles[type] || titles.info, {
      body: message,
      tag: 'delivery-update',
      requireInteraction: type === 'warning' || type === 'error'
    });
  }, [showNotification]);

  /**
   * Show earning notification
   */
  const showEarningNotification = useCallback(async (amount) => {
    const title = '💰 Earnings Update';
    const body = `You earned ₹${amount}! Great job!`;

    return await showNotification(title, {
      body,
      tag: 'earning-update',
      requireInteraction: false
    });
  }, [showNotification]);

  /**
   * Show generic alert notification
   */
  const showAlert = useCallback(async (message, options = {}) => {
    return await showNotification('🔔 Alert', {
      body: message,
      requireInteraction: false,
      ...options
    });
  }, [showNotification]);

  /**
   * Close all notifications with specific tag
   */
  const closeNotificationsByTag = useCallback((tag) => {
    // Note: This is limited by browser API
    console.log('Attempting to close notifications with tag:', tag);
  }, []);

  // Check support on mount
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  // Request permission on mount if enabled
  useEffect(() => {
    if (requestOnMount && isSupported && permission === 'default') {
      requestPermission();
    }
  }, [requestOnMount, isSupported, permission, requestPermission]);

  return {
    // State
    permission,
    isSupported,

    // Actions
    requestPermission,
    showNotification,
    showOrderNotification,
    showDeliveryNotification,
    showEarningNotification,
    showAlert,
    closeNotificationsByTag,

    // Utilities
    canShowNotifications: permission === 'granted' && isSupported
  };
};

/**
 * Hook for notification with sound alerts
 */
export const useNotificationWithSound = (soundUrl, options = {}) => {
  const notification = useNotification({
    ...options,
    defaultSound: soundUrl
  });

  const playSound = useCallback(() => {
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play().catch(err => console.error('Sound play error:', err));
    }
  }, [soundUrl]);

  return {
    ...notification,
    playSound
  };
};