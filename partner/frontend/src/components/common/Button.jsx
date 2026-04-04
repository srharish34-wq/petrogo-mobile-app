/**
 * Button Component
 * Reusable button with different variants and states
 * Location: partner/src/components/common/Button.jsx
 */

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  className = ''
}) {
  
  // Variant styles
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
    ghost: 'text-orange-500 hover:bg-orange-50'
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled || loading ? disabledStyles : ''}
        ${widthClass}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && icon && <span>{icon}</span>}
      
      <span>{loading ? 'Loading...' : children}</span>
    </button>
  );
}

/**
 * Example Usage:
 * 
 * <Button onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * <Button variant="success" size="lg" loading={isLoading}>
 *   Submit
 * </Button>
 * 
 * <Button variant="danger" icon="🗑️" disabled>
 *   Delete
 * </Button>
 * 
 * <Button variant="outline" fullWidth>
 *   Full Width Button
 * </Button>
 */