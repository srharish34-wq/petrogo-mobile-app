/**
 * FuelStockCard Component
 * Displays fuel stock levels with alerts
 * Location: bunk/src/components/cards/FuelStockCard.jsx
 */

export default function FuelStockCard({ 
  fuelType, 
  stock, 
  capacity, 
  price, 
  lowStockThreshold = 1000,
  onUpdateStock,
  onUpdatePrice 
}) {
  const stockPercentage = (stock / capacity) * 100;
  const isLowStock = stock < lowStockThreshold;
  const isCritical = stock < (lowStockThreshold / 2);

  const getFuelIcon = (type) => {
    return type.toLowerCase() === 'petrol' ? '⛽' : '🛢️';
  };

  const getStockColor = () => {
    if (isCritical) return 'text-red-600';
    if (isLowStock) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isLowStock) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      
      {/* Header */}
      <div className={`p-6 ${
        fuelType.toLowerCase() === 'petrol' 
          ? 'bg-gradient-to-r from-orange-500 to-red-600' 
          : 'bg-gradient-to-r from-blue-500 to-blue-600'
      }`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getFuelIcon(fuelType)}</span>
            <div>
              <h3 className="text-2xl font-bold">{fuelType.toUpperCase()}</h3>
              <p className="text-sm opacity-90">Current Stock</p>
            </div>
          </div>
          {isLowStock && (
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-bold">⚠️ Low Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        
        {/* Stock Amount */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600">Available Stock</p>
              <p className={`text-4xl font-bold ${getStockColor()}`}>
                {stock.toLocaleString('en-IN')}L
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="text-xl font-bold text-gray-900">
                {capacity.toLocaleString('en-IN')}L
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {stockPercentage.toFixed(1)}% filled
          </p>
        </div>

        {/* Price Info */}
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-3xl font-bold text-orange-600">
                ₹{price}
                <span className="text-base text-gray-600">/L</span>
              </p>
            </div>
            <button
              onClick={onUpdatePrice}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Update Price
            </button>
          </div>
        </div>

        {/* Stock Alert */}
        {isLowStock && (
          <div className={`rounded-lg p-4 border-l-4 ${
            isCritical 
              ? 'bg-red-50 border-red-500' 
              : 'bg-yellow-50 border-yellow-500'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {isCritical ? '🚨' : '⚠️'}
              </span>
              <div>
                <p className={`font-bold text-sm ${
                  isCritical ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {isCritical ? 'Critical Stock Level!' : 'Low Stock Alert'}
                </p>
                <p className={`text-xs mt-1 ${
                  isCritical ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  Only {stock}L remaining. Please restock soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onUpdateStock}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition"
        >
          📦 Update Stock
        </button>

      </div>
    </div>
  );
}

/**
 * Fuel Stock Overview Component
 * Shows all fuel types in grid
 */
export function FuelStockOverview({ stockData, onUpdateStock, onUpdatePrice }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {stockData.map((fuel) => (
        <FuelStockCard
          key={fuel.type}
          fuelType={fuel.type}
          stock={fuel.currentStock}
          capacity={fuel.capacity}
          price={fuel.pricePerLiter}
          lowStockThreshold={fuel.lowStockThreshold || 1000}
          onUpdateStock={() => onUpdateStock(fuel.type)}
          onUpdatePrice={() => onUpdatePrice(fuel.type)}
        />
      ))}
    </div>
  );
}