/**
 * Order History Page
 * Shows all past orders
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

export default function OrderHistory() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'cancelled'

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        navigate('/');
        return;
      }

      try {
        const response = await orderService.getCustomerOrders(currentUser.phone);
        
        if (response.status === 'success') {
          setOrders(response.data.orders);
        }
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'completed') return order.status === 'completed';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      partner_assigned: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Partner Assigned' },
      picked_up: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Picked Up' },
      in_transit: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'In Transit' },
      delivered: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Delivered' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600 mt-1">
                {orders.length} total order{orders.length !== 1 ? 's' : ''}
              </p>
            </div>

            <Button
              onClick={() => navigate('/emergency')}
              variant="primary"
              size="md"
            >
              <span className="text-xl mr-2">⚡</span>
              New Order
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-3 overflow-x-auto">
            {[
              { value: 'all', label: 'All Orders', icon: '📋' },
              { value: 'completed', label: 'Completed', icon: '✅' },
              { value: 'cancelled', label: 'Cancelled', icon: '❌' }
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`
                  px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all
                  ${filter === item.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet."
                : `You have no ${filter} orders.`
              }
            </p>
            <Button
              onClick={() => navigate('/emergency')}
              variant="primary"
              size="lg"
            >
              Place Your First Order
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/tracking/${order._id}`)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Order Details */}
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Fuel Type</p>
                      <p className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                        {order.fuelDetails?.type === 'diesel' ? '🛢️' : '⛽'}
                        {order.fuelDetails?.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-semibold text-gray-900">
                        {order.fuelDetails?.quantity} Liters
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="font-semibold text-primary-600">
                        ₹{order.charges?.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Distance</p>
                      <p className="font-semibold text-gray-900">
                        {order.distance?.toCustomer} km
                      </p>
                    </div>
                  </div>

                  {/* Petrol Bunk */}
                  {order.petrolBunk && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-xs text-gray-600 mb-1">Petrol Bunk</p>
                      <p className="font-semibold text-gray-900">
                        {order.petrolBunk.name}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.status === 'completed' && (
                        <span className="text-green-600 font-medium">
                          ✓ Delivered successfully
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="text-red-600 font-medium">
                          ✗ Order cancelled
                        </span>
                      )}
                      {!['completed', 'cancelled'].includes(order.status) && (
                        <span className="text-blue-600 font-medium">
                          → In progress
                        </span>
                      )}
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}