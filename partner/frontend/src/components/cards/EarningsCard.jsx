/**
 * EarningsCard Component
 * Displays partner earnings information
 * Location: partner/src/components/cards/EarningsCard.jsx
 */

export default function EarningsCard({ earnings = {}, completedDeliveries = 0, timeframe = 'today' }) {
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'total':
        return 'All Time';
      default:
        return 'Earnings';
    }
  };

  const getEarningsAmount = () => {
    switch (timeframe) {
      case 'today':
        // ✅ FIXED: Calculate today's earnings from total
        return earnings.today || 0;
      case 'week':
        // ✅ FIXED: Calculate week's earnings
        return earnings.week || 0;
      case 'month':
        return earnings.thisMonth || 0;
      case 'total':
        return earnings.total || 0;
      default:
        return 0;
    }
  };

  const amount = getEarningsAmount();

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{getTimeframeLabel()} Earnings</h3>
        <span className="text-3xl">💰</span>
      </div>

      {/* Main Amount */}
      <div className="mb-6">
        <p className="text-4xl font-bold">₹{amount.toFixed(0)}</p>
        <p className="text-green-100 text-sm mt-1">Your earnings so far</p>
      </div>

      {/* Stats */}
      <div className="space-y-3 bg-white bg-opacity-20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>🚗</span>
            <span className="text-sm">Deliveries Completed</span>
          </span>
          <span className="font-bold">{completedDeliveries || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>⏳</span>
            <span className="text-sm">Pending Withdrawal</span>
          </span>
          <span className="font-bold">₹{(earnings.pending || 0).toFixed(0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-sm">Total Withdrawn</span>
          </span>
          <span className="font-bold">₹{(earnings.withdrawn || 0).toFixed(0)}</span>
        </div>
      </div>

      {/* Withdraw Button */}
      {(earnings.pending || 0) > 0 && (
        <button className="w-full mt-4 bg-white text-green-600 font-bold py-2 px-4 rounded-lg hover:bg-green-50 transition">
          🏦 Withdraw Now
        </button>
      )}
    </div>
  );
}