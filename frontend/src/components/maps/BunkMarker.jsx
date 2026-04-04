/**
 * Bunk Marker Component - FIXED
 * Displays petrol bunk on map
 */

// ✅ FIXED: Helper to safely convert address to string
const safeAddressString = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.landmark) parts.push(address.landmark);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode) parts.push(address.pincode);
    if (address.country) parts.push(address.country);
    return parts.filter(Boolean).join(', ');
  }
  return String(address);
};

export default function BunkMarker({ bunk, onClick }) {
  if (!bunk) return null;

  // ✅ FIXED: Safely convert address to string
  const displayAddress = safeAddressString(bunk.address);

  return (
    <div
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      {/* Pulse Effect */}
      <div className="absolute -inset-4 bg-green-400 rounded-full animate-ping opacity-20"></div>
      
      {/* Marker */}
      <div className="relative bg-gradient-to-br from-green-500 to-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 border-white group-hover:scale-110 transition-transform">
        <span className="text-2xl">⛽</span>
      </div>

      {/* Info Card */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="w-3 h-3 bg-white transform rotate-45"></div>
        </div>

        {/* Content */}
        <div className="relative space-y-1">
          <p className="text-sm font-bold text-gray-900">{bunk.name || 'Petrol Bunk'}</p>
          {displayAddress && (
            <p className="text-xs text-gray-600 max-w-xs">{displayAddress}</p>
          )}
          
          {/* Fuel Prices */}
          {bunk.fuelAvailability && (
            <div className="flex gap-3 pt-2 border-t">
              {bunk.fuelAvailability.diesel?.available && (
                <div className="text-xs">
                  <span className="text-gray-600">Diesel:</span>
                  <span className="font-semibold text-green-600 ml-1">
                    ₹{bunk.fuelAvailability.diesel.price}
                  </span>
                </div>
              )}
              {bunk.fuelAvailability.petrol?.available && (
                <div className="text-xs">
                  <span className="text-gray-600">Petrol:</span>
                  <span className="font-semibold text-green-600 ml-1">
                    ₹{bunk.fuelAvailability.petrol.price}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          {bunk.rating?.average > 0 && (
            <div className="flex items-center gap-1 pt-1">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-xs font-semibold text-gray-700">
                {bunk.rating.average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({bunk.rating.count})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}