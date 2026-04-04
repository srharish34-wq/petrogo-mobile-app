/**
 * Available Orders Page
 * Shows pending customer orders that partners can accept
 * Location: partner/src/pages/AvailableOrders.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';

export default function AvailableOrders() {
  const navigate = useNavigate();
  const { partner } = useAuthContext();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingOrder, setAcceptingOrder] = useState(null);

  useEffect(() => {
    loadAvailableOrders();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(loadAvailableOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAvailableOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await orderService.getAvailableOrders({ limit: 50 });
      setOrders(response.data?.orders || []);
      
      console.log('✅ Available orders loaded:', response.data?.count || 0);
    } catch (err) {
      console.error('❌ Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (order) => {
    if (!partner?._id) {
      setError('Partner ID not found. Please login again.');
      return;
    }

    setAcceptingOrder(order._id);
    
    try {
      await orderService.acceptOrder(order._id, partner._id);
      
      console.log('✅ Order accepted:', order.orderNumber);
      
      // Remove from list
      setOrders(prev => prev.filter(o => o._id !== order._id));
      
      // Show success and redirect
      alert('Order accepted successfully!');
      navigate('/my-orders');
      
    } catch (err) {
      console.error('❌ Error accepting order:', err);
      setError(err.message || 'Failed to accept order');
    } finally {
      setAcceptingOrder(null);
    }
  };

  const handleDeclineOrder = (order) => {
    // Just remove from view
    setOrders(prev => prev.filter(o => o._id !== order._id));
    console.log('❌ Order declined:', order.orderNumber);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading available orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
            <p className="text-sm text-gray-600">{orders.length} orders waiting</p>
          </div>
          <button
            onClick={loadAvailableOrders}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <span className="text-2xl">🔄</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Available Orders</h3>
            <p className="text-gray-600 mb-6">Check back soon for new delivery requests!</p>
            <Button onClick={loadAvailableOrders} variant="primary">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6 hover:border-orange-500 transition"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{order.charges?.totalAmount || 0}
                    </p>
                    <p className="text-xs text-gray-600">Total earning</p>
                  </div>
                </div>

                {/* Fuel Details */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Fuel Type</p>
                      <p className="font-bold text-gray-900 capitalize">
                        ⛽ {order.fuelDetails?.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-bold text-gray-900">
                        {order.fuelDetails?.quantity}L
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Customer</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {order.customer?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer?.name || 'Customer'}</p>
                      <p className="text-sm text-gray-600">{order.customer?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Delivery Location</p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm text-gray-900">
                      📍 {order.deliveryLocation?.address || 'Location provided'}
                    </p>
                    {order.deliveryLocation?.landmark && (
                      <p className="text-xs text-gray-600 mt-1">
                        Near: {order.deliveryLocation.landmark}
                      </p>
                    )}
                  </div>
                </div>

                {/* Distance */}
                {order.distance?.toCustomer && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      🚗 Distance: <span className="font-bold">{order.distance.toCustomer} km</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleDeclineOrder(order)}
                    variant="outline"
                    fullWidth
                    disabled={acceptingOrder === order._id}
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleAcceptOrder(order)}
                    variant="primary"
                    fullWidth
                    loading={acceptingOrder === order._id}
                    disabled={acceptingOrder !== null}
                  >
                    Accept Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}