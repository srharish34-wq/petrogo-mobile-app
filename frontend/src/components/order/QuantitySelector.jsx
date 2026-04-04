/**
 * Quantity Selector Component
 * Select fuel quantity with validation
 */

import { useState, useEffect } from 'react';
import { MAX_FUEL_LIMIT, MIN_FUEL_LIMIT } from '../../utils/constants';

export default function QuantitySelector({ 
  quantity, 
  onQuantityChange, 
  pricePerLiter,
  maxLimit = MAX_FUEL_LIMIT 
}) {
  const [inputMode, setInputMode] = useState('preset'); // 'preset' or 'custom'
  const [customValue, setCustomValue] = useState('');

  // Preset quantities
  const presetQuantities = [1, 2, 3, 4, 5];

  // Calculate total cost
  const totalCost = (quantity * pricePerLiter).toFixed(2);

  // Handle preset button click
  const handlePresetClick = (value) => {
    setInputMode('preset');
    onQuantityChange(value);
  };

  // Handle custom input
  const handleCustomInput = (value) => {
    setCustomValue(value);
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) && numValue >= MIN_FUEL_LIMIT && numValue <= maxLimit) {
      onQuantityChange(numValue);
    }
  };

  // Toggle input mode
  const handleInputModeToggle = () => {
    if (inputMode === 'preset') {
      setInputMode('custom');
      setCustomValue(quantity.toString());
    } else {
      setInputMode('preset');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-lg font-bold text-gray-900">
          Select Quantity
        </label>
        <button
          onClick={handleInputModeToggle}
          className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
        >
          {inputMode === 'preset' ? '✏️ Custom Amount' : '🔢 Preset Amounts'}
        </button>
      </div>

      {/* Preset Quantities */}
      {inputMode === 'preset' && (
        <div className="grid grid-cols-5 gap-3">
          {presetQuantities.map((value) => {
            const isSelected = quantity === value;
            const cost = (value * pricePerLiter).toFixed(2);

            return (
              <button
                key={value}
                onClick={() => handlePresetClick(value)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-primary-600 bg-primary-600 text-white shadow-lg scale-110'
                    : 'border-gray-300 bg-white text-gray-900 hover:border-primary-300 hover:bg-primary-50'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-primary-600'}`}>
                    {value}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                    Liter{value > 1 ? 's' : ''}
                  </div>
                  <div className={`text-sm font-semibold mt-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    ₹{cost}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom Input */}
      {inputMode === 'custom' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={customValue}
              onChange={(e) => handleCustomInput(e.target.value)}
              min={MIN_FUEL_LIMIT}
              max={maxLimit}
              step="0.5"
              placeholder={`Enter quantity (${MIN_FUEL_LIMIT} - ${maxLimit} L)`}
              className="w-full px-6 py-4 text-2xl font-bold text-center border-4 border-primary-300 rounded-xl focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition"
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
              L
            </div>
          </div>

          {/* Range Slider */}
          <div className="px-2">
            <input
              type="range"
              value={quantity}
              onChange={(e) => onQuantityChange(parseFloat(e.target.value))}
              min={MIN_FUEL_LIMIT}
              max={maxLimit}
              step="0.5"
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>{MIN_FUEL_LIMIT}L</span>
              <span>{maxLimit}L</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Display */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Selected Quantity</p>
            <p className="text-4xl font-bold">{quantity} L</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Fuel Cost</p>
            <p className="text-4xl font-bold">₹{totalCost}</p>
          </div>
        </div>

        {/* Price per liter */}
        <div className="mt-4 pt-4 border-t border-white border-opacity-30">
          <p className="text-sm opacity-90">
            @ ₹{pricePerLiter} per liter
          </p>
        </div>
      </div>

      {/* Safety Warning */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="text-sm text-red-900">
            <p className="font-semibold mb-1">Safety Limit</p>
            <p className="text-red-800">
              Maximum {maxLimit} liters per delivery for safety compliance. Only PESO-approved containers used.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl mb-2">🛢️</div>
          <p className="text-xs text-gray-600 mb-1">PESO Approved</p>
          <p className="text-sm font-semibold text-gray-900">Safety Container</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-3xl mb-2">🚚</div>
          <p className="text-xs text-gray-600 mb-1">Fast Delivery</p>
          <p className="text-sm font-semibold text-gray-900">30-45 Minutes</p>
        </div>
      </div>
    </div>
  );
}