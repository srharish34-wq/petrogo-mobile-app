/**
 * EmptyState Component
 * Display when there's no data to show
 * Location: bunk/src/components/common/EmptyState.jsx
 */

export default function EmptyState({
  icon = '📦',
  title = 'No Data',
  description = 'There is no data to display at the moment',
  action,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {/* Icon */}
      <div className="text-7xl mb-4 animate-bounce">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white font-bold rounded-lg transition"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white font-bold rounded-lg transition"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  );
}

/**
 * Pre-configured Empty States
 */

export function NoOrdersEmpty({ onAction }) {
  return (
    <EmptyState
      icon="📦"
      title="No Orders Yet"
      description="Orders from customers will appear here. Make sure your bunk is online and fuel is available."
      actionLabel="Refresh Orders"
      onAction={onAction}
    />
  );
}

export function NoEarningsEmpty() {
  return (
    <EmptyState
      icon="💰"
      title="No Earnings Data"
      description="Complete your first order to start tracking earnings and revenue."
    />
  );
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      description="Try adjusting your search or filters to find what you're looking for."
    />
  );
}

export function LowStockEmpty({ onAction }) {
  return (
    <EmptyState
      icon="⚠️"
      title="Low Fuel Stock"
      description="Your fuel stock is running low. Update stock levels to continue accepting orders."
      actionLabel="Update Stock"
      onAction={onAction}
    />
  );
}

export function MaintenanceEmpty() {
  return (
    <EmptyState
      icon="🚧"
      title="Under Maintenance"
      description="This feature is temporarily unavailable. We'll be back soon!"
    />
  );
}

export function OfflineEmpty({ onAction }) {
  return (
    <EmptyState
      icon="⚫"
      title="You're Offline"
      description="Go online to start receiving orders from customers in your area."
      actionLabel="Go Online"
      onAction={onAction}
    />
  );
}