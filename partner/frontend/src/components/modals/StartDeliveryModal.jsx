/**
 * StartDeliveryModal Component
 * Modal to start delivery after picking up fuel
 * Location: partner/src/components/modals/StartDeliveryModal.jsx
 */

import { useState } from 'react';

export default function StartDeliveryModal({ isOpen, order, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fuelConfirmed, setFuelConfirmed] = useState(false);
  const [vehicleReady, setVehicleReady] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    if (!fuelConfirmed || !vehicleReady) {
      alert('Please confirm all checklist items before starting delivery');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(order._id);
      setFuelConfirmed(false);
      setVehicleReady(false);
      setPhotoTaken(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFuelConfirmed(false);
    setVehicleReady(false);
    setPhotoTaken(false);
    onClose();
  };

  const allChecked = fuelConfirmed && vehicleReady;
  const fuelType = order.fuelDetails?.type || '';
  const fuelQuantity = order.fuelDetails?.quantity || 0;
  const distance = (order.distance?.toCustomer || 0).toFixed(2);
  const estimatedTime = Math.round((order.distance?.toCustomer || 0) * 1.5);
  const customerPhone = order.customer?.phone || '';
  const phoneHref = 'tel:' + customerPhone;
  const earnings = Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Start Delivery</h2>
              <p className="text-blue-100 text-sm">#{order.orderNumber}</p>
            </div>
            <span className="text-4xl">🚗</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">Delivery Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fuel:</span>
                <span className="font-bold text-gray-900">{fuelQuantity}L {fuelType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance:</span>
                <span className="font-bold text-gray-900">{distance} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Time:</span>
                <span className="font-bold text-gray-900">~{estimatedTime} min</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xl">📍</span>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">Delivery To:</p>
                <p className="text-sm font-semibold text-gray-900">
                  {order.deliveryLocation?.address || 'Customer Location'}
                </p>
                {order.deliveryLocation?.landmark && (
                  <p className="text-xs text-blue-600 mt-1">📌 {order.deliveryLocation.landmark}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div>
                <p className="text-xs text-gray-600">Customer</p>
                <p className="text-sm font-bold text-gray-900">{order.customer?.name || 'Customer'}</p>
              </div>
              {customerPhone && (
                <a
                  href={phoneHref}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.917 1.888 3.386 3.804 3.804l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm font-bold">Call</span>
                </a>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-3">✓ Pre-Delivery Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fuelConfirmed}
                  onChange={(e) => setFuelConfirmed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <p className={fuelConfirmed ? 'font-semibold text-green-700' : 'font-semibold text-gray-900'}>
                    ⛽ Fuel Picked Up
                  </p>
                  <p className="text-xs text-gray-600">Confirmed {fuelQuantity}L {fuelType} collected</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vehicleReady}
                  onChange={(e) => setVehicleReady(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <p className={vehicleReady ? 'font-semibold text-green-700' : 'font-semibold text-gray-900'}>
                    🚗 Vehicle Ready
                  </p>
                  <p className="text-xs text-gray-600">Fuel container secured properly</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={photoTaken}
                  onChange={(e) => setPhotoTaken(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <p className={photoTaken ? 'font-semibold text-green-700' : 'font-semibold text-gray-700'}>
                    📸 Pickup Photo (Optional)
                  </p>
                  <p className="text-xs text-gray-600">Photo for records</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-sm text-orange-800"><strong>⚠️ Safety First:</strong></p>
            <ul className="text-xs text-orange-700 mt-2 space-y-1 ml-4">
              <li>✓ Drive carefully with fuel</li>
              <li>✓ Follow traffic rules</li>
              <li>✓ Use GPS navigation</li>
              <li>✓ Call customer if needed</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-sm text-green-700">💰 You will earn <strong>₹{earnings}</strong> on completion</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button onClick={handleClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !allChecked}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? '⏳ Starting...' : '🚗 Start Delivery'}
            </button>
          </div>

          {!allChecked && (
            <p className="text-xs text-center text-red-600">⚠️ Complete the checklist to start delivery</p>
          )}
        </div>
      </div>
    </div>
  );
}