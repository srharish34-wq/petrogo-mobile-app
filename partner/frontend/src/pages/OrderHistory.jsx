/**
 * OrderHistory Page
 * View completed and cancelled orders
 * Location: partner/src/pages/OrderHistory.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { NoDeliveriesEmpty } from '../components/common/EmptyState';
import { OrderStatusBadge } from '../components/common/StatusBadge';

export default function OrderHistory() {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const partnerId = userData._id;

  const statusFilters = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'cancelled', label: 'Cancelled', icon: '❌' }
  ];

  const dateFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  useEffect(() => {
    if (partnerId) {
      loadOrderHistory();
    } else {
      navigate('/login');
    }
  }, [partnerId, navigate]);

  useEffect(() => {
    applyFilters();
  }, [orders, activeFilter, dateRange]);

  const loadOrderHistory = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await orderService.getPartnerOrders(partnerId);
      
      // Filter only completed and cancelled orders
      const historyOrders = (response.data?.orders || []).filter(
        order => order.status === 'completed' || order.status === 'cancelled'
      );
      
      setOrders(historyOrders);
      console.log('✅ Loaded order history:', historyOrders.length);
    } catch (err) {
      console.error('❌ Error loading history:', err);
      setError(err.message || 'Failed to load order history');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === activeFilter);
    }

    // Filter by date
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        if (dateRange === 'today') {
          return orderDate >= today;
        } else if (dateRange === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateRange === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  const calculateStats = () => {
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalEarnings = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => {
        return sum + Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0));
      }, 0);

    return { completed, cancelled, totalEarnings };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-green-700 font-semibold mt-1">Completed</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-red-700 font-semibold mt-1">Cancelled</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">₹{stats.totalEarnings}</p>
            <p className="text-xs text-orange-700 font-semibold mt-1">Earned</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-4">
          
          {/* Status Filter */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Filter by Status</p>
            <div className="flex gap-2 overflow-x-auto">
              {statusFilters.map(filter => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Filter by Date</p>
            <div className="flex gap-2 overflow-x-auto">
              {dateFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setDateRange(filter.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
                    dateRange === filter.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div>
            {orders.length === 0 ? (
              <NoDeliveriesEmpty />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-2">🔍</p>
                <p className="text-sm">No orders match your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-gray-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Fuel</p>
                    <p className="font-semibold text-gray-900">
                      {order.fuelDetails?.quantity}L {order.fuelDetails?.type?.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {order.status === 'completed' ? 'Earned' : 'Amount'}
                    </p>
                    <p className={`font-bold ${
                      order.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      ₹{Math.round((order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0))}
                    </p>
                  </div>
                </div>

                {/* Customer & Distance */}
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    👤 {order.customer?.name || 'Customer'}
                  </span>
                  <span className="text-xs text-gray-600">
                    📍 {(order.distance?.toCustomer || 0).toFixed(2)} km
                  </span>
                </div>

                {/* Completion/Cancellation Info */}
                {order.status === 'completed' && order.deliveredAt && (
                  <div className="mt-3 bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-700">
                      ✅ Delivered on {new Date(order.deliveredAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                )}

                {order.status === 'cancelled' && order.cancellation && (
                  <div className="mt-3 bg-red-50 rounded-lg p-2">
                    <p className="text-xs text-red-700">
                      ❌ Cancelled by {order.cancellation.cancelledBy}
                    </p>
                    {order.cancellation.reason && (
                      <p className="text-xs text-red-600 mt-1">
                        Reason: {order.cancellation.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Showing Results */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}

      </div>
    </div>
  );
}