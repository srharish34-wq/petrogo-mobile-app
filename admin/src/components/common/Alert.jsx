/**
 * Alert Component
 * Notification/alert component with different types and actions
 * Location: admin/src/components/common/Alert.jsx & partner/src/components/common/Alert.jsx
 */

import { useState, useEffect } from 'react';

export default function Alert({
  type = 'info',
  title = '',
  message = '',
  description = '',
  icon = null,
  onClose = () => {},
  dismissible = true,
  autoClose = false,
  autoCloseDuration = 5000,
  actions = [],
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto close alert
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  // Alert type configs
  const typeConfig = {
    info: {
      icon: '💙',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      accentColor: 'bg-blue-100'
    },
    success: {
      icon: '✅',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      accentColor: 'bg-green-100'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      accentColor: 'bg-yellow-100'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      accentColor: 'bg-red-100'
    },
    danger: {
      icon: '🚨',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800',
      accentColor: 'bg-red-100'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border-2 rounded-lg p-4
        flex gap-4 items-start
        ${className}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-2xl">
        {icon || config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`font-bold text-lg ${config.textColor}`}>
            {title}
          </h3>
        )}
        
        {message && (
          <p className={`text-sm font-semibold ${config.textColor} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        )}

        {description && (
          <p className={`text-sm ${config.textColor} opacity-90 ${title || message ? 'mt-2' : ''}`}>
            {description}
          </p>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`
                  text-sm font-semibold px-3 py-1 rounded
                  transition hover:opacity-80
                  ${action.variant === 'primary'
                    ? `${config.accentColor} ${config.textColor}`
                    : `${config.textColor} underline`
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      {dismissible && (
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition text-xl`}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Alert Container Component
 * Display multiple alerts stacked
 */
export function AlertContainer({ alerts = [], onAlertClose = () => {} }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          {...alert}
          onClose={() => onAlertClose(alert.id)}
          autoClose={alert.autoClose !== false}
          autoCloseDuration={alert.autoCloseDuration || 5000}
        />
      ))}
    </div>
  );
}

/**
 * Toast Notification Hook
 * Use in components to trigger notifications
 */
export function useAlert() {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    const id = Date.now();
    const newAlert = { ...alert, id };
    setAlerts(prev => [...prev, newAlert]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const success = (message, options = {}) => {
    return addAlert({
      type: 'success',
      title: options.title || 'Success',
      message,
      ...options
    });
  };

  const error = (message, options = {}) => {
    return addAlert({
      type: 'error',
      title: options.title || 'Error',
      message,
      ...options
    });
  };

  const warning = (message, options = {}) => {
    return addAlert({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      ...options
    });
  };

  const info = (message, options = {}) => {
    return addAlert({
      type: 'info',
      title: options.title || 'Info',
      message,
      ...options
    });
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info
  };
}

/**
 * Inline Alert Component
 * For use within pages/forms
 */
export function InlineAlert({
  type = 'info',
  title = '',
  message = '',
  icon = null,
  fullWidth = true,
  className = ''
}) {
  const typeConfig = {
    info: { icon: 'ℹ️', color: 'blue' },
    success: { icon: '✅', color: 'green' },
    warning: { icon: '⚠️', color: 'yellow' },
    error: { icon: '❌', color: 'red' }
  };

  const config = typeConfig[type] || typeConfig.info;
  const colorMap = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    green: 'border-green-200 bg-green-50 text-green-800',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    red: 'border-red-200 bg-red-50 text-red-800'
  };

  return (
    <div className={`
      border-l-4 ${colorMap[config.color]}
      p-4 rounded
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}>
      <div className="flex gap-3">
        <span className="flex-shrink-0 text-lg">{icon || config.icon}</span>
        <div>
          {title && <p className="font-bold">{title}</p>}
          {message && <p className="text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
}

/**
 * Status Alert Component
 * For displaying status messages
 */
export function StatusAlert({ status = 'info', message = '' }) {
  const statusConfig = {
    loading: { icon: '⏳', color: 'blue', text: 'Loading...' },
    success: { icon: '✅', color: 'green', text: 'Success!' },
    error: { icon: '❌', color: 'red', text: 'Error!' },
    warning: { icon: '⚠️', color: 'yellow', text: 'Warning!' }
  };

  const config = statusConfig[status];
  if (!config) return null;

  const colorMap = {
    blue: 'text-blue-600 border-blue-300',
    green: 'text-green-600 border-green-300',
    red: 'text-red-600 border-red-300',
    yellow: 'text-yellow-600 border-yellow-300'
  };

  return (
    <div className={`flex items-center gap-2 p-3 border-2 rounded-lg ${colorMap[config.color]}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-semibold">{message || config.text}</span>
    </div>
  );
}