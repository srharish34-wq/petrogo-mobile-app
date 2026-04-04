/**
 * StatsCard Component
 * Displays partner statistics in a flexible card format
 * Location: partner/src/components/cards/StatsCard.jsx
 */

export default function StatsCard({ 
  icon = '📊', 
  label = 'Stat', 
  value = '0', 
  unit = '', 
  color = 'blue',
  trend = null,
  trendDirection = 'up'
}) {
  // Color variants
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  const getTrendColor = () => {
    if (!trend) return '';
    return trendDirection === 'up' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  const getTrendIcon = () => {
    if (!trend) return '';
    return trendDirection === 'up' ? '📈' : '📉';
  };

  return (
    <div className={`rounded-xl border-2 p-4 ${selectedColor} hover:shadow-md transition`}>
      {/* Header with Icon and Trend */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <div className={`text-sm font-bold flex items-center gap-1 ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{trend}{trendDirection === 'up' ? '↑' : '↓'}</span>
          </div>
        )}
      </div>

      {/* Label */}
      <p className="text-xs font-semibold opacity-75 mb-1">{label}</p>

      {/* Value */}
      <p className="text-2xl font-bold">
        {value}
        <span className="text-sm opacity-75 ml-1">{unit}</span>
      </p>
    </div>
  );
}

/**
 * StatsGrid Component
 * Display multiple stats in a grid
 */
export function StatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}

/**
 * QuickStats Component
 * Pre-configured stats for dashboard
 * ✅ FIXED: Uses actual backend data structure
 */
export function QuickStats({ 
  partner = {}, 
  todayStats = {},
  earnings = {} 
}) {
  const stats = [
    {
      icon: '🚗',
      label: 'Total Deliveries',
      value: partner.performance?.totalDeliveries || '0',
      color: 'orange',
      trend: null
    },
    {
      icon: '✅',
      label: 'Completed',
      value: partner.performance?.completedDeliveries || '0',
      color: 'green',
      trend: null
    },
    {
      icon: '💰',
      label: 'Total Earnings',
      value: `₹${earnings.total || 0}`,
      color: 'green',
      trend: null
    },
    {
      icon: '⭐',
      label: 'Rating',
      value: (partner.performance?.rating?.average || 0).toFixed(1),
      unit: '/ 5',
      color: 'purple',
      trend: null
    },
    {
      icon: '⏱️',
      label: 'On-Time Rate',
      value: partner.performance?.onTimeDeliveryRate || '0',
      unit: '%',
      color: 'green',
      trend: null
    },
    {
      icon: '💳',
      label: 'Pending Amount',
      value: `₹${earnings.pending || 0}`,
      color: 'yellow',
      trend: null
    }
  ];

  return <StatsGrid stats={stats} />;
}