/**
 * OrderDetailsModal Component
 * Display complete order details with map and tracking info
 * Location: partner/src/components/modals/OrderDetailsModal.jsx
 */

import { useState } from 'react';

export default function OrderDetailsModal({ isOpen, order, onClose, onAccept, onReject }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !order) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600">#{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {order.status?.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Your Earning</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Fuel Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">⛽ Fuel Details</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fuel Type:</span>
                <span className="font-bold text-gray-900 capitalize">{order.fuelDetails?.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold text-gray-900">{order.fuelDetails?.quantity} Liters</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price per Liter:</span>
                <span className="font-bold text-gray-900">₹{order.fuelDetails?.pricePerLiter}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                <span className="text-gray-900">Total Fuel Cost:</span>
                <span className="text-orange-600">₹{order.fuelDetails?.quantity * order.fuelDetails?.pricePerLiter}</span>
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">📍 Delivery Location</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-gray-700">{formatAddress(order.deliveryLocation?.address)}</p>
              {order.deliveryLocation?.landmark && (
                <div className="bg-blue-50 border-l-2 border-blue-500 pl-3 py-2">
                  <p className="text-sm text-blue-700">
                    <strong>Landmark:</strong> {order.deliveryLocation.landmark}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm pt-2">
                <span className="text-orange-600 font-bold">
                  📏 {(order.distance?.toCustomer || 0).toFixed(2)} km away
                </span>
                <span className="text-gray-600">
                  (~{Math.round((order.distance?.toCustomer || 0) * 1.5)} min)
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">👤 Customer Information</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-bold text-gray-900">{order.customer?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{order.customer?.phone || 'N/A'}</span>
                  {order.customer?.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full transition"
                      title="Call customer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.917 1.888 3.386 3.804 3.804l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">💵 Charges Breakdown</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Fuel Cost:</span>
                <span className="font-semibold">₹{order.charges?.fuelCost || 0}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charge:</span>
                <span className="font-semibold">₹{order.charges?.deliveryCharge || 0}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Emergency Fee:</span>
                <span className="font-semibold">₹{order.charges?.emergencyFee || 0}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-gray-900 font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-orange-600">₹{order.charges?.totalAmount || 0}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-green-700 font-bold text-lg bg-green-50 -mx-4 -mb-4 px-4 py-2 rounded-b-lg">
                <span>Your Earning:</span>
                <span>₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">📅 Order Timeline</h3>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {order.confirmedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
                    <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.confirmedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}

              {order.pickedUpAt ? (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
                    <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Picked Up</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.pickedUpAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">○</div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pending Pickup</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? '⏳ Processing...' : '❌ Reject Order'}
              </button>
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? '⏳ Processing...' : '✅ Accept Order'}
              </button>
            </div>
          )}

          {(order.status !== 'pending' && order.status !== 'confirmed') && (
            <button
              onClick={onClose}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}