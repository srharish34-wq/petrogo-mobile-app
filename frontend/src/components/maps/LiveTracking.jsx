/**
 * Live Tracking Component - FIXED
 * Shows real-time order tracking
 */

import { useState, useEffect } from 'react';
import BunkMarker from './BunkMarker';

// ✅ FIXED: Helper to safely convert values to strings
const safeString = (value) => {
  if (!value) return 'N/A';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    if (value.formatted) return value.formatted;
    return 'N/A';
  }
  return String(value);
};

export default function LiveTracking({ order, partnerLocation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatePartner, setAnimatePartner] = useState(false);

  // Order status steps
  const steps = [
    { status: 'pending', label: 'Order Placed', icon: '📝' },
    { status: 'confirmed', label: 'Confirmed', icon: '✅' },
    { status: 'partner_assigned', label: 'Partner Assigned', icon: '🚴' },
    { status: 'picked_up', label: 'Fuel Picked Up', icon: '⛽' },
    { status: 'in_transit', label: 'On the Way', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  // Update current step based on order status
  useEffect(() => {
    const stepIndex = steps.findIndex(step => step.status === order?.status);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, [order?.status]);

  // Animate partner location updates
  useEffect(() => {
    if (partnerLocation) {
      setAnimatePartner(true);
      const timer = setTimeout(() => setAnimatePartner(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [partnerLocation]);

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No order data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Area */}
      <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl h-80 overflow-hidden border-2 border-gray-300">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Delivery Location (Customer) */}
        <div className="absolute top-1/4 right-1/4">
          <div className="relative">
            <div className="absolute -inset-4 bg-red-400 rounded-full animate-ping opacity-30"></div>
            <div className="relative bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">📍</span>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow text-xs font-semibold whitespace-nowrap">
              Your Location
            </div>
          </div>
        </div>

        {/* Petrol Bunk */}
        <div className="absolute bottom-1/4 left-1/4">
          <BunkMarker bunk={order.petrolBunk} />
        </div>

        {/* Partner Location (if available) */}
        {partnerLocation && order.status !== 'delivered' && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${animatePartner ? 'scale-110' : 'scale-100'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-400 rounded-full animate-pulse"></div>
              <div className="relative bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-2xl">🚴</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow text-xs font-semibold whitespace-nowrap">
                Partner
              </div>
            </div>
          </div>
        )}

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#f97316" />
            </pattern>
          </defs>
          <line
            x1="25%"
            y1="75%"
            x2="75%"
            y2="25%"
            stroke="url(#dots)"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Order Info Card */}
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Order #{safeString(order.orderNumber)}</p>
              <p className="text-lg font-bold text-primary-600">
                {steps[currentStep]?.label || 'Processing'}
              </p>
            </div>
            <div className="text-4xl">
              {steps[currentStep]?.icon || '⏳'}
            </div>
          </div>
        </div>

        {/* ETA Card (if in transit) */}
        {['picked_up', 'in_transit'].includes(order.status) && (
          <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Estimated Arrival</p>
                <p className="text-2xl font-bold">15-20 min</p>
              </div>
              <div className="text-5xl animate-bounce-slow">
                🚚
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Progress</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200">
            <div
              className="bg-primary-600 w-full transition-all duration-500"
              style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.status} className="relative flex items-start">
                  {/* Icon */}
                  <div
                    className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${isCompleted
                        ? 'bg-primary-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-400'
                      }
                      ${isCurrent && 'animate-pulse'}
                    `}
                  >
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* Label */}
                  <div className="ml-4 flex-1 min-w-0">
                    <p
                      className={`
                        text-sm font-semibold
                        ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
                      `}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary-600 font-medium mt-1 animate-pulse">
                        In Progress...
                      </p>
                    )}
                    {isCompleted && index < currentStep && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ✓ Completed
                      </p>
                    )}
                  </div>

                  {/* Time (mock) */}
                  {isCompleted && (
                    <div className="text-xs text-gray-500">
                      {new Date(Date.now() - (steps.length - index) * 300000).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Fuel Type</p>
            <p className="text-sm font-semibold capitalize">{safeString(order.fuelDetails?.type)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Quantity</p>
            <p className="text-sm font-semibold">{safeString(order.fuelDetails?.quantity)} Liters</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Amount</p>
            <p className="text-sm font-semibold">₹{safeString(order.charges?.totalAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Distance</p>
            <p className="text-sm font-semibold">{safeString(order.distance?.toCustomer)} km</p>
          </div>
        </div>
      </div>

      {/* Contact Buttons */}
      {order.deliveryPartner && (
        <div className="flex gap-3">
          <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
            <span>📞</span>
            Call Partner
          </button>
          <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <span>💬</span>
            Chat
          </button>
        </div>
      )}
    </div>
  );
}