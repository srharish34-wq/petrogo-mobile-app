/**
 * Dashboard Page - FIXED VERSION
 * Calculates total earnings from completed orders
 * Location: partner/src/pages/Dashboard.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Button from '../components/common/Button';
import { PartnerStatusBadge } from '../components/common/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { partner, isAuthenticated, loading } = useAuthContext();
  
  const [stats, setStats] = useState({
    availableOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayEarnings: 0,
    totalEarnings: 0
  });
  const [latestOrders, setLatestOrders] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (partner) {
      loadDashboardData();
    }
  }, [isAuthenticated, loading, partner, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoadingStats(true);
      
      const availableResponse = await orderService.getAvailableOrders();
      const availableOrders = availableResponse.data?.orders || [];
      
      let partnerOrders = [];
      if (partner?._id) {
        const partnerResponse = await orderService.getPartnerOrders(partner._id);
        partnerOrders = partnerResponse.data?.orders || [];
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPartnerOrders = partnerOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      const pendingOrders = partnerOrders.filter(order => 
        order.status === 'partner_assigned' || order.status === 'picked_up'
      );

      const completedOrders = partnerOrders.filter(order => 
        order.status === 'completed'
      );

      const totalEarnings = completedOrders.reduce((sum, order) => {
        const deliveryCharge = order.charges?.deliveryCharge || 0;
        const emergencyFee = order.charges?.emergencyFee || 0;
        return sum + deliveryCharge + emergencyFee;
      }, 0);

      const todayCompletedOrders = completedOrders.filter(order => {
        const orderDate = new Date(order.completedAt || order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      const todayEarnings = todayCompletedOrders.reduce((sum, order) => {
        const deliveryCharge = order.charges?.deliveryCharge || 0;
        const emergencyFee = order.charges?.emergencyFee || 0;
        return sum + deliveryCharge + emergencyFee;
      }, 0);

      setStats({
        availableOrders: availableOrders.length,
        todayOrders: todayPartnerOrders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        todayEarnings: todayEarnings,
        totalEarnings: totalEarnings
      });

      setLatestOrders(availableOrders.slice(0, 3));

    } catch (err) {
      console.error('❌ Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleAcceptOrder = async (order) => {
    if (!partner?._id) {
      setError('Partner ID not found');
      return;
    }

    try {
      await orderService.acceptOrder(order._id, partner._id);
      loadDashboardData();
      alert('Order accepted! Check "My Orders"');
    } catch (err) {
      setError(err.message || 'Failed to accept order');
    }
  };

  const handleToggleStatus = () => {
    const newAvailability = !partner?.isAvailable;
    const newStatus = newAvailability ? 'available' : 'offline';
    
    const currentData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedData = {
      ...currentData,
      isAvailable: newAvailability,
      currentStatus: newStatus
    };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    window.location.reload();
  };

  if (loading || isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No partner data found</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Name & Status */}
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                {(partner?.name || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{partner?.name || 'Partner'}</p>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${partner?.isAvailable ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
                  <span className={`text-xs font-semibold ${partner?.isAvailable ? 'text-green-600' : 'text-gray-600'}`}>
                    {partner?.isAvailable ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Support & Settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/support')}
                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                title="Support"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                title="Settings"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 mt-2">✕</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {partner?.name || 'Partner'}! 👋
              </h1>
              <p className="text-orange-100 text-sm">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <PartnerStatusBadge status={partner?.currentStatus || 'offline'} size="lg" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate('/available-orders')} variant="primary" size="lg" fullWidth>
            📦 Available Orders ({stats.availableOrders})
          </Button>
          <Button onClick={() => navigate('/my-orders')} variant="secondary" size="lg" fullWidth>
            📋 My Orders
          </Button>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Status</h3>
              <p className="text-sm text-gray-600">
                {partner?.isAvailable ? 'Online - Receiving orders' : 'Offline'}
              </p>
            </div>
            <button
              onClick={handleToggleStatus}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                partner?.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                partner?.isAvailable ? 'translate-x-12' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3">📦</div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.todayOrders}</p>
            <p className="text-sm text-gray-600">Today Orders</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3">⏳</div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3">✅</div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.completedOrders}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3">💰</div>
            <p className="text-2xl font-bold text-gray-900 mb-1">₹{Math.round(stats.todayEarnings)}</p>
            <p className="text-sm text-gray-600">Today Earnings</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Total Earnings</h3>
            <span className="text-3xl">💰</span>
          </div>
          <div className="mb-4">
            <p className="text-4xl font-bold mb-1">₹{Math.round(stats.totalEarnings).toLocaleString('en-IN')}</p>
            <p className="text-green-100 text-sm">{stats.completedOrders} deliveries completed</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Available to Withdraw</span>
              <span className="font-bold">₹{Math.round(stats.totalEarnings).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Rating</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-500 mb-2">
              {partner?.performance?.rating?.average?.toFixed(1) || '5.0'}
            </div>
            <p className="text-sm text-gray-600">{partner?.performance?.rating?.count || 0} ratings</p>
          </div>
        </div>

        {/* Latest 3 Available Orders */}
        {latestOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Latest Available Orders</h3>
              <button 
                onClick={() => navigate('/available-orders')}
                className="text-orange-500 font-semibold text-sm"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {latestOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-4 hover:border-orange-500 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">Order #{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <p className="text-xl font-bold text-green-600">₹{order.charges?.totalAmount || 0}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Fuel</p>
                        <p className="font-bold">⛽ {order.fuelDetails?.type} - {order.fuelDetails?.quantity}L</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-bold">🚗 {order.distance?.toCustomer || 0} km</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLatestOrders(prev => prev.filter(o => o._id !== order._id))}
                      className="py-2 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptOrder(order)}
                      className="py-2 px-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}