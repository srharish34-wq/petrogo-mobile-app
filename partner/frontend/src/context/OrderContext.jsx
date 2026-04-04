/**
 * Order Context
 * Global orders state management
 * Location: partner/src/context/OrderContext.jsx
 */

import { createContext, useContext, useCallback } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderPolling } from '../hooks/usePolling';
import { usePartnerContext } from './PartnerContext';
import { orderService } from '../services/orderService';

// Create Context
const OrderContext = createContext(null);

/**
 * Order Provider Component
 */
export const OrderProvider = ({ children }) => {
  const { partner } = usePartnerContext();
  const partnerId = partner?._id;

  // Use orders hook
  const ordersData = useOrders(partnerId, {
    autoRefresh: false // We'll use polling instead
  });

  // Polling for available orders (every 15 seconds)
  const availableOrdersPolling = useOrderPolling(
    async () => {
      const response = await orderService.getAvailableOrders();
      return response.data?.orders || [];
    },
    15000, // 15 seconds
    {
      enabled: !!partnerId && partner?.isAvailable === true,
      onSuccess: (orders) => {
        // Update available orders in ordersData
        ordersData.fetchAvailableOrders();
      },
      onError: (error) => {
        console.error('❌ Available orders polling error:', error);
      }
    }
  );

  // Polling for partner orders (every 30 seconds)
  const partnerOrdersPolling = useOrderPolling(
    async () => {
      if (!partnerId) return [];
      const response = await orderService.getPartnerOrders(partnerId);
      return response.data?.orders || [];
    },
    30000, // 30 seconds
    {
      enabled: !!partnerId,
      onSuccess: (orders) => {
        // Update partner orders
        ordersData.fetchPartnerOrders();
      },
      onError: (error) => {
        console.error('❌ Partner orders polling error:', error);
      }
    }
  );

  // Refresh all orders manually
  const refreshAllOrders = useCallback(async () => {
    await ordersData.refreshOrders();
    availableOrdersPolling.triggerPoll();
    partnerOrdersPolling.triggerPoll();
  }, [ordersData, availableOrdersPolling, partnerOrdersPolling]);

  const contextValue = {
    ...ordersData,
    
    // Polling state
    isPollingAvailable: availableOrdersPolling.isPolling,
    isPollingPartner: partnerOrdersPolling.isPolling,
    newOrdersCount: availableOrdersPolling.newOrdersCount,
    
    // Polling actions
    startPolling: () => {
      availableOrdersPolling.startPolling();
      partnerOrdersPolling.startPolling();
    },
    stopPolling: () => {
      availableOrdersPolling.stopPolling();
      partnerOrdersPolling.stopPolling();
    },
    refreshAllOrders,
    clearNewOrdersCount: availableOrdersPolling.clearNewOrdersCount
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

/**
 * Custom hook to use Order Context
 */
export const useOrderContext = () => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrderContext must be used within OrderProvider');
  }
  
  return context;
};

export default OrderContext;