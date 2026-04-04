/**
 * Fuel Selector Component
 * Select fuel type (Diesel/Petrol)
 */

import { useState } from 'react';
import { FUEL_TYPES } from '../../utils/constants';

export default function FuelSelector({ selectedFuel, onSelect, prices }) {
  const fuelOptions = [
    {
      type: FUEL_TYPES.DIESEL,
      name: 'Diesel',
      icon: '🛢️',
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-orange-500',
      description: 'Recommended for safety',
      price: prices?.diesel || 95
    },
    {
      type: FUEL_TYPES.PETROL,
      name: 'Petrol',
      icon: '⛽',
      color: 'from-red-500 to-pink-500',
      borderColor: 'border-red-500',
      description: 'High performance',
      price: prices?.petrol || 105
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-bold text-gray-900">
          Select Fuel Type
        </label>
        <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          Diesel Recommended ✨
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fuelOptions.map((fuel) => {
          const isSelected = selectedFuel === fuel.type;

          return (
            <button
              key={fuel.type}
              onClick={() => onSelect(fuel.type)}
              className={`
                relative p-6 rounded-2xl border-4 transition-all duration-300
                ${isSelected
                  ? `${fuel.borderColor} bg-gradient-to-br ${fuel.color} text-white shadow-2xl scale-105`
                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-lg'
                }
              `}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 bg-white text-green-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-green-600 animate-bounce">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="text-6xl mb-4">{fuel.icon}</div>

              {/* Name */}
              <h3 className={`text-2xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {fuel.name}
              </h3>

              {/* Description */}
              <p className={`text-sm mb-3 ${isSelected ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {fuel.description}
              </p>

              {/* Price */}
              <div className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-primary-600'}`}>
                ₹{fuel.price}
                <span className="text-lg font-normal">/L</span>
              </div>

              {/* Ripple effect on selected */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-white opacity-20 animate-ping"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Why Diesel First?</p>
            <p className="text-blue-800">
              Diesel is safer to transport in emergency situations due to its lower volatility compared to petrol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}