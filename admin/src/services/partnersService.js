/**
 * Partners Service
 * Specialized service for all delivery partner-related API calls
 * Location: admin/src/services/partnersService.js
 */

import api from './api';

/**
 * GET PARTNERS
 */
export const getPartners = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/admin/partners?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
};

export const getPartnerById = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching partner ${partnerId}:`, error);
    throw error;
  }
};

export const getPartnersByKYCStatus = async (kycStatus, page = 1, limit = 10) => {
  try {
    const response = await getPartners(page, limit, { kycStatus });
    return response;
  } catch (error) {
    console.error(`Error fetching ${kycStatus} KYC partners:`, error);
    throw error;
  }
};

export const getPendingKYCPartners = async (page = 1, limit = 10) => {
  try {
    const response = await getPartnersByKYCStatus('pending', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching pending KYC partners:', error);
    throw error;
  }
};

export const getApprovedPartners = async (page = 1, limit = 10) => {
  try {
    const response = await getPartnersByKYCStatus('approved', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching approved partners:', error);
    throw error;
  }
};

export const getRejectedPartners = async (page = 1, limit = 10) => {
  try {
    const response = await getPartnersByKYCStatus('rejected', page, limit);
    return response;
  } catch (error) {
    console.error('Error fetching rejected partners:', error);
    throw error;
  }
};

export const searchPartners = async (query, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/partners/search?query=${query}&page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error searching partners with query "${query}":`, error);
    throw error;
  }
};

export const getActivePartners = async (page = 1, limit = 10) => {
  try {
    const response = await getPartners(page, limit, { status: 'available' });
    return response;
  } catch (error) {
    console.error('Error fetching active partners:', error);
    throw error;
  }
};

export const getTopPartners = async (limit = 10) => {
  try {
    const response = await api.get(`/admin/partners/top?limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Error fetching top partners:', error);
    throw error;
  }
};

/**
 * CREATE PARTNERS
 */
export const createPartner = async (partnerData) => {
  try {
    const response = await api.post('/admin/partners', partnerData);
    return response;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};

/**
 * UPDATE PARTNERS
 */
export const updatePartner = async (partnerId, data) => {
  try {
    const response = await api.put(`/admin/partners/${partnerId}`, data);
    return response;
  } catch (error) {
    console.error(`Error updating partner ${partnerId}:`, error);
    throw error;
  }
};

export const updatePartnerStatus = async (partnerId, status) => {
  try {
    const response = await api.patch(`/admin/partners/${partnerId}/status`, {
      status
    });
    return response;
  } catch (error) {
    console.error(`Error updating partner ${partnerId} status:`, error);
    throw error;
  }
};

/**
 * KYC MANAGEMENT
 */
export const approveKYC = async (partnerId, documents = {}) => {
  try {
    const response = await api.patch(`/admin/partners/${partnerId}/kyc/approve`, {
      documents,
      approvedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error approving KYC for partner ${partnerId}:`, error);
    throw error;
  }
};

export const rejectKYC = async (partnerId, reason = '') => {
  try {
    const response = await api.patch(`/admin/partners/${partnerId}/kyc/reject`, {
      reason,
      rejectedAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error rejecting KYC for partner ${partnerId}:`, error);
    throw error;
  }
};

export const getKYCDetails = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}/kyc`);
    return response;
  } catch (error) {
    console.error(`Error fetching KYC details for partner ${partnerId}:`, error);
    throw error;
  }
};

export const uploadKYCDocument = async (partnerId, documentType, file) => {
  try {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post(
      `/admin/partners/${partnerId}/kyc/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response;
  } catch (error) {
    console.error(`Error uploading KYC document for partner ${partnerId}:`, error);
    throw error;
  }
};

/**
 * DELETE PARTNERS
 */
export const deletePartner = async (partnerId) => {
  try {
    const response = await api.delete(`/admin/partners/${partnerId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting partner ${partnerId}:`, error);
    throw error;
  }
};

/**
 * PARTNER PERFORMANCE
 */
export const getPartnerStats = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}/stats`);
    return response;
  } catch (error) {
    console.error(`Error fetching stats for partner ${partnerId}:`, error);
    throw error;
  }
};

export const getPartnerEarnings = async (partnerId, startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/partners/${partnerId}/earnings?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching earnings for partner ${partnerId}:`, error);
    throw error;
  }
};

export const getPartnerOrders = async (partnerId, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/partners/${partnerId}/orders?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching orders for partner ${partnerId}:`, error);
    throw error;
  }
};

