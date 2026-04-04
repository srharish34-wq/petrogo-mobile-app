/**
 * usePolling Hook
 * Poll for data at regular intervals
 * Location: partner/src/hooks/usePolling.js
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const usePolling = (
  pollingFunction,
  interval = 10000, // Default 10 seconds
  options = {}
) => {
  const {
    enabled = true,
    onSuccess = null,
    onError = null,
    runImmediately = true,
    pauseOnError = false,
    maxRetries = 3
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  /**
   * Execute the polling function
   */
  const poll = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const result = await pollingFunction();

      if (!mountedRef.current) return;

      setData(result);
      setRetryCount(0); // Reset retry count on success

      if (onSuccess) {
        onSuccess(result);
      }

      console.log('✅ Polling successful');
    } catch (err) {
      if (!mountedRef.current) return;

      console.error('❌ Polling error:', err);
      setError(err.message || 'Polling failed');
      setRetryCount(prev => prev + 1);

      if (onError) {
        onError(err);
      }

      // Stop polling if max retries reached
      if (pauseOnError && retryCount >= maxRetries) {
        console.warn('⚠️ Max retries reached, stopping polling');
        stopPolling();
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [pollingFunction, onSuccess, onError, retryCount, maxRetries, pauseOnError]);

  /**
   * Start polling
   */
  const startPolling = useCallback(() => {
    if (isPolling) {
      console.warn('⚠️ Polling already started');
      return;
    }

    console.log('🔄 Starting polling with interval:', interval, 'ms');
    setIsPolling(true);
    setRetryCount(0);

    // Run immediately if enabled
    if (runImmediately) {
      poll();
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      poll();
    }, interval);
  }, [isPolling, interval, runImmediately, poll]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (!isPolling) {
      console.warn('⚠️ Polling not active');
      return;
    }

    console.log('⏸️ Stopping polling');

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsPolling(false);
  }, [isPolling]);

  /**
   * Manually trigger a poll
   */
  const triggerPoll = useCallback(async () => {
    await poll();
  }, [poll]);

  /**
   * Reset polling (stop and start)
   */
  const resetPolling = useCallback(() => {
    stopPolling();
    setTimeout(() => {
      startPolling();
    }, 100);
  }, [stopPolling, startPolling]);

  // Auto-start polling if enabled
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]); // Only depend on enabled

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    // State
    data,
    loading,
    error,
    isPolling,
    retryCount,

    // Actions
    startPolling,
    stopPolling,
    triggerPoll,
    resetPolling
  };
};

/**
 * Specialized hook for polling orders
 */
export const useOrderPolling = (fetchFunction, interval = 15000, options = {}) => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const previousDataRef = useRef(null);

  const pollingOptions = {
    ...options,
    onSuccess: (data) => {
      // Check for new orders
      if (previousDataRef.current) {
        const previousIds = new Set(previousDataRef.current.map(o => o._id));
        const newOrders = data.filter(o => !previousIds.has(o._id));
        
        if (newOrders.length > 0) {
          setNewOrdersCount(newOrders.length);
          console.log('🆕 New orders detected:', newOrders.length);
        }
      }

      previousDataRef.current = data;

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    }
  };

  const polling = usePolling(fetchFunction, interval, pollingOptions);

  const clearNewOrdersCount = useCallback(() => {
    setNewOrdersCount(0);
  }, []);

  return {
    ...polling,
    newOrdersCount,
    clearNewOrdersCount
  };
};