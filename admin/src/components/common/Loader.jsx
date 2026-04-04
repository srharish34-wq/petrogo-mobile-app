/**
 * Loader Component
 * Loading spinner with different sizes and variants
 * Location: admin/src/components/common/Loader.jsx & partner/src/components/common/Loader.jsx
 */

export default function Loader({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  message = 'Loading...',
  showMessage = true,
  className = ''
}) {
  // Size styles
  const sizeStyles = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  };

  // Spinner variant
  const renderSpinner = () => (
    <div className={`${sizeStyles[size]} border-orange-200 border-t-orange-600 rounded-full animate-spin`}></div>
  );

  // Dots variant
  const renderDots = () => (
    <div className="flex gap-2 items-center">
      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  // Pulse variant
  const renderPulse = () => (
    <div className={`${sizeStyles[size]} bg-orange-600 rounded-full animate-pulse`}></div>
  );

  // Bars variant
  const renderBars = () => (
    <div className="flex gap-1 items-end">
      <div className="w-1 h-6 bg-orange-600 animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-1 h-8 bg-orange-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-1 h-6 bg-orange-600 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {variant === 'spinner' && renderSpinner()}
      {variant === 'dots' && renderDots()}
      {variant === 'pulse' && renderPulse()}
      {variant === 'bars' && renderBars()}
      
      {showMessage && message && (
        <p className="text-gray-700 font-semibold text-center">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
        {loaderContent}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {loaderContent}
    </div>
  );
}

/**
 * Inline Loader Component
 * Small loader for inline use
 */
export function InlineLoader({ size = 'sm', message = '' }) {
  const sizeMap = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} border-orange-200 border-t-orange-600 rounded-full animate-spin`}></div>
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
}

/**
 * Skeleton Loader Component
 * Placeholder for loading content
 */
export function SkeletonLoader({
  type = 'box',
  count = 1,
  height = '20px',
  width = '100%',
  className = ''
}) {
  const skeletons = Array.from({ length: count });

  if (type === 'box') {
    return (
      <div className={`space-y-3 ${className}`}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded animate-pulse"
            style={{ height, width }}
          ></div>
        ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`flex gap-3 ${className}`}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-full animate-pulse"
            style={{ width: height, height }}
          ></div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded h-4 animate-pulse"
            style={{ width: i === count - 1 ? '70%' : '100%' }}
          ></div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`bg-white rounded-lg p-4 space-y-3 ${className}`}>
        {/* Header */}
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
        {/* Footer */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Table Skeleton Loader
 */
export function TableSkeletonLoader({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex bg-gray-100 border-b border-gray-200">
        {Array(cols).fill(0).map((_, i) => (
          <div key={`header-${i}`} className="flex-1 p-4">
            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array(rows).fill(0).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex border-b border-gray-200">
          {Array(cols).fill(0).map((_, colIdx) => (
            <div key={`cell-${rowIdx}-${colIdx}`} className="flex-1 p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}