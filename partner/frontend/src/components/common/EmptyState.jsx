/**
 * EmptyState Component
 * Display empty states with icon, message, and action
 * Location: partner/src/components/common/EmptyState.jsx
 */

export default function EmptyState({
  icon = '📭',
  title = 'No data available',
  message = '',
  action = null,
  size = 'md',
  className = ''
}) {
  
  // Size configurations
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'text-6xl',
      title: 'text-lg',
      message: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'text-8xl',
      title: 'text-xl',
      message: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'text-9xl',
      title: 'text-2xl',
      message: 'text-lg'
    }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeConfig.container} ${className}`}>
      {/* Icon */}
      <div className={`mb-4 ${sizeConfig.icon}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className={`font-bold text-gray-900 mb-2 ${sizeConfig.title}`}>
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className={`text-gray-600 max-w-md mb-6 ${sizeConfig.message}`}>
          {message}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Preset Empty States for common scenarios
 */

export function NoOrdersEmpty({ onRefresh }) {
  return (
    <EmptyState
      icon="📦"
      title="No Orders Available"
      message="There are no orders in your area right now. Check back soon or refresh to see new orders."
      action={
        onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            🔄 Refresh
          </button>
        )
      }
    />
  );
}

export function NoDeliveriesEmpty() {
  return (
    <EmptyState
      icon="🚗"
      title="No Deliveries Yet"
      message="You haven't completed any deliveries yet. Start accepting orders to build your delivery history."
      size="md"
    />
  );
}

export function NoEarningsEmpty() {
  return (
    <EmptyState
      icon="💰"
      title="No Earnings Yet"
      message="Complete your first delivery to start earning. Your earnings will appear here."
      size="md"
    />
  );
}

export function NetworkErrorEmpty({ onRetry }) {
  return (
    <EmptyState
      icon="📡"
      title="Connection Error"
      message="Unable to load data. Please check your internet connection and try again."
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            🔄 Retry
          </button>
        )
      }
    />
  );
}

export function SearchNoResultsEmpty({ searchQuery }) {
  return (
    <EmptyState
      icon="🔍"
      title="No Results Found"
      message={'We could not find any results for "' + (searchQuery || 'your search') + '". Try different keywords.'}
      size="sm"
    />
  );
}

export function OfflineEmpty({ onGoOnline }) {
  return (
    <EmptyState
      icon="⚫"
      title="You're Offline"
      message="Go online to start receiving orders and earning money."
      action={
        onGoOnline && (
          <button
            onClick={onGoOnline}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            🟢 Go Online
          </button>
        )
      }
    />
  );
}

export function KYCPendingEmpty() {
  return (
    <EmptyState
      icon="📋"
      title="KYC Verification Pending"
      message="Your KYC documents are under review. You'll be able to accept orders once your profile is approved."
      size="md"
    />
  );
}

/**
 * Example Usage:
 * 
 * <EmptyState
 *   icon="📭"
 *   title="No notifications"
 *   message="You're all caught up! No new notifications."
 * />
 * 
 * <NoOrdersEmpty onRefresh={handleRefresh} />
 * 
 * <NoDeliveriesEmpty />
 * 
 * <NetworkErrorEmpty onRetry={handleRetry} />
 * 
 * <OfflineEmpty onGoOnline={handleGoOnline} />
 * 
 * <EmptyState
 *   icon="🎉"
 *   title="Custom Empty State"
 *   message="Create your own custom empty states"
 *   size="lg"
 *   action={<Button>Take Action</Button>}
 * />
 */