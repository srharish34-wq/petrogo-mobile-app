/**
 * OrdersTable Component
 * Displays orders in table format with filtering and actions
 * Location: bunk/src/components/tables/OrdersTable.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrdersTable({ 
  orders = [], 
  onAccept, 
  onReject, 
  onMarkReady,
  showActions = true 
}) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      ready_for_pickup: 'bg-purple-100 text-purple-800 border-purple-300',
      picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      in_transit: 'bg-orange-100 text-orange-800 border-orange-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      rejected: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'New',
      accepted: 'Accepted',
      ready_for_pickup: 'Ready',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Orders will appear here once customers place them</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      
      {/* Header Controls */}
      <div className="p-4 bg-gray-50 border-b space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number, customer name, or phone..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'accepted', 'ready_for_pickup', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                filterStatus === status
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : getStatusLabel(status)}
              <span className="ml-2 text-xs">
                ({orders.filter(o => status === 'all' || o.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <strong>{sortedOrders.length}</strong> of <strong>{orders.length}</strong> orders
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th 
                onClick={() => handleSort('orderNumber')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Order # {sortBy === 'orderNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Fuel
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                Status
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <tr 
                key={order._id}
                className="hover:bg-orange-50 transition cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                {/* Order Number */}
                <td className="px-4 py-4">
                  <div className="font-bold text-gray-900">#{order.orderNumber}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).getFullYear()}
                  </div>
                </td>

                {/* Customer */}
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {order.customer?.name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customer?.phone || 'N/A'}
                  </div>
                </td>

                {/* Fuel */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {order.fuelDetails?.type?.toLowerCase() === 'petrol' ? '⛽' : '🛢️'}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {order.fuelDetails?.quantity}L
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.fuelDetails?.type?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-orange-600">
                    ₹{order.charges?.totalAmount || 0}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>

                {/* Actions */}
                {showActions && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onAccept(order._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                            title="Accept"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => onReject(order._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                            title="Reject"
                          >
                            ✕
                          </button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => onMarkReady(order._id)}
                          className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-bold transition"
                        >
                          Mark Ready
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        title="View Details"
                      >
                        👁️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {sortedOrders.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-600">No orders found matching your filters</p>
        </div>
      )}

    </div>
  );
}