/**
 * OrderCard Component
 * Displays individual order details
 * Location: partner/src/components/cards/OrderCard.jsx
 */

import { useState } from 'react';

export default function OrderCard({ order, onAccept, onReject, onViewDetails }) {
  const [isLoading, setIsLoading] = useState(false);

  // Calculate distance color
  const getDistanceColor = (distance) => {
    if (distance < 1) return 'text-green-600';
    if (distance < 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format address
  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    if (typeof address === 'object' && address) {
      return [address.street, address.city, address.state]
        .filter(Boolean)
        .join(', ') || 'Address not available';
    }
    return 'Address not available';
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(order._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject(order._id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 border-l-4 border-orange-500">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Placed at {new Date(order.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Earning</p>
          <p className="text-lg font-bold text-green-600">
            ₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}
          </p>
        </div>
      </div>

      {/* Fuel Details */}
      <div className="bg-orange-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⛽</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {order.fuelDetails?.type}
              </p>
              <p className="text-xs text-gray-600">
                {order.fuelDetails?.quantity}L @ ₹{order.fuelDetails?.pricePerLiter}/L
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Total</p>
            <p className="font-bold text-gray-900">₹{order.charges?.totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Location & Distance */}
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <span className="text-lg mt-1">📍</span>
          <div className="flex-1">
            <p className="text-xs text-gray-600">Delivery Location</p>
            <p className="text-sm text-gray-900">
              {formatAddress(order.deliveryLocation?.address)}
            </p>
            {order.deliveryLocation?.landmark && (
              <p className="text-xs text-blue-600 mt-1">
                📌 Landmark: {order.deliveryLocation.landmark}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <span className="text-lg">📏</span>
          <span className={`font-bold ${getDistanceColor(order.distance?.toCustomer || 0)}`}>
            {(order.distance?.toCustomer || 0).toFixed(2)} km away
          </span>
          <span className="text-xs text-gray-600 ml-auto">
            ~{Math.round((order.distance?.toCustomer || 0) * 1.5)} min
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Customer</p>
            <p className="font-semibold text-gray-900">
              {order.customer?.name || 'Customer'}
            </p>
          </div>
          {order.customer?.phone && (
            <a
              href={`tel:${order.customer.phone}`}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
              title="Call customer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.917 1.888 3.386 3.804 3.804l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Charges Breakdown */}
      <div className="text-xs space-y-1 bg-gray-50 rounded-lg p-2 mb-3">
        <div className="flex justify-between text-gray-700">
          <span>Delivery Charge:</span>
          <span className="font-semibold">₹{order.charges?.deliveryCharge || 0}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Emergency Fee:</span>
          <span className="font-semibold">₹{order.charges?.emergencyFee || 0}</span>
        </div>
        <div className="border-t pt-1 flex justify-between text-gray-900 font-bold">
          <span>Your Earning:</span>
          <span>₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {(order.status === 'pending' || order.status === 'confirmed') && (
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? '...' : '❌ Reject'}
          </button>
          <button
            onClick={() => onViewDetails(order._id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition"
          >
            👁️ Details
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? '...' : '✅ Accept'}
          </button>
        </div>
      )}

      {order.status !== 'pending' && order.status !== 'confirmed' && (
        <button
          onClick={() => onViewDetails(order._id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition"
        >
          📍 Track Order
        </button>
      )}
    </div>
  );
}