/**
 * Button Component
 * Reusable button with multiple variants, sizes, and states
 * Location: admin/src/components/common/Button.jsx & partner/src/components/common/Button.jsx
 */

import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick = () => {},
  type = 'button',
  title = '',
  ...props
}, ref) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-600',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-2 border-gray-300',
    success: 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-600',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-900 border-2 border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 border-0'
  };

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs font-semibold rounded',
    sm: 'px-3 py-2 text-sm font-semibold rounded-lg',
    md: 'px-4 py-2.5 text-base font-bold rounded-lg',
    lg: 'px-6 py-3 text-lg font-bold rounded-xl',
    xl: 'px-8 py-4 text-xl font-bold rounded-xl'
  };

  // Disabled styles
  const disabledStyle = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transition';

  // Full width
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combined className
  const buttonClasses = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyle}
    ${widthStyle}
    ${className}
    inline-flex items-center justify-center gap-2 font-semibold
  `;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      title={title}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className="text-lg">{icon}</span>
      )}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' && (
        <span className="text-lg">{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

/**
 * Button Group Component
 * Display multiple buttons together
 */
export function ButtonGroup({ children, vertical = false, className = '' }) {
  return (
    <div className={`flex gap-2 ${vertical ? 'flex-col' : 'flex-row'} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Icon Button Component
 * Button with just an icon
 */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip = '',
  onClick = () => {},
  disabled = false,
  ...props
}) {
  const sizeToIconSize = {
    xs: 'text-lg w-6 h-6',
    sm: 'text-xl w-8 h-8',
    md: 'text-2xl w-10 h-10',
    lg: 'text-3xl w-12 h-12',
    xl: 'text-4xl w-14 h-14'
  };

  const variantStyles = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 text-gray-900'
  };

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeToIconSize[size]}
        rounded-full flex items-center justify-center transition
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      title={tooltip}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}