/**
 * MyOrders Page - FIXED
 * Hides "Start Delivery" button for completed orders
 * Location: partner/frontend/src/pages/MyOrders.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function MyOrders() {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const partnerId = userData._id;

  const filters = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'partner_assigned', label: 'Assigned', icon: '📦' },
    { id: 'picked_up', label: 'Picked Up', icon: '✓' },
    { id: 'in_transit', label: 'In Transit', icon: '🚗' },
    { id: 'delivered', label: 'Delivered', icon: '✅' },
    { id: 'completed', label: 'Completed', icon: '🎉' }
  ];

  useEffect(() => {
    if (partnerId) {
      loadMyOrders();
    } else {
      navigate('/login');
    }
  }, [partnerId]);

  useEffect(() => {
    filterOrders(activeFilter);
  }, [orders, activeFilter]);

  const loadMyOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/partners/${partnerId}/orders`);
      
      setOrders(response.data?.data?.orders || []);
      console.log('✅ Loaded partner orders:', response.data?.data?.orders?.length || 0);
    } catch (err) {
      console.error('❌ Error loading orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = (filter) => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  };

  const handleOrderClick = (orderId, orderStatus) => {
    // Don't navigate if order is completed
    if (orderStatus === 'completed') {
      return;
    }
    
    navigate(`/active-delivery/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <button
              onClick={loadMyOrders}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
          <p className="text-gray-600">
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 mt-2">✕</button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {filters.map(filter => {
              const count = filter.id === 'all' 
                ? orders.length 
                : orders.filter(o => o.status === filter.id).length;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon} {filter.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter.id
                      ? 'bg-white bg-opacity-30'
                      : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {orders.length === 0 ? '📭' : '🔍'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? 'No Orders Yet' : 'No orders in this category'}
            </h3>
            <p className="text-gray-600">
              {orders.length === 0 
                ? 'Accept orders from Available Orders to see them here' 
                : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-orange-500"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'partner_assigned' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'partner_assigned' ? '🚗 Assigned' :
                     order.status === 'picked_up' ? '✓ Picked Up' :
                     order.status === 'in_transit' ? '🚗 In Transit' :
                     order.status === 'delivered' ? '✅ Delivered' :
                     order.status === 'completed' ? '🎉 Completed' :
                     order.status}
                  </span>
                </div>

                {/* Fuel Details */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Fuel Type</p>
                      <p className="font-bold text-gray-900">
                        ⛽ {order.fuelDetails?.type?.toUpperCase() || 'PETROL'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-bold text-gray-900">
                        {order.fuelDetails?.quantity || 0}L
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer & Earning */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Customer</p>
                    <p className="font-semibold text-gray-900">
                      👤 {order.customer?.name || 'Customer'}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-right">
                    <p className="text-xs text-gray-600 mb-1">Your Earning</p>
                    <p className="font-bold text-green-600 text-lg">
                      ₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}
                    </p>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>📍 Distance</span>
                  <span className="font-semibold text-orange-600">
                    {(order.distance?.toCustomer || 1.04).toFixed(2)} km
                  </span>
                </div>

                {/* Action Button - ONLY show for non-completed orders */}
                {order.status !== 'completed' && (
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleOrderClick(order._id, order.status)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span className="text-xl">🗺️</span>
                      {order.status === 'partner_assigned' ? 'Start Delivery' :
                       order.status === 'picked_up' || order.status === 'in_transit' ? 'Continue Delivery' :
                       'View Details'}
                    </button>
                  </div>
                )}

                {/* Completed Order Message */}
                {order.status === 'completed' && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-green-800 font-semibold">✅ Delivery Completed</p>
                      <p className="text-xs text-green-700 mt-1">
                        Completed successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}