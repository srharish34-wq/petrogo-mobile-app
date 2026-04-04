/**
 * OrderCard Component
 * Displays order summary with actions
 * Location: bunk/src/components/cards/OrderCard.jsx
 */

import { useNavigate } from 'react-router-dom';

export default function OrderCard({ order, onAccept, onReject, onMarkReady }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      ready_for_pickup: 'bg-purple-100 text-purple-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      in_transit: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'New Order',
      accepted: 'Accepted',
      ready_for_pickup: 'Ready for Pickup',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-300 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        
        {/* Fuel Details */}
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl">
              ⛽
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Type & Quantity</p>
              <p className="text-lg font-bold text-gray-900">
                {order.fuelDetails?.quantity}L {order.fuelDetails?.type?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Price/Liter</p>
              <p className="font-bold text-gray-900">₹{order.fuelDetails?.pricePerLiter || 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Fuel Amount</p>
              <p className="font-bold text-orange-600">₹{order.charges?.fuelAmount || 0}</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600">
            👤
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">Customer</p>
            <p className="font-bold text-gray-900">{order.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{order.customer?.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Delivery Location */}
        <div className="flex items-start gap-3">
          <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center text-green-600">
            📍
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600">Delivery Location</p>
            <p className="font-semibold text-gray-900 text-sm">
              {order.deliveryLocation?.address?.split(',').slice(0, 2).join(',') || 'N/A'}
            </p>
            {order.deliveryLocation?.landmark && (
              <p className="text-xs text-blue-600 mt-1">🏠 {order.deliveryLocation.landmark}</p>
            )}
          </div>
        </div>

        {/* Delivery Partner (if assigned) */}
        {order.partner && (
          <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-3">
            <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white">
              🏍️
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600">Delivery Partner</p>
              <p className="font-bold text-gray-900">{order.partner?.name || 'Not Assigned'}</p>
              <p className="text-sm text-gray-600">{order.partner?.phone || ''}</p>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-orange-600">₹{order.charges?.totalAmount || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Payment Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentStatus === 'completed' ? '✅ Paid' : '⏳ Pending'}
            </span>
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        {order.status === 'pending' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onReject && onReject(order._id)}
              className="py-3 px-4 border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition"
            >
              ❌ Reject
            </button>
            <button
              onClick={() => onAccept && onAccept(order._id)}
              className="py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition"
            >
              ✅ Accept Order
            </button>
          </div>
        )}

        {order.status === 'accepted' && (
          <button
            onClick={() => onMarkReady && onMarkReady(order._id)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition"
          >
            📦 Mark Ready for Pickup
          </button>
        )}

        <button
          onClick={() => navigate(`/orders/${order._id}`)}
          className="w-full mt-3 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          👁️ View Details
        </button>
      </div>

    </div>
  );
}