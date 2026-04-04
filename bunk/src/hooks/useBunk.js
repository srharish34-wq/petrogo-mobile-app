/**
 * useBunk Hook
 * Location: bunk/src/hooks/useBunk.js
 */

import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useBunk = () => {
  const [bunk, setBunk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBunk();
  }, []);

  const loadBunk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bunkData = authService.getBunkData();
      setBunk(bunkData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshBunk = async () => {
    try {
      const response = await authService.getCurrentBunk();
      setBunk(response.data?.bunk);
      return response.data?.bunk;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBunkData = (data) => {
    const updated = { ...bunk, ...data };
    setBunk(updated);
    localStorage.setItem('bunkData', JSON.stringify(updated));
  };

  return {
    bunk,
    loading,
    error,
    loadBunk,
    refreshBunk,
    updateBunkData
  };
};

export default useBunk;