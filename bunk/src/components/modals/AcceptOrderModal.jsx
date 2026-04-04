/**
 * AcceptOrderModal Component
 * Modal to confirm order acceptance
 * Location: bunk/src/components/modals/AcceptOrderModal.jsx
 */

import { useState } from 'react';

export default function AcceptOrderModal({ isOpen, order, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preparationTime, setPreparationTime] = useState(15); // minutes

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(order._id, preparationTime);
      onClose();
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Accept Order</h2>
              <p className="text-orange-100 text-sm">#{order.orderNumber}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Order Summary */}
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Type:</span>
                <span className="font-bold text-gray-900">{order.fuelDetails?.type?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold text-gray-900">{order.fuelDetails?.quantity}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-bold text-gray-900">{order.customer?.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-orange-600 text-lg">₹{order.charges?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Preparation Time */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Estimated Preparation Time ⏱️
            </label>
            <p className="text-xs text-gray-600 mb-3">
              How long will it take to prepare the fuel for pickup?
            </p>
            
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((time) => (
                <button
                  key={time}
                  onClick={() => setPreparationTime(time)}
                  className={`py-3 px-4 rounded-lg font-bold transition ${
                    preparationTime === time
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}m
                </button>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="text-sm font-bold text-blue-900 mb-2">📋 Important:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Ensure fuel quality and quantity before dispatch</li>
              <li>• Delivery partner will arrive for pickup shortly</li>
              <li>• Keep order ready within estimated time</li>
              <li>• SMS notification will be sent to customer</li>
            </ul>
          </div>

          {/* Confirmation Message */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800">
              ✅ By accepting, you confirm that fuel is available and order will be ready in <strong>{preparationTime} minutes</strong>
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg text-white font-bold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? '⏳ Accepting...' : '✅ Accept Order'}
          </button>
        </div>

      </div>
    </div>
  );
}