/**
 * UpdateStockModal Component
 * Modal to update fuel stock levels
 * Location: bunk/src/components/modals/UpdateStockModal.jsx
 */

import { useState } from 'react';

export default function UpdateStockModal({ isOpen, fuelType, currentStock, capacity, onClose, onConfirm }) {
  const [updateType, setUpdateType] = useState('add'); // 'add' or 'set'
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculateNewStock = () => {
    const numAmount = parseFloat(amount) || 0;
    if (updateType === 'add') {
      return currentStock + numAmount;
    }
    return numAmount;
  };

  const newStock = calculateNewStock();
  const isValid = newStock >= 0 && newStock <= capacity;

  const handleConfirm = async () => {
    setError('');

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!isValid) {
      setError(`Stock cannot exceed capacity (${capacity}L)`);
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(fuelType, newStock, updateType);
      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to update stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setUpdateType('add');
    setError('');
    onClose();
  };

  const getFuelIcon = (type) => {
    return type?.toLowerCase() === 'petrol' ? '⛽' : '🛢️';
  };

  const getFuelColor = (type) => {
    return type?.toLowerCase() === 'petrol' 
      ? 'from-orange-500 to-red-600' 
      : 'from-blue-500 to-blue-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getFuelColor(fuelType)} text-white px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getFuelIcon(fuelType)}</span>
              <div>
                <h2 className="text-2xl font-bold">Update Stock</h2>
                <p className="text-sm opacity-90">{fuelType?.toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Current Stock Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentStock.toLocaleString('en-IN')}L
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tank Capacity</p>
                <p className="text-3xl font-bold text-orange-600">
                  {capacity.toLocaleString('en-IN')}L
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${(currentStock / capacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-1">
                {((currentStock / capacity) * 100).toFixed(1)}% filled
              </p>
            </div>
          </div>

          {/* Update Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Update Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUpdateType('add')}
                className={`py-3 px-4 rounded-xl font-bold transition ${
                  updateType === 'add'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ➕ Add Stock
              </button>
              <button
                onClick={() => setUpdateType('set')}
                className={`py-3 px-4 rounded-xl font-bold transition ${
                  updateType === 'set'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📝 Set Stock
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {updateType === 'add' 
                ? '➕ Add to existing stock' 
                : '📝 Set new total stock value'}
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              {updateType === 'add' ? 'Amount to Add (Liters)' : 'New Total Stock (Liters)'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in liters"
                className={`w-full px-4 py-4 pr-12 text-2xl font-bold border-2 rounded-xl focus:outline-none transition ${
                  error 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                min="0"
                step="0.01"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                L
              </span>
            </div>
          </div>

          {/* New Stock Preview */}
          {amount && (
            <div className={`rounded-xl p-4 ${isValid ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 mb-1">New Stock Level</p>
                  <p className={`text-3xl font-bold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {newStock.toLocaleString('en-IN')}L
                  </p>
                </div>
                <span className="text-3xl">
                  {isValid ? '✅' : '❌'}
                </span>
              </div>
              {!isValid && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Stock exceeds tank capacity!
                </p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Quick Add Buttons */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Quick Add</p>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 5000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => {
                    setUpdateType('add');
                    setAmount(quickAmount.toString());
                  }}
                  className="py-2 px-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg font-bold text-sm transition"
                >
                  +{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>📋 Note:</strong> Stock update will be recorded with timestamp. Ensure accuracy before confirming.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !amount || !isValid}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white font-bold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? '⏳ Updating...' : '✅ Update Stock'}
          </button>
        </div>

      </div>
    </div>
  );
}