/**
 * Admin Context
 * Global admin state management
 * Location: admin/src/context/AdminContext.jsx
 */

import React, { createContext, useState, useCallback } from 'react';

/**
 * Create Admin Context
 */
export const AdminContext = createContext(null);

/**
 * Admin Context Provider Component
 */
export const AdminProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState({
    stats: [],
    loading: false,
    error: null
  });

  const [users, setUsers] = useState({
    list: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  });

  const [orders, setOrders] = useState({
    list: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  });

  const [notifications, setNotifications] = useState({
    list: [],
    unreadCount: 0
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('adminTheme') || 'light';
  });

  /**
   * Update dashboard stats
   */
  const updateDashboard = useCallback((data) => {
    setDashboard(prev => ({
      ...prev,
      stats: data,
      loading: false
    }));
  }, []);

  /**
   * Set dashboard loading
   */
  const setDashboardLoading = useCallback((loading) => {
    setDashboard(prev => ({
      ...prev,
      loading
    }));
  }, []);

  /**
   * Set dashboard error
   */
  const setDashboardError = useCallback((error) => {
    setDashboard(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);

  /**
   * Update users list
   */
  const updateUsers = useCallback((data, pagination = null) => {
    setUsers(prev => ({
      ...prev,
      list: data,
      loading: false,
      ...(pagination && { pagination })
    }));
  }, []);

  /**
   * Set users loading
   */
  const setUsersLoading = useCallback((loading) => {
    setUsers(prev => ({
      ...prev,
      loading
    }));
  }, []);

  /**
   * Set users error
   */
  const setUsersError = useCallback((error) => {
    setUsers(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);

  /**
   * Update orders list
   */
  const updateOrders = useCallback((data, pagination = null) => {
    setOrders(prev => ({
      ...prev,
      list: data,
      loading: false,
      ...(pagination && { pagination })
    }));
  }, []);

  /**
   * Set orders loading
   */
  const setOrdersLoading = useCallback((loading) => {
    setOrders(prev => ({
      ...prev,
      loading
    }));
  }, []);

  /**
   * Set orders error
   */
  const setOrdersError = useCallback((error) => {
    setOrders(prev => ({
      ...prev,
      error,
      loading: false
    }));
  }, []);

  /**
   * Add notification
   */
  const addNotification = useCallback((notification) => {
    setNotifications(prev => ({
      ...prev,
      list: [notification, ...prev.list],
      unreadCount: prev.unreadCount + 1
    }));
  }, []);

  /**
   * Clear notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications({
      list: [],
      unreadCount: 0
    });
  }, []);

  /**
   * Mark notification as read
   */
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => ({
      ...prev,
      list: prev.list.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
  }, []);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('adminTheme', newTheme);
      return newTheme;
    });
  }, []);

  /**
   * Context value
   */
  const value = {
    // Dashboard state and methods
    dashboard,
    updateDashboard,
    setDashboardLoading,
    setDashboardError,

    // Users state and methods
    users,
    updateUsers,
    setUsersLoading,
    setUsersError,

    // Orders state and methods
    orders,
    updateOrders,
    setOrdersLoading,
    setOrdersError,

    // Notifications state and methods
    notifications,
    addNotification,
    clearNotifications,
    markNotificationAsRead,

    // Theme state and methods
    theme,
    toggleTheme
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;