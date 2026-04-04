/**
 * RejectOrderModal Component
 * Modal to reject an order with reason selection
 * Location: partner/src/components/modals/RejectOrderModal.jsx
 */

import { useState } from 'react';

export default function RejectOrderModal({ isOpen, order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasons = [
    { id: 'far', label: '📍 Too Far', emoji: '📍' },
    { id: 'busy', label: '🚗 Too Busy', emoji: '🚗' },
    { id: 'vehicle', label: '⚙️ Vehicle Issue', emoji: '⚙️' },
    { id: 'time', label: '⏱️ No Time', emoji: '⏱️' },
    { id: 'other', label: '📝 Other Reason', emoji: '📝' }
  ];

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    const reason = selectedReason === 'other' ? customReason : selectedReason;

    if (!reason || reason.trim() === '') {
      alert('Please select or enter a reason');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ FIXED: Pass reason and cancelledBy to match backend
      await onConfirm(order._id, {
        reason: reason,
        cancelledBy: 'partner'
      });
      // Reset form
      setSelectedReason('');
      setCustomReason('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reject Order?</h2>
              <p className="text-red-100 text-sm">#{order.orderNumber}</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-2">Order Details</h3>
            <p className="text-sm text-gray-700">
              <strong>Fuel:</strong> {order.fuelDetails?.quantity}L {order.fuelDetails?.type.toUpperCase()}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Distance:</strong> {(order.distance?.toCustomer || 0).toFixed(2)} km
            </p>
            <p className="text-sm text-gray-700">
              <strong>Earning:</strong> ₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}
            </p>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-sm text-orange-800">
              <strong>⚠️ Note:</strong> Rejecting orders may affect your rating. Please reject only if necessary.
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Why are you rejecting?</h3>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedReason === reason.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-lg">{reason.emoji}</span>
                  <span className={selectedReason === reason.id ? 'font-bold text-gray-900' : 'text-gray-700'}>
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {selectedReason === 'other' && (
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Please explain:
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Tell us why you're rejecting this order..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">
                {customReason.length}/200 characters
              </p>
            </div>
          )}

          {/* Impact Info */}
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-red-700">
              Rejecting may reduce your acceptance rate and rating
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
            >
              Keep It
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !selectedReason}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Rejecting...' : '❌ Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}