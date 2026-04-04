/**
 * Users Service
 * Specialized service for all user-related API calls
 * Location: admin/src/services/usersService.js
 */

import api from './api';

/**
 * GET USERS
 */
export const getUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/admin/users?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

export const getUsersByStatus = async (status, page = 1, limit = 10) => {
  try {
    const response = await getUsers(page, limit, { status });
    return response;
  } catch (error) {
    console.error(`Error fetching ${status} users:`, error);
    throw error;
  }
};

export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/users/search?query=${query}&page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error searching users with query "${query}":`, error);
    throw error;
  }
};

export const getActiveUsers = async (page = 1, limit = 10) => {
  try {
    const response = await getUsersByStatus('active', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching active users:', error);
    throw error;
  }
};

export const getInactiveUsers = async (page = 1, limit = 10) => {
  try {
    const response = await getUsersByStatus('inactive', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    throw error;
  }
};

export const getSuspendedUsers = async (page = 1, limit = 10) => {
  try {
    const response = await getUsersByStatus('suspended', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching suspended users:', error);
    throw error;
  }
};

/**
 * CREATE USERS
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * UPDATE USERS
 */
export const updateUser = async (userId, data) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/profile`, profileData);
    return response;
  } catch (error) {
    console.error(`Error updating user ${userId} profile:`, error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response;
  } catch (error) {
    console.error(`Error updating user ${userId} status:`, error);
    throw error;
  }
};

/**
 * USER ACTIONS
 */
export const suspendUser = async (userId, reason = '') => {
  try {
    const response = await api.patch(`/admin/users/${userId}/suspend`, {
      reason,
      suspendedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error suspending user ${userId}:`, error);
    throw error;
  }
};

export const unsuspendUser = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/unsuspend`, {
      unsuspendedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error unsuspending user ${userId}:`, error);
    throw error;
  }
};

export const resetUserPassword = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/reset-password`, {});
    return response;
  } catch (error) {
    console.error(`Error resetting password for user ${userId}:`, error);
    throw error;
  }
};

export const sendVerificationEmail = async (userId) => {
  try {
    const response = await api.post(`/admin/users/${userId}/send-verification`, {});
    return response;
  } catch (error) {
    console.error(`Error sending verification email to user ${userId}:`, error);
    throw error;
  }
};

/**
 * DELETE USERS
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * USER ANALYTICS
 */
export const getUserStats = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/users/stats?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const getUserGrowth = async (months = 12) => {
  try {
    const response = await api.get(`/admin/users/growth?months=${months}`);
    return response;
  } catch (error) {
    console.error('Error fetching user growth:', error);
    throw error;
  }
};

export const getUserSegmentation = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/users/segmentation?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching user segmentation:', error);
    throw error;
  }
};

/**
 * USER DETAILS
 */
export const getUserOrders = async (userId, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/users/${userId}/orders?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

export const getUserPayments = async (userId, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/users/${userId}/payments?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching payments for user ${userId}:`, error);
    throw error;
  }
};

export const getUserActivityLog = async (userId, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/users/${userId}/activity?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching activity log for user ${userId}:`, error);
    throw error;
  }
};

/**
 * USER VALIDATION
 */
export const validateUserData = async (userData) => {
  try {
    const response = await api.post('/admin/users/validate', userData);
    return response;
  } catch (error) {
    console.error('Error validating user data:', error);
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await api.post('/admin/users/check-email', { email });
    return response;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

/**
 * USER EXPORT
 */
export const exportUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const link = document.createElement('a');
    link.href = `${api.defaults.baseURL}/admin/exports/users?${params}`;
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};

/**
 * BULK OPERATIONS
 */
export const bulkUpdateUserStatus = async (userIds, status) => {
  try {
    const response = await api.patch('/admin/users/bulk/status', {
      userIds,
      status
    });
    return response;
  } catch (error) {
    console.error('Error bulk updating users:', error);
    throw error;
  }
};

export const bulkSuspendUsers = async (userIds, reason = '') => {
  try {
    const response = await api.patch('/admin/users/bulk/suspend', {
      userIds,
      reason
    });
    return response;
  } catch (error) {
    console.error('Error bulk suspending users:', error);
    throw error;
  }
};

export const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await api.post('/admin/users/bulk/delete', {
      userIds
    });
    return response;
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
};

/**
 * Export all functions
 */
export default {
  // Get
  getUsers,
  getUserById,
  getUsersByStatus,
  searchUsers,
  getActiveUsers,
  getInactiveUsers,
  getSuspendedUsers,

  // Create
  createUser,

  // Update
  updateUser,
  updateUserProfile,
  updateUserStatus,

  // Actions
  suspendUser,
  unsuspendUser,
  resetUserPassword,
  sendVerificationEmail,

  // Delete
  deleteUser,

  // Analytics
  getUserStats,
  getUserGrowth,
  getUserSegmentation,

  // Details
  getUserOrders,
  getUserPayments,
  getUserActivityLog,

  // Validation
  validateUserData,
  checkEmailExists,

  // Export
  exportUsers,

  // Bulk
  bulkUpdateUserStatus,
  bulkSuspendUsers,
  bulkDeleteUsers
};