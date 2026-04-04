/**
 * Payment Page Component
 * Shows payment breakdown and payment options before order placement
 */

import { useState } from 'react';

export default function PaymentPage({ orderData, onConfirmPayment, onBack, loading }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  if (!orderData) return null;

  const {
    fuelType,
    quantity,
    pricePerLiter,
    deliveryLocation,
    petrolBunk,
    charges
  } = orderData;

  // Check if it's late night (10 PM - 6 AM)
  const currentHour = new Date().getHours();
  const isLateNight = currentHour >= 22 || currentHour < 6;
  const lateNightCharge = isLateNight ? 100 : 0;

  // Calculate charges
  const fuelCost = quantity * pricePerLiter;
  const deliveryCharge = charges?.deliveryCharge || 50;
  const emergencyFee = charges?.emergencyFee || 50;
  const convenienceFee = 20;
  const subtotal = fuelCost + deliveryCharge + emergencyFee + convenienceFee + lateNightCharge;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Payment methods
  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay with cash when fuel is delivered',
      available: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm, etc.',
      available: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Rupay',
      available: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      description: 'Paytm, Amazon Pay, etc.',
      available: true
    }
  ];

  const handleConfirm = () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    onConfirmPayment({
      paymentMethod: selectedPaymentMethod,
      totalAmount: total,
      breakdown: {
        fuelCost,
        deliveryCharge,
        emergencyFee,
        convenienceFee,
        lateNightCharge,
        gst,
        subtotal,
        total
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <span className="text-4xl">💳</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-gray-600">Review charges and select payment method</p>
      </div>

      {/* Late Night Alert */}
      {isLateNight && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <div>
              <p className="font-bold text-purple-900">Late Night Order</p>
              <p className="text-sm text-purple-800">
                Late night handling charge of ₹{lateNightCharge} applies (10 PM - 6 AM)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{fuelType === 'diesel' ? '🛢️' : '⛽'}</span>
            <div>
              <p className="text-sm text-blue-700">Your Order</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {quantity}L {fuelType}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700">Fuel Cost</p>
            <p className="text-2xl font-bold text-gray-900">₹{fuelCost.toFixed(2)}</p>
          </div>
        </div>

        {petrolBunk && (
          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Petrol Bunk</p>
            <p className="text-sm font-semibold text-gray-900">{petrolBunk.name}</p>
          </div>
        )}
      </div>

      {/* Charge Breakdown */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span>
          Charge Breakdown
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Fuel Cost</p>
              <p className="text-xs text-gray-600">{quantity}L × ₹{pricePerLiter}/L</p>
            </div>
            <span className="font-bold text-gray-900">₹{fuelCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Delivery Charge</p>
              <p className="text-xs text-gray-600">Based on distance</p>
            </div>
            <span className="font-bold text-gray-900">₹{deliveryCharge.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Emergency Service Fee</p>
              <p className="text-xs text-gray-600">For immediate delivery</p>
            </div>
            <span className="font-bold text-gray-900">₹{emergencyFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Convenience Fee</p>
              <p className="text-xs text-gray-600">Platform charges</p>
            </div>
            <span className="font-bold text-gray-900">₹{convenienceFee.toFixed(2)}</span>
          </div>

          {isLateNight && (
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-purple-900">Late Night Handling</p>
                <p className="text-xs text-purple-700">10 PM - 6 AM service</p>
              </div>
              <span className="font-bold text-purple-900">₹{lateNightCharge.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="font-medium text-gray-700">Subtotal</span>
            <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">GST (18%)</span>
            <span className="font-bold text-gray-900">₹{gst.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-gray-300 bg-gradient-to-r from-green-50 to-green-100 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Amount</p>
              <p className="text-xs text-green-600">Including all charges</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-700">₹{total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>💰</span>
          Select Payment Method
        </h3>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setSelectedPaymentMethod(method.id);
                setError('');
              }}
              disabled={!method.available}
              className={`
                w-full p-4 rounded-xl border-2 transition-all text-left
                ${selectedPaymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
                ${!method.available && 'opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{method.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                <div>
                  {selectedPaymentMethod === method.id ? (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading || !selectedPaymentMethod}
          className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Confirm & Pay ₹${total.toFixed(2)}`}
        </button>
      </div>

      {/* Security Badge */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure & Encrypted Payment</span>
        </div>
      </div>
    </div>
  );
}