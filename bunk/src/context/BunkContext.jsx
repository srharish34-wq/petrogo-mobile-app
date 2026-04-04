/**
 * BunkContext
 * Location: bunk/src/context/BunkContext.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const BunkContext = createContext(null);

export const BunkProvider = ({ children }) => {
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

  const updateFuelStock = (fuelType, newStock) => {
    const updated = { ...bunk };
    if (updated.fuelStock && updated.fuelStock[fuelType.toLowerCase()]) {
      updated.fuelStock[fuelType.toLowerCase()].currentStock = newStock;
      setBunk(updated);
      localStorage.setItem('bunkData', JSON.stringify(updated));
    }
  };

  const updateFuelPrice = (fuelType, newPrice) => {
    const updated = { ...bunk };
    if (updated.fuelStock && updated.fuelStock[fuelType.toLowerCase()]) {
      updated.fuelStock[fuelType.toLowerCase()].pricePerLiter = newPrice;
      setBunk(updated);
      localStorage.setItem('bunkData', JSON.stringify(updated));
    }
  };

  const value = {
    bunk,
    loading,
    error,
    loadBunk,
    refreshBunk,
    updateBunkData,
    updateFuelStock,
    updateFuelPrice
  };

  return <BunkContext.Provider value={value}>{children}</BunkContext.Provider>;
};

export const useBunkContext = () => {
  const context = useContext(BunkContext);
  if (!context) {
    throw new Error('useBunkContext must be used within BunkProvider');
  }
  return context;
};

export default BunkContext;