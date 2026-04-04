/**
 * UpdatePriceModal Component
 * Modal to update fuel price per liter
 * Location: bunk/src/components/modals/UpdatePriceModal.jsx
 */

import { useState } from 'react';

export default function UpdatePriceModal({ isOpen, fuelType, currentPrice, onClose, onConfirm }) {
  const [newPrice, setNewPrice] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('immediate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const priceChange = newPrice ? (parseFloat(newPrice) - currentPrice).toFixed(2) : 0;
  const priceChangePercent = currentPrice ? ((priceChange / currentPrice) * 100).toFixed(2) : 0;

  const handleConfirm = async () => {
    setError('');

    // Validation
    if (!newPrice || parseFloat(newPrice) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (parseFloat(newPrice) === currentPrice) {
      setError('New price is same as current price');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(fuelType, parseFloat(newPrice), effectiveDate);
      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to update price');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewPrice('');
    setEffectiveDate('immediate');
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
                <h2 className="text-2xl font-bold">Update Price</h2>
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
          
          {/* Current Price */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Current Price</p>
            <p className="text-5xl font-bold text-gray-900">
              ₹{currentPrice}
              <span className="text-lg text-gray-600">/L</span>
            </p>
          </div>

          {/* New Price Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              New Price per Liter (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-gray-400">
                ₹
              </span>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-12 pr-12 py-4 text-3xl font-bold border-2 rounded-xl focus:outline-none transition ${
                  error 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                min="0"
                step="0.10"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-400">
                /L
              </span>
            </div>
          </div>

          {/* Price Change Preview */}
          {newPrice && priceChange != 0 && (
            <div className={`rounded-xl p-4 ${
              priceChange > 0 ? 'bg-red-50 border-2 border-red-500' : 'bg-green-50 border-2 border-green-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 mb-1">Price Change</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-3xl font-bold ${priceChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {priceChange > 0 ? '↑' : '↓'} ₹{Math.abs(priceChange)}
                    </p>
                    <span className={`text-lg font-bold ${priceChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ({priceChangePercent > 0 ? '+' : ''}{priceChangePercent}%)
                    </span>
                  </div>
                </div>
                <span className="text-3xl">
                  {priceChange > 0 ? '📈' : '📉'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Adjust Buttons */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-2">Quick Adjust</p>
            <div className="grid grid-cols-4 gap-2">
              {[-5, -1, +1, +5].map((adjustment) => (
                <button
                  key={adjustment}
                  onClick={() => setNewPrice((currentPrice + adjustment).toFixed(2))}
                  className={`py-2 px-3 rounded-lg font-bold text-sm transition ${
                    adjustment > 0 
                      ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  {adjustment > 0 ? '+' : ''}{adjustment}
                </button>
              ))}
            </div>
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              When to Apply
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setEffectiveDate('immediate')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${
                  effectiveDate === 'immediate'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-gray-900">⚡ Immediate</p>
                  <p className="text-xs text-gray-600">Apply price change now</p>
                </div>
                {effectiveDate === 'immediate' && (
                  <span className="text-orange-500 text-xl">✓</span>
                )}
              </button>

              <button
                onClick={() => setEffectiveDate('tomorrow')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${
                  effectiveDate === 'tomorrow'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-gray-900">📅 Tomorrow</p>
                  <p className="text-xs text-gray-600">Apply from tomorrow 00:00 AM</p>
                </div>
                {effectiveDate === 'tomorrow' && (
                  <span className="text-orange-500 text-xl">✓</span>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <p className="text-xs font-bold text-yellow-900 mb-1">⚠️ Important:</p>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• Price change will affect all future orders</li>
              <li>• Customers will be notified of price update</li>
              <li>• Existing pending orders won't be affected</li>
            </ul>
          </div>

          {/* Confirmation */}
          {newPrice && priceChange != 0 && (
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800">
                ✅ Confirm {fuelType} price change from <strong>₹{currentPrice}</strong> to <strong>₹{newPrice}</strong> per liter
              </p>
            </div>
          )}

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
            disabled={isLoading || !newPrice || priceChange == 0}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white font-bold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? '⏳ Updating...' : '✅ Update Price'}
          </button>
        </div>

      </div>
    </div>
  );
}