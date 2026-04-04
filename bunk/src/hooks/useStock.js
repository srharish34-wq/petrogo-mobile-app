/**
 * useStock Hook
 * Location: bunk/src/hooks/useStock.js
 */

import { useState, useEffect } from 'react';
import stockService from '../services/stockService';

export const useStock = (autoLoad = true) => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (autoLoad) {
      loadStock();
    }
  }, [autoLoad]);

  const loadStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await stockService.getStock();
      setStock(response.data?.stock);
      
      return response.data?.stock;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (fuelType, quantity, action = 'set') => {
    try {
      setError(null);
      const response = await stockService.updateStock(fuelType, quantity, action);
      
      await loadStock();
      
      return response.data?.stock;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePrice = async (fuelType, price, effectiveDate = 'immediate') => {
    try {
      setError(null);
      const response = await stockService.updatePrice(fuelType, price, effectiveDate);
      
      await loadStock();
      
      return response.data?.stock;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getLowStockAlerts = async () => {
    try {
      setError(null);
      const response = await stockService.getLowStockAlerts();
      return response.data?.alerts || [];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getStockHistory = async (params = {}) => {
    try {
      setError(null);
      const response = await stockService.getStockHistory(params);
      return response.data?.history || [];
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getStockValue = async () => {
    try {
      setError(null);
      const response = await stockService.getStockValue();
      return response.data?.value || 0;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    stock,
    loading,
    error,
    loadStock,
    updateStock,
    updatePrice,
    getLowStockAlerts,
    getStockHistory,
    getStockValue,
    setStock
  };
};

export default useStock;