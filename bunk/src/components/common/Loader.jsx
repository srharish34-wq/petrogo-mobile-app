/**
 * Loader Component
 * Loading spinner with different sizes and variants
 * Location: bunk/src/components/common/Loader.jsx
 */

export default function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'orange',
  text = '',
  fullScreen = false
}) {
  
  // Size configurations
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color configurations
  const colors = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500'
  };

  const sizeClass = sizes[size] || sizes.md;
  const colorClass = colors[color] || colors.orange;

  // Spinner SVG
  const SpinnerLoader = () => (
    <svg
      className={`animate-spin ${sizeClass} ${colorClass}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Dots Loader
  const DotsLoader = () => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 ${colorClass} rounded-full bg-current animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-3 h-3 ${colorClass} rounded-full bg-current animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-3 h-3 ${colorClass} rounded-full bg-current animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <div className={`${sizeClass} ${colorClass} rounded-full bg-current animate-pulse`}></div>
  );

  // Select loader variant
  const LoaderComponent = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };

  // Wrapper content
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <LoaderComponent />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  // Inline loader
  return loaderContent;
}