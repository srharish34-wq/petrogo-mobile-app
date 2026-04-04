/**
 * RatingCard Component
 * Displays partner rating and performance metrics
 * Location: partner/src/components/cards/RatingCard.jsx
 */

export default function RatingCard({ partner = {} }) {
  const rating = partner.performance?.rating || {};
  const onTimeRate = partner.performance?.onTimeDeliveryRate || 0;
  const totalDeliveries = partner.performance?.totalDeliveries || 0;
  const completedDeliveries = partner.performance?.completedDeliveries || 0;

  const getRatingColor = (rate) => {
    if (rate >= 4.5) return 'text-green-600 bg-green-50';
    if (rate >= 4) return 'text-blue-600 bg-blue-50';
    if (rate >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getRatingMessage = (rate) => {
    if (rate >= 4.5) return 'Excellent! Keep it up!';
    if (rate >= 4) return 'Very Good Performance';
    if (rate >= 3.5) return 'Good Work!';
    return 'Keep Improving';
  };

  const averageRating = rating.average || 0;

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${getRatingColor(averageRating)}`}>
      {/* Main Rating */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">
          {averageRating > 0 ? averageRating.toFixed(1) : '—'}
        </div>
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${star <= Math.floor(averageRating) ? '⭐' : '☆'}`}
            >
              {star <= Math.floor(averageRating) ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <p className="font-bold text-lg">
          {getRatingMessage(averageRating)}
        </p>
        <p className="text-sm opacity-75 mt-1">
          Based on {rating.count || 0} reviews
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3 bg-white bg-opacity-40 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="text-sm font-semibold">On-Time Delivery Rate</span>
          </div>
          <div className="text-right">
            <p className="font-bold">{onTimeRate}%</p>
            <div className="w-24 h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${Math.min(onTimeRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-sm font-semibold">Completed Orders</span>
          </div>
          <p className="font-bold">{completedDeliveries}/{totalDeliveries}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📈</span>
            <span className="text-sm font-semibold">Success Rate</span>
          </div>
          <p className="font-bold">
            {totalDeliveries > 0 
              ? Math.round((completedDeliveries / totalDeliveries) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Tips Section */}
      {averageRating < 4.5 && (
        <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
          <p className="text-sm font-semibold mb-2">💡 Tips to Improve:</p>
          <ul className="text-xs space-y-1 opacity-90">
            {averageRating < 4 && <li>✓ Deliver on time to boost ratings</li>}
            {onTimeRate < 90 && <li>✓ Plan better routes to be on time</li>}
            <li>✓ Call customers before delivery</li>
            <li>✓ Keep your vehicle clean</li>
            <li>✓ Be polite and professional</li>
          </ul>
        </div>
      )}

      {averageRating >= 4.5 && (
        <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg text-center">
          <p className="text-sm font-bold">🏆 Excellent Rating!</p>
          <p className="text-xs opacity-90 mt-1">You're in the top performers. Keep it up!</p>
        </div>
      )}
    </div>
  );
}