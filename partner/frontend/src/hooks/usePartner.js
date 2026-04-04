/**
 * usePartner Hook
 * Partner-specific data and operations
 * Location: partner/src/hooks/usePartner.js
 */

import { useState, useEffect, useCallback } from 'react';
import { partnerService } from '../services/partnerService';

export const usePartner = (partnerId) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch partner data
   */
  const fetchPartner = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get from localStorage first
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setPartner(parsedData);
          console.log('✅ Partner data loaded from localStorage');
        } catch (parseErr) {
          console.error('❌ Error parsing stored data:', parseErr);
        }
      }

      // Get phone from localStorage or userData
      const userData = storedData ? JSON.parse(storedData) : {};
      const phone = userData.phone || userData.user?.phone || localStorage.getItem('userPhone');

      console.log('🔍 Looking for partner with phone:', phone);

      if (phone) {
        try {
          const response = await partnerService.getPartnerByPhone(phone);
          
          console.log('📋 Partner API Response:', response);

          if (response && response.data && response.data.partner) {
            const partnerData = response.data.partner;
            
            // Update localStorage
            localStorage.setItem('userData', JSON.stringify(partnerData));
            
            // Update state
            setPartner(partnerData);
            
            console.log('✅ Partner data fetched from backend:', partnerData);
          } else {
            console.warn('⚠️ No partner data in response:', response);
          }
        } catch (apiErr) {
          console.error('❌ API Error fetching partner:', apiErr);
          // Don't throw - use localStorage data as fallback
        }
      } else {
        console.warn('⚠️ No phone number found to fetch partner');
      }
    } catch (err) {
      console.error('❌ Fetch partner error:', err);
      setError(err.message || 'Failed to fetch partner data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle partner availability (online/offline)
   */
  const toggleAvailability = useCallback(async () => {
    if (!partnerId || !partner) {
      console.warn('⚠️ Cannot toggle: partnerId or partner missing');
      return;
    }

    try {
      const newStatus = partner.isAvailable ? 'offline' : 'available';
      const newAvailability = !partner.isAvailable;

      const response = await partnerService.updateAvailability(
        partnerId,
        newAvailability,
        newStatus
      );

      if (response && response.status === 'success') {
        // Update local state
        const updatedPartner = {
          ...partner,
          isAvailable: newAvailability,
          currentStatus: newStatus
        };

        setPartner(updatedPartner);

        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(updatedPartner));

        console.log('✅ Availability toggled to:', newStatus);
        return { success: true, status: newStatus };
      }
    } catch (err) {
      console.error('❌ Toggle availability error:', err);
      setError(err.message || 'Failed to update availability');
      return { success: false, error: err.message };
    }
  }, [partnerId, partner]);

  /**
   * Update partner location
   */
  const updateLocation = useCallback(async (latitude, longitude, address = '') => {
    if (!partnerId) {
      console.warn('⚠️ Cannot update location: partnerId missing');
      return;
    }

    try {
      const response = await partnerService.updateLocation(
        partnerId,
        longitude,
        latitude,
        address
      );

      if (response && response.status === 'success') {
        // Update local state
        const updatedPartner = {
          ...partner,
          currentLocation: {
            type: 'Point',
            coordinates: [longitude, latitude],
            address,
            lastUpdated: new Date()
          }
        };

        setPartner(updatedPartner);

        console.log('✅ Location updated');
        return { success: true };
      }
    } catch (err) {
      console.error('❌ Update location error:', err);
      return { success: false, error: err.message };
    }
  }, [partnerId, partner]);

  /**
   * Get partner earnings
   */
  const fetchEarnings = useCallback(async () => {
    if (!partnerId) {
      console.warn('⚠️ Cannot fetch earnings: partnerId missing');
      return null;
    }

    try {
      const response = await partnerService.getEarnings(partnerId);
      
      if (response && response.status === 'success') {
        return response.data;
      }
    } catch (err) {
      console.error('❌ Fetch earnings error:', err);
      return null;
    }
  }, [partnerId]);

  /**
   * Get partner statistics
   */
  const getStats = useCallback(() => {
    if (!partner) return null;

    return {
      totalDeliveries: partner.performance?.totalDeliveries || 0,
      completedDeliveries: partner.performance?.completedDeliveries || 0,
      cancelledDeliveries: partner.performance?.cancelledDeliveries || 0,
      rating: partner.performance?.rating?.average || 0,
      ratingCount: partner.performance?.rating?.count || 0,
      onTimeRate: partner.performance?.onTimeDeliveryRate || 0,
      totalEarnings: partner.earnings?.total || 0,
      pendingEarnings: partner.earnings?.pending || 0,
      withdrawnEarnings: partner.earnings?.withdrawn || 0
    };
  }, [partner]);

  /**
   * Check if partner is available
   */
  const isAvailable = useCallback(() => {
    return partner?.isAvailable === true;
  }, [partner]);

  /**
   * Check if partner is online
   */
  const isOnline = useCallback(() => {
    return partner?.currentStatus === 'available' || partner?.currentStatus === 'busy';
  }, [partner]);

  /**
   * Check if partner can accept orders
   */
  const canAcceptOrders = useCallback(() => {
    return (
      partner?.kycStatus === 'approved' &&
      partner?.isAvailable === true &&
      partner?.currentStatus === 'available'
    );
  }, [partner]);

  // Fetch partner data on mount
  useEffect(() => {
    console.log('🚀 usePartner hook mounted, fetching partner data...');
    fetchPartner();
  }, [fetchPartner]);

  return {
    // State
    partner,
    loading,
    error,
    
    // Actions
    fetchPartner,
    toggleAvailability,
    updateLocation,
    fetchEarnings,
    
    // Utilities
    getStats,
    isAvailable,
    isOnline,
    canAcceptOrders
  };
};
