/**
 * Order Summary Component - ULTRA SAFE VERSION
 * Shows order details before confirmation
 */

export default function OrderSummary({ orderData, onEdit }) {
  if (!orderData) return null;

  const {
    fuelType,
    quantity,
    pricePerLiter,
    deliveryLocation,
    petrolBunk,
    charges
  } = orderData;

  // Calculate breakdown
  const fuelCost = quantity * pricePerLiter;
  const deliveryCharge = charges?.deliveryCharge || 50;
  const emergencyFee = charges?.emergencyFee || 50;
  const subtotal = fuelCost + deliveryCharge + emergencyFee;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Ultra-safe function to convert any value to string
  const safeString = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      // Try to extract string properties
      if (value.formatted_address) return value.formatted_address;
      if (value.address) return safeString(value.address);
      if (value.name) return value.name;
      // Build from parts
      const parts = [];
      if (value.street) parts.push(value.street);
      if (value.landmark) parts.push(value.landmark);
      if (value.city) parts.push(value.city);
      if (value.state) parts.push(value.state);
      if (value.pincode) parts.push(value.pincode);
      if (value.country) parts.push(value.country);
      if (parts.length > 0) return parts.join(', ');
      // Last resort - try JSON
      try {
        return JSON.stringify(value);
      } catch {
        return 'Not available';
      }
    }
    return String(value);
  };

  const displayAddress = safeString(deliveryLocation?.address);
  const displayLandmark = safeString(deliveryLocation?.landmark);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
        <span className="text-4xl">📋</span>
      </div>

      {/* Fuel Details */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Fuel Type</p>
            <p className="text-3xl font-bold capitalize flex items-center gap-3">
              {String(fuelType)}
              <span className="text-4xl">
                {fuelType === 'diesel' ? '🛢️' : '⛽'}
              </span>
            </p>
          </div>
          <button
            onClick={() => onEdit('fuel')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-30">
          <div>
            <p className="text-sm opacity-90">Quantity</p>
            <p className="text-2xl font-bold">{String(quantity)} Liters</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Price/Liter</p>
            <p className="text-2xl font-bold">₹{String(pricePerLiter)}</p>
          </div>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📍</span>
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivery Location</p>
              <p className="font-semibold text-gray-900">
                {displayAddress || 'Address not provided'}
              </p>
              {displayLandmark && (
                <p className="text-sm text-gray-600 mt-1">
                  Near {displayLandmark}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onEdit('location')}
            className="text-primary-600 hover:text-primary-700 px-3 py-1 rounded-lg text-sm font-semibold"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Petrol Bunk */}
      {petrolBunk && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⛽</span>
            <div className="flex-1">
              <p className="text-sm text-green-700 mb-1">Petrol Bunk</p>
              <p className="font-semibold text-gray-900">{safeString(petrolBunk.name)}</p>
              {petrolBunk.address && (
                <p className="text-sm text-gray-600 mt-1">{safeString(petrolBunk.address)}</p>
              )}
              {petrolBunk.distance && (
                <p className="text-xs text-green-700 mt-2 font-medium">
                  📏 {String(petrolBunk.distance)} km away
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>

        {/* Fuel Cost */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Fuel Cost ({String(quantity)}L × ₹{String(pricePerLiter)})</span>
          <span className="font-semibold text-gray-900">₹{fuelCost.toFixed(2)}</span>
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Delivery Charge</span>
          <span className="font-semibold text-gray-900">₹{deliveryCharge.toFixed(2)}</span>
        </div>

        {/* Emergency Fee */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Emergency Fee</span>
          <span className="font-semibold text-gray-900">₹{emergencyFee.toFixed(2)}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-300">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* GST */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">GST (18%)</span>
          <span className="font-semibold text-gray-900">₹{gst.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-400">
          <span className="text-xl font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-primary-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">💳</span>
          <div>
            <p className="text-sm text-blue-700">Payment Method</p>
            <p className="font-semibold text-gray-900">Cash on Delivery</p>
          </div>
        </div>
        <p className="text-sm text-blue-800">
          Pay when fuel is delivered to your location
        </p>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="text-sm text-orange-900">
            <p className="font-semibold mb-2">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-800">
              <li>Emergency fuel assistance only</li>
              <li>PESO-approved safety containers will be used</li>
              <li>OTP verification required at delivery</li>
              <li>Estimated delivery time: 30-45 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}