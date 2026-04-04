/**
 * Badge Component
 * Status badges with different colors and variants
 * Location: bunk/src/components/common/Badge.jsx
 */

export default function Badge({ 
  label, 
  icon, 
  color = 'gray', 
  size = 'md',
  variant = 'solid' 
}) {
  const colors = {
    orange: {
      solid: 'bg-orange-500 text-white',
      light: 'bg-orange-100 text-orange-800 border border-orange-300',
      outline: 'bg-transparent text-orange-700 border-2 border-orange-500'
    },
    green: {
      solid: 'bg-green-500 text-white',
      light: 'bg-green-100 text-green-800 border border-green-300',
      outline: 'bg-transparent text-green-700 border-2 border-green-500'
    },
    blue: {
      solid: 'bg-blue-500 text-white',
      light: 'bg-blue-100 text-blue-800 border border-blue-300',
      outline: 'bg-transparent text-blue-700 border-2 border-blue-500'
    },
    red: {
      solid: 'bg-red-500 text-white',
      light: 'bg-red-100 text-red-800 border border-red-300',
      outline: 'bg-transparent text-red-700 border-2 border-red-500'
    },
    yellow: {
      solid: 'bg-yellow-500 text-white',
      light: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      outline: 'bg-transparent text-yellow-700 border-2 border-yellow-500'
    },
    gray: {
      solid: 'bg-gray-500 text-white',
      light: 'bg-gray-100 text-gray-800 border border-gray-300',
      outline: 'bg-transparent text-gray-700 border-2 border-gray-500'
    },
    purple: {
      solid: 'bg-purple-500 text-white',
      light: 'bg-purple-100 text-purple-800 border border-purple-300',
      outline: 'bg-transparent text-purple-700 border-2 border-purple-500'
    }
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const colorClass = colors[color]?.[variant] || colors.gray[variant];
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-bold
        ${colorClass}
        ${sizeClass}
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
}

/**
 * Order Status Badge
 */
export function OrderStatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    pending: { label: 'New', icon: '🆕', color: 'yellow' },
    accepted: { label: 'Accepted', icon: '✅', color: 'blue' },
    ready_for_pickup: { label: 'Ready', icon: '📦', color: 'purple' },
    picked_up: { label: 'Picked Up', icon: '🏍️', color: 'purple' },
    in_transit: { label: 'In Transit', icon: '🚗', color: 'orange' },
    completed: { label: 'Completed', icon: '✅', color: 'green' },
    cancelled: { label: 'Cancelled', icon: '❌', color: 'red' },
    rejected: { label: 'Rejected', icon: '🚫', color: 'gray' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      label={config.label}
      icon={config.icon}
      color={config.color}
      size={size}
      variant="light"
    />
  );
}

/**
 * Payment Status Badge
 */
export function PaymentStatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    pending: { label: 'Pending', icon: '⏳', color: 'yellow' },
    completed: { label: 'Paid', icon: '✅', color: 'green' },
    failed: { label: 'Failed', icon: '❌', color: 'red' },
    refunded: { label: 'Refunded', icon: '↩️', color: 'blue' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge
      label={config.label}
      icon={config.icon}
      color={config.color}
      size={size}
      variant="light"
    />
  );
}

/**
 * Stock Level Badge
 */
export function StockLevelBadge({ level, size = 'md' }) {
  const levelConfig = {
    high: { label: 'High Stock', icon: '✅', color: 'green' },
    medium: { label: 'Medium', icon: '⚠️', color: 'yellow' },
    low: { label: 'Low Stock', icon: '❗', color: 'orange' },
    critical: { label: 'Critical', icon: '🚨', color: 'red' }
  };

  const config = levelConfig[level] || levelConfig.medium;

  return (
    <Badge
      label={config.label}
      icon={config.icon}
      color={config.color}
      size={size}
      variant="light"
    />
  );
}