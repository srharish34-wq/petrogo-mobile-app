/**
 * Recent Orders Component
 * Location: admin/src/components/dashboard/RecentOrders.jsx
 */

export default function RecentOrders({ orders }) {
  const defaultOrders = orders || [
    {
      id: 'PG20260203CLVTN',
      customer: 'Harini',
      phone: '9876543210',
      fuel: 'Diesel',
      quantity: '2L',
      amount: '₹285',
      status: 'delivered',
      time: '2 hours ago'
    },
    {
      id: 'PG20260203THYMQ',
      customer: 'Ashwin',
      phone: '9876543211',
      fuel: 'Petrol',
      quantity: '3L',
      amount: '₹380',
      status: 'in_progress',
      time: '1 hour ago'
    },
    {
      id: 'PG20260203XYZAB',
      customer: 'Ramesh',
      phone: '9876543212',
      fuel: 'Diesel',
      quantity: '5L',
      amount: '₹575',
      status: 'pending',
      time: '30 min ago'
    },
    {
      id: 'PG20260203ABCDE',
      customer: 'Priya',
      phone: '9876543213',
      fuel: 'Petrol',
      quantity: '2L',
      amount: '₹240',
      status: 'cancelled',
      time: '15 min ago'
    },
    {
      id: 'PG20260203FGHIJ',
      customer: 'Kumar',
      phone: '9876543214',
      fuel: 'Diesel',
      quantity: '4L',
      amount: '₹460',
      status: 'pending',
      time: '5 min ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return '✅';
      case 'in_progress':
        return '🚚';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest fuel delivery orders</p>
        </div>
        <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Fuel</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Quantity</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Time</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {defaultOrders.map((order, index) => (
              <tr 
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-700">{order.fuel}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900">{order.quantity}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs text-gray-500">{order.time}</span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}