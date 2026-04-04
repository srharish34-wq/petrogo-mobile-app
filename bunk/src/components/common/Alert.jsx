/**
 * Alert Component
 * Dismissible alert/notification with different types
 * Location: bunk/src/components/common/Alert.jsx
 */

import { useState } from 'react';

export default function Alert({
  type = 'info',
  title,
  message,
  onClose,
  dismissible = true,
  icon = true,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(true);

  // Type configurations
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: '✅',
      iconBg: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: '❌',
      iconBg: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: '⚠️',
      iconBg: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: 'ℹ️',
      iconBg: 'bg-blue-500'
    }
  };

  const config = types[type] || types.info;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${config.bg} 
        ${config.text} 
        border-l-4 
        ${config.border} 
        rounded-lg 
        shadow-md 
        p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0">
            <span className="text-2xl">{config.icon}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className="font-bold text-sm mb-1">
              {title}
            </h3>
          )}
          {message && (
            <p className="text-sm">
              {message}
            </p>
          )}
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${config.text} hover:opacity-70 transition`}
            aria-label="Close alert"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}