export const getPartnerRating = async (partnerId) => {
  try {
    const response = await api.get(`/admin/partners/${partnerId}/rating`);
    return response;
  } catch (error) {
    console.error(`Error fetching rating for partner ${partnerId}:`, error);
    throw error;
  }
};

export const getPartnerReviews = async (partnerId, page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/partners/${partnerId}/reviews?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching reviews for partner ${partnerId}:`, error);
    throw error;
  }
};

/**
 * PARTNER ANALYTICS
 */
export const getPartnersStats = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/partners/stats?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching partners stats:', error);
    throw error;
  }
};

export const getPartnersGrowth = async (months = 12) => {
  try {
    const response = await api.get(`/admin/partners/growth?months=${months}`);
    return response;
  } catch (error) {
    console.error('Error fetching partners growth:', error);
    throw error;
  }
};

export const getPartnersPerformance = async (startDate, endDate, limit = 10) => {
  try {
    const response = await api.get(
      `/admin/partners/performance?startDate=${startDate}&endDate=${endDate}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching partners performance:', error);
    throw error;
  }
};

export const getPartnersUtilization = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/admin/partners/utilization?startDate=${startDate}&endDate=${endDate}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching partners utilization:', error);
    throw error;
  }
};

/**
 * PARTNER COMMUNICATION
 */
export const sendMessageToPartner = async (partnerId, message) => {
  try {
    const response = await api.post(`/admin/partners/${partnerId}/message`, {
      message,
      sentAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error sending message to partner ${partnerId}:`, error);
    throw error;
  }
};

export const sendNotificationToPartner = async (partnerId, notification) => {
  try {
    const response = await api.post(`/admin/partners/${partnerId}/notification`, {
      notification,
      sentAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    console.error(`Error sending notification to partner ${partnerId}:`, error);
    throw error;
  }
};

/**
 * PARTNER VALIDATION
 */
export const validatePartnerData = async (partnerData) => {
  try {
    const response = await api.post('/admin/partners/validate', partnerData);
    return response;
  } catch (error) {
    console.error('Error validating partner data:', error);
    throw error;
  }
};

/**
 * PARTNER EXPORT
 */
export const exportPartners = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const link = document.createElement('a');
    link.href = `${api.defaults.baseURL}/admin/exports/partners?${params}`;
    link.download = `partners-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting partners:', error);
    throw error;
  }
};

/**
 * BULK OPERATIONS
 */
export const bulkApproveKYC = async (partnerIds) => {
  try {
    const response = await api.patch('/admin/partners/bulk/kyc/approve', {
      partnerIds
    });
    return response;
  } catch (error) {
    console.error('Error bulk approving KYC:', error);
    throw error;
  }
};

export const bulkRejectKYC = async (partnerIds, reason = '') => {
  try {
    const response = await api.patch('/admin/partners/bulk/kyc/reject', {
      partnerIds,
      reason
    });
    return response;
  } catch (error) {
    console.error('Error bulk rejecting KYC:', error);
    throw error;
  }
};

export const bulkUpdatePartnerStatus = async (partnerIds, status) => {
  try {
    const response = await api.patch('/admin/partners/bulk/status', {
      partnerIds,
      status
    });
    return response;
  } catch (error) {
    console.error('Error bulk updating partners status:', error);
    throw error;
  }
};

export const bulkDeletePartners = async (partnerIds) => {
  try {
    const response = await api.post('/admin/partners/bulk/delete', {
      partnerIds
    });
    return response;
  } catch (error) {
    console.error('Error bulk deleting partners:', error);
    throw error;
  }
};

/**
 * Export all functions
 */
export default {
  // Get
  getPartners,
  getPartnerById,
  getPartnersByKYCStatus,
  getPendingKYCPartners,
  getApprovedPartners,
  getRejectedPartners,
  searchPartners,
  getActivePartners,
  getTopPartners,

  // Create
  createPartner,

  // Update
  updatePartner,
  updatePartnerStatus,

  // KYC
  approveKYC,
  rejectKYC,
  getKYCDetails,
  uploadKYCDocument,

  // Delete
  deletePartner,

  // Performance
  getPartnerStats,
  getPartnerEarnings,
  getPartnerOrders,
  getPartnerRating,
  getPartnerReviews,

  // Analytics
  getPartnersStats,
  getPartnersGrowth,
  getPartnersPerformance,
  getPartnersUtilization,

  // Communication
  sendMessageToPartner,
  sendNotificationToPartner,

  // Validation
  validatePartnerData,

  // Export
  exportPartners,

  // Bulk
  bulkApproveKYC,
  bulkRejectKYC,
  bulkUpdatePartnerStatus,
  bulkDeletePartners
};