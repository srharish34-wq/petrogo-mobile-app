/**
 * OTP Input Component
 * 6-digit OTP input with auto-focus
 */

import { useRef, useEffect } from 'react';

export default function OTPInput({ value, onChange, error }) {
  const inputRefs = useRef([]);
  const otpLength = 6;

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otpLength);
  }, []);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change
  const handleChange = (index, digit) => {
    // Only allow digits
    if (!/^\d*$/.test(digit)) return;

    const newOTP = value.split('');
    newOTP[index] = digit;
    const otpString = newOTP.join('');

    onChange(otpString);

    // Auto-focus next input
    if (digit && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOTP = value.split('');
        newOTP[index] = '';
        onChange(newOTP.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, otpLength);
    
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length - 1, otpLength - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Enter OTP
      </label>
      
      <div className="flex justify-center gap-2 sm:gap-3">
        {[...Array(otpLength)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`
              w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold
              border-2 rounded-lg
              focus:outline-none focus:ring-2
              transition-all
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
              }
              ${value[index] ? 'bg-primary-50' : 'bg-white'}
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        Enter the 6-digit code sent to your phone
      </p>
    </div>
  );
}