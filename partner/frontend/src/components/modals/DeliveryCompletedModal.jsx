/**
 * DeliveryCompletedModal Component
 * Modal to complete delivery with OTP verification from customer
 * Location: partner/src/components/modals/DeliveryCompletedModal.jsx
 */

import { useState } from 'react';

export default function DeliveryCompletedModal({ isOpen, order, onClose, onConfirm }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    setError('');

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!photoTaken) {
      setError('Please confirm you have taken a photo');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(order._id, otp);
      // Reset form
      setOtp('');
      setPhotoTaken(false);
    } catch (err) {
      setError(err.message || 'Failed to complete delivery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    setPhotoTaken(false);
    setError('');
    onClose();
  };

  const earnings = Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Complete Delivery</h2>
              <p className="text-green-100 text-sm">#{order.orderNumber}</p>
            </div>
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Congratulations */}
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-green-700 mb-2">
              Almost Done! 🏁
            </p>
            <p className="text-sm text-green-600">
              Complete the final verification to earn your payment
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fuel Delivered:</span>
              <span className="font-bold text-gray-900">{order.fuelDetails?.quantity}L {order.fuelDetails?.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-orange-600">₹{order.charges?.totalAmount}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-bold">
              <span className="text-gray-900">Your Earning:</span>
              <span className="text-green-600">₹{earnings}</span>
            </div>
          </div>

          {/* Customer Location */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-2">📍 Delivery Location</p>
            <p className="text-sm text-gray-700">
              {order.deliveryLocation?.address?.split(',')[0] || 'Location'}
            </p>
            {order.deliveryLocation?.landmark && (
              <p className="text-xs text-blue-600 mt-1">
                🏠 {order.deliveryLocation.landmark}
              </p>
            )}
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              🔐 Enter Delivery OTP
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Ask customer for the OTP and enter below
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="000000"
              maxLength={6}
              className={`w-full px-4 py-3 text-2xl font-bold text-center border-2 rounded-lg focus:outline-none transition ${
                error && otp.length !== 6
                  ? 'border-red-500 bg-red-50 focus:border-red-600'
                  : 'border-gray-300 focus:border-green-500'
              }`}
            />
            {otp.length === 6 && (
              <p className="text-xs text-green-600 mt-1">✅ OTP Ready</p>
            )}
            {error && otp.length !== 6 && (
              <p className="text-xs text-red-600 mt-1">❌ {error}</p>
            )}
          </div>

          {/* Photo Verification */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">📸 Take Delivery Photo</p>
                <p className="text-xs text-gray-700 mb-3">
                  Take a photo of the fuel delivery for proof
                </p>
                <button
                  type="button"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm"
                >
                  📷 Take Photo
                </button>
              </div>
              {photoTaken && (
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                  <span className="text-white text-lg">✓</span>
                </div>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-bold text-gray-900 mb-3">Before completing:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled
                  checked={otp.length === 6}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${otp.length === 6 ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                  ✓ Collected OTP from customer
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoTaken}
                  onChange={(e) => setPhotoTaken(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${photoTaken ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                  ✓ Took delivery photo
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled
                  checked={otp.length === 6 && photoTaken}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${otp.length === 6 && photoTaken ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                  ✓ Ready to complete
                </span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && otp.length === 6 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Safety Tips */}
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-700">
              ✓ Keep receipts and photos for your records
            </p>
          </div>

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
              disabled={isLoading || otp.length !== 6 || !photoTaken}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Completing...' : '✅ Complete'}
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-600 text-center">
            Payment will be processed after verification
          </p>
        </div>
      </div>
    </div>
  );
}