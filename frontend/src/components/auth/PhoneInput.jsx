/**
 * Phone Input Component
 * Indian phone number input with validation
 */

import { useState } from 'react';

export default function PhoneInput({ value, onChange, error }) {
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 10 digits
    if (input.length <= 10) {
      onChange(input);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  // Validation
  const isValid = value.length === 10 && /^[6-9]/.test(value);
  const showError = touched && value.length > 0 && !isValid;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      
      <div className="relative">
        {/* Country Code */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <span className="text-gray-600 font-medium">+91</span>
        </div>
        
        {/* Input Field */}
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="9876543210"
          maxLength={10}
          className={`
            w-full pl-16 pr-4 py-3 text-lg
            border-2 rounded-lg
            focus:outline-none focus:ring-2
            transition-all
            ${showError || error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : isValid
              ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
            }
          `}
        />

        {/* Success Icon */}
        {isValid && !error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Must start with 6, 7, 8, or 9
        </p>
        <p className={`text-xs ${value.length === 10 ? 'text-green-600' : 'text-gray-500'}`}>
          {value.length}/10
        </p>
      </div>

      {/* Error Message */}
      {(showError || error) && (
        <div className="flex items-center space-x-2 text-red-600">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">
            {error || 'Please enter a valid 10-digit Indian mobile number'}
          </p>
        </div>
      )}
    </div>
  );
}