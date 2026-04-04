/**
 * StatsCard Component
 * Displays dashboard statistics cards
 * Location: bunk/src/components/cards/StatsCard.jsx
 */

export default function StatsCard({ title, value, icon, color = 'orange', change, subtitle }) {
  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const bgClass = colorClasses[color] || colorClasses.orange;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Icon */}
        <div className={`${bgClass} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>

      {/* Change indicator */}
      {change && (
        <div className="flex items-center gap-2">
          {change.type === 'increase' ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          <span className={`text-sm font-semibold ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change.value}
          </span>
          <span className="text-xs text-gray-500">{change.label}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Quick Stats Component (Multiple cards in grid)
 */
export function QuickStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders || 0}
        icon="📦"
        color="orange"
        change={{ type: 'increase', value: '+12%', label: 'vs last month' }}
      />
      
      <StatsCard
        title="Pending Orders"
        value={stats.pendingOrders || 0}
        icon="⏳"
        color="yellow"
        subtitle="Awaiting action"
      />
      
      <StatsCard
        title="Completed Today"
        value={stats.completedToday || 0}
        icon="✅"
        color="green"
        subtitle="Successfully delivered"
      />
      
      <StatsCard
        title="Today's Revenue"
        value={`₹${stats.todayRevenue || 0}`}
        icon="💰"
        color="blue"
        change={{ type: 'increase', value: '+8%', label: 'vs yesterday' }}
      />
    </div>
  );
}