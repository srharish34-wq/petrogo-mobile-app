/**
 * usePolling Hook
 * Location: bunk/src/hooks/usePolling.js
 */

import { useState, useEffect, useRef } from 'react';

export const usePolling = (callback, interval = 30000, enabled = true) => {
  const [isPolling, setIsPolling] = useState(enabled);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isPolling || !enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        await callbackRef.current();
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
    
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, isPolling, enabled]);

  const start = () => setIsPolling(true);
  const stop = () => setIsPolling(false);
  const toggle = () => setIsPolling(prev => !prev);

  const manualPoll = async () => {
    try {
      await callbackRef.current();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Manual poll error:', error);
      throw error;
    }
  };

  return {
    isPolling,
    lastUpdate,
    start,
    stop,
    toggle,
    manualPoll
  };
};

export default usePolling;