/**
 * RejectOrderModal Component
 * Modal to reject order with reason
 * Location: bunk/src/components/modals/RejectOrderModal.jsx
 */

import { useState } from 'react';

export default function RejectOrderModal({ isOpen, order, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !order) return null;

  const rejectionReasons = [
    { id: 'out_of_stock', label: '⛽ Fuel Out of Stock', icon: '⛽' },
    { id: 'technical_issue', label: '🔧 Technical Issue', icon: '🔧' },
    { id: 'maintenance', label: '🚧 Under Maintenance', icon: '🚧' },
    { id: 'delivery_unavailable', label: '🚫 Delivery Not Available', icon: '🚫' },
    { id: 'other', label: '📝 Other Reason', icon: '📝' }
  ];

  const handleConfirm = async () => {
    setError('');

    // Validation
    if (!selectedReason) {
      setError('Please select a reason for rejection');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      setError('Please provide a reason');
      return;
    }

    setIsLoading(true);
    try {
      const reason = selectedReason === 'other' ? customReason : rejectionReasons.find(r => r.id === selectedReason)?.label;
      await onConfirm(order._id, reason);
      handleClose();
    } catch (error) {
      setError(error.message || 'Failed to reject order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Reject Order</h2>
              <p className="text-red-100 text-sm">#{order.orderNumber}</p>
            </div>
            <button 
              onClick={handleClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm font-bold text-red-900 mb-1">⚠️ Are you sure?</p>
            <p className="text-xs text-red-700">
              This order will be rejected and the customer will be notified. This action cannot be undone.
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-bold text-gray-900">{order.customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel:</span>
                <span className="font-bold text-gray-900">
                  {order.fuelDetails?.quantity}L {order.fuelDetails?.type?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-orange-600">₹{order.charges?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Rejection Reasons */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Select Rejection Reason *
            </label>
            <div className="space-y-2">
              {rejectionReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                    selectedReason === reason.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{reason.icon}</span>
                  <span className={`text-sm font-semibold ${
                    selectedReason === reason.id ? 'text-red-700' : 'text-gray-700'
                  }`}>
                    {reason.label}
                  </span>
                  {selectedReason === reason.id && (
                    <span className="ml-auto text-red-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Input */}
          {selectedReason === 'other' && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Please specify the reason *
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {customReason.length}/200 characters
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Customer Impact Notice */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-xs text-yellow-800">
              <strong>📱 Customer Notification:</strong> The customer will receive an SMS/notification about the rejection with the reason provided.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason || (selectedReason === 'other' && !customReason.trim())}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? '⏳ Rejecting...' : '❌ Reject Order'}
          </button>
        </div>

      </div>
    </div>
  );
}