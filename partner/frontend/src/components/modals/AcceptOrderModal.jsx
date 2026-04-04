/**
 * AcceptOrderModal Component
 * Modal to confirm accepting an order with details
 * Location: partner/src/components/modals/AcceptOrderModal.jsx
 */

import { useState } from 'react';

export default function AcceptOrderModal({ isOpen, order, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(order._id);
      setTermsAccepted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTermsAccepted(false);
    onClose();
  };

  // Calculate earnings
  const earnings = Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0));
  const distance = (order.distance?.toCustomer || 0).toFixed(2);
  const estimatedTime = Math.round((order.distance?.toCustomer || 0) * 1.5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Accept Order?</h2>
              <p className="text-green-100 text-sm">#{order.orderNumber}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel Type:</span>
                <span className="font-bold text-gray-900 capitalize">{order.fuelDetails?.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold text-gray-900">{order.fuelDetails?.quantity}L</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-orange-600">₹{order.charges?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900">Trip Details</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">📏 Distance:</span>
                <span className="font-bold text-gray-900">{distance} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">⏱️ Est. Time:</span>
                <span className="font-bold text-gray-900">~{estimatedTime} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">📍 Location:</span>
                <span className="font-bold text-gray-900 text-right flex-1 ml-2 text-xs">
                  {order.deliveryLocation?.address?.split(',')[0] || 'Location'}
                </span>
              </div>
            </div>
          </div>

          {/* Your Earning */}
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <p className="text-xs text-green-700 mb-1">Your Earning</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">₹{earnings}</span>
              <span className="text-sm text-green-700">for this delivery</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-800 mb-3">
              <strong>Important:</strong> By accepting this order, you agree to:
            </p>
            <ul className="text-xs text-yellow-700 space-y-1 ml-4">
              <li>✓ Pickup fuel from the assigned petrol bunk</li>
              <li>✓ Deliver within estimated time</li>
              <li>✓ Follow all safety guidelines</li>
              <li>✓ Contact customer before delivery</li>
              <li>✓ Maintain professional behavior</li>
            </ul>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">
              I understand and accept all terms
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !termsAccepted}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Confirming...' : '✅ Accept Order'}
            </button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-600 text-center">
            You can track this order in real-time after accepting
          </p>
        </div>
      </div>
    </div>
  );
}