/**
 * RevenueCard Component
 * Displays revenue and earnings information
 * Location: bunk/src/components/cards/RevenueCard.jsx
 */

export default function RevenueCard({ 
  title, 
  amount, 
  period, 
  breakdown,
  trend,
  icon = '💰'
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="text-4xl font-bold">
          ₹{amount?.toLocaleString('en-IN') || 0}
        </p>
        {period && (
          <p className="text-sm text-green-100 mt-1">{period}</p>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        
        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-2">
            {trend.direction === 'up' ? (
              <div className="flex items-center gap-1 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-bold">{trend.percentage}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span className="font-bold">{trend.percentage}%</span>
              </div>
            )}
            <span className="text-sm text-gray-600">{trend.label}</span>
          </div>
        )}

        {/* Breakdown */}
        {breakdown && breakdown.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900">Revenue Breakdown</p>
            {breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color || 'bg-orange-500'}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="font-bold text-gray-900">
                  ₹{item.amount?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * Revenue Summary Component
 * Shows multiple revenue cards in grid
 */
export function RevenueSummary({ revenueData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Today's Revenue */}
      <RevenueCard
        title="Today's Revenue"
        amount={revenueData.today}
        period="Last 24 hours"
        icon="💰"
        trend={{
          direction: 'up',
          percentage: 12,
          label: 'vs yesterday'
        }}
      />

      {/* This Month */}
      <RevenueCard
        title="This Month"
        amount={revenueData.thisMonth}
        period={new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        icon="📊"
        breakdown={[
          { label: 'Petrol Sales', amount: revenueData.petrolSales, color: 'bg-orange-500' },
          { label: 'Diesel Sales', amount: revenueData.dieselSales, color: 'bg-blue-500' },
          { label: 'Delivery Charges', amount: revenueData.deliveryCharges, color: 'bg-green-500' }
        ]}
      />

      {/* Total Revenue */}
      <RevenueCard
        title="Total Revenue"
        amount={revenueData.total}
        period="All time"
        icon="🎯"
        trend={{
          direction: 'up',
          percentage: 24,
          label: 'growth this year'
        }}
      />

    </div>
  );
}

/**
 * Earnings Card with Withdrawal Info
 */
export function EarningsCard({ earnings, onWithdraw }) {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Total Earnings</h3>
        <span className="text-4xl">💵</span>
      </div>

      {/* Total Amount */}
      <div className="mb-6">
        <p className="text-5xl font-bold mb-2">
          ₹{earnings.total?.toLocaleString('en-IN') || 0}
        </p>
        <p className="text-orange-100 text-sm">
          {earnings.completedOrders || 0} orders completed
        </p>
      </div>

      {/* Available to Withdraw */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-100 mb-1">Available to Withdraw</p>
            <p className="text-2xl font-bold">
              ₹{earnings.availableToWithdraw?.toLocaleString('en-IN') || 0}
            </p>
          </div>
          {earnings.availableToWithdraw > 0 && (
            <button
              onClick={onWithdraw}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>

      {/* Pending Settlement */}
      {earnings.pending > 0 && (
        <div className="text-sm text-orange-100">
          ⏳ ₹{earnings.pending?.toLocaleString('en-IN')} pending settlement
        </div>
      )}

    </div>
  );
}