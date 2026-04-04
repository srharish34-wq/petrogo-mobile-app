/**
 * Emergency Request Page - WITH PAYMENT STEP
 * Updated flow: Location → Fuel → Quantity → Summary → Payment → Safety → Order
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { bunkService } from '../services/bunkService';
import { orderService } from '../services/orderService';
import FuelSelector from '../components/order/FuelSelector';
import QuantitySelector from '../components/order/QuantitySelector';
import LocationPicker from '../components/maps/LocationPicker';
import OrderSummary from '../components/order/OrderSummary';
import PaymentPage from '../components/order/PaymentPage';
import SafetyInstructions from '../components/order/SafetyInstructions';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const formatAddress = (addr) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  if (typeof addr === 'object') {
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.pincode) parts.push(addr.pincode);
    if (addr.country) parts.push(addr.country);
    if (parts.length > 0) return parts.filter(Boolean).join(', ');
  }
  return '';
};

export default function EmergencyRequest() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // ✅ Steps - Now 5 steps total
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Added Payment step

  // Order data
  const [fuelType, setFuelType] = useState('diesel');
  const [quantity, setQuantity] = useState(2);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [nearbyBunks, setNearbyBunks] = useState([]);
  const [paymentData, setPaymentData] = useState(null); // New: Payment data

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  // Fuel prices
  const [prices, setPrices] = useState({
    diesel: 95,
    petrol: 105
  });

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLocationSelect = async (location) => {
    try {
      const formattedAddress = formatAddress(location.address);
      const formattedLocation = {
        ...location,
        address: formattedAddress
      };
      
      setDeliveryLocation(formattedLocation);
      setLoading(true);
      setError('');

      try {
        const response = await bunkService.findNearbyBunks(
          location.coordinates[0],
          location.coordinates[1],
          fuelType,
          quantity
        );

        const bunks = response?.data?.bunks || response?.bunks || [];

        if (bunks.length > 0) {
          setNearbyBunks(bunks);
          setSelectedBunk(bunks[0]);

          const bunk = bunks[0];
          setPrices({
            diesel: bunk.fuelAvailability?.diesel?.price || 95,
            petrol: bunk.fuelAvailability?.petrol?.price || 105
          });
        }
        
        setCurrentStep(2);

      } catch (err) {
        console.warn('Bunk API failed, using defaults:', err);
        setCurrentStep(2);
      }
    } catch (err) {
      console.error('❌ Error in handleLocationSelect:', err);
      setError('Error processing location');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // ✅ Updated: Payment is step 5, show safety modal after payment
    if (currentStep === 5) {
      setShowSafetyModal(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  // ✅ New: Handle payment confirmation
  const handlePaymentConfirm = (payment) => {
    setPaymentData(payment);
    setShowSafetyModal(true); // Show safety modal after payment
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setError('');

    try {
      if (!currentUser || !currentUser.phone) {
        throw new Error('User phone number is missing. Please log in again.');
      }

      if (!fuelType) {
        throw new Error('Please select a fuel type');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('Please select a valid quantity');
      }

      if (!deliveryLocation) {
        throw new Error('Please select a delivery location');
      }

      if (!deliveryLocation.coordinates || deliveryLocation.coordinates.length !== 2) {
        throw new Error('Invalid delivery location coordinates');
      }

      const addressString = formatAddress(deliveryLocation.address);
      
      if (!addressString || !addressString.trim()) {
        throw new Error('Address is required');
      }

      const orderData = {
        customerPhone: currentUser.phone,
        petrolBunkId: selectedBunk?._id || null,
        fuelType: fuelType,
        quantity: Number(quantity),
        deliveryLocation: {
          type: 'Point',
          coordinates: [
            Number(deliveryLocation.coordinates[0]),
            Number(deliveryLocation.coordinates[1])
          ],
          address: addressString.trim(),
          landmark: deliveryLocation.landmark || ''
        },
        // ✅ Include payment data
        paymentMethod: paymentData?.paymentMethod || 'cash',
        paymentBreakdown: paymentData?.breakdown
      };

      console.log('📦 Creating order with data:', orderData);

      const response = await orderService.createOrder(orderData);

      const orderId = response?.data?.order?._id || response?.data?._id || response?.order?._id;

      if (response.status === 'success' && orderId) {
        console.log('✅ Order created successfully:', orderId);
        navigate(`/tracking/${orderId}`);
      } else {
        throw new Error('Order created but no order ID returned');
      }
    } catch (err) {
      console.error('❌ Order creation error:', err);
      
      let errorMessage = 'Failed to create order. Please try again.';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setShowSafetyModal(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateCharges = () => {
    const pricePerLiter = prices[fuelType];
    const baseDeliveryCharge = 30;
    const perKmCharge = 10;
    const distance = selectedBunk?.distance?.toCustomer || 2;
    const deliveryCharge = Math.min(baseDeliveryCharge + (distance * perKmCharge), 100);
    const emergencyFee = 50;

    return {
      pricePerLiter,
      deliveryCharge,
      emergencyFee,
      distance
    };
  };

  // ✅ Updated steps with Payment
  const steps = [
    { number: 1, title: 'Location', icon: '📍' },
    { number: 2, title: 'Fuel Type', icon: '⛽' },
    { number: 3, title: 'Quantity', icon: '🛢️' },
    { number: 4, title: 'Summary', icon: '📋' },
    { number: 5, title: 'Payment', icon: '💳' }
  ];

  if (loading && currentStep === 1) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Emergency Fuel Request
              </h1>
              <p className="text-gray-600 mt-1">
                Get fuel delivered in 30-45 minutes
              </p>
            </div>
            <div className="text-5xl">🚨</div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      transition-all duration-300
                      ${currentStep >= step.number
                        ? 'bg-primary-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  
                  <span
                    className={`
                      text-xs mt-2 font-medium
                      ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 flex-1 mx-2 rounded transition-all duration-300
                      ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6 animate-slide-up">
              <div className="flex items-center gap-3">
                <span className="text-3xl">❌</span>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {currentStep === 1 && (
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialLocation={deliveryLocation}
            />
          )}

          {/* Step 2: Fuel Type */}
          {currentStep === 2 && (
            <FuelSelector
              selectedFuel={fuelType}
              onSelect={setFuelType}
              prices={prices}
            />
          )}

          {/* Step 3: Quantity */}
          {currentStep === 3 && (
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              pricePerLiter={prices[fuelType]}
            />
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <OrderSummary
              orderData={{
                fuelType,
                quantity,
                pricePerLiter: prices[fuelType],
                deliveryLocation,
                petrolBunk: selectedBunk,
                charges: calculateCharges()
              }}
              onEdit={(section) => {
                if (section === 'fuel') setCurrentStep(2);
                if (section === 'location') setCurrentStep(1);
              }}
            />
          )}

          {/* ✅ Step 5: Payment (NEW!) */}
          {currentStep === 5 && (
            <PaymentPage
              orderData={{
                fuelType,
                quantity,
                pricePerLiter: prices[fuelType],
                deliveryLocation,
                petrolBunk: selectedBunk,
                charges: calculateCharges()
              }}
              onConfirmPayment={handlePaymentConfirm}
              onBack={handlePrevious}
              loading={loading}
            />
          )}

          {/* Navigation Buttons - Only show for steps 1-4 */}
          {currentStep < 5 && (
            <div className="flex gap-4 mt-8 pt-8 border-t">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  ← Previous
                </Button>
              )}

              <Button
                onClick={handleNext}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading || (currentStep === 1 && !deliveryLocation)}
              >
                Next →
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Safety Instructions Modal */}
      <SafetyInstructions
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onAccept={handleCreateOrder}
      />
    </div>
  );
}