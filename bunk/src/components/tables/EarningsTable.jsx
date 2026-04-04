/**
 * EarningsTable Component
 * Displays earnings breakdown with date filtering
 * Location: bunk/src/components/tables/EarningsTable.jsx
 */

import { useState } from 'react';

export default function EarningsTable({ earnings = [], onExport }) {
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const getFilteredEarnings = () => {
    const now = new Date();
    
    return earnings.filter(item => {
      const itemDate = new Date(item.date);
      
      switch(dateFilter) {
        case 'today':
          return itemDate.toDateString() === now.toDateString();
        
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        
        case 'month':
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        
        case 'year':
          return itemDate.getFullYear() === now.getFullYear();
        
        default:
          return true;
      }
    });
  };

  const filteredEarnings = getFilteredEarnings();

  // Sort earnings
  const sortedEarnings = [...filteredEarnings].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'date') {
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

  // Calculate totals
  const totals = sortedEarnings.reduce((acc, item) => ({
    petrolSales: acc.petrolSales + (item.petrolSales || 0),
    dieselSales: acc.dieselSales + (item.dieselSales || 0),
    deliveryCharges: acc.deliveryCharges + (item.deliveryCharges || 0),
    total: acc.total + (item.total || 0)
  }), { petrolSales: 0, dieselSales: 0, deliveryCharges: 0, total: 0 });

  if (earnings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Earnings Data</h3>
        <p className="text-gray-600">Complete orders to see earnings breakdown here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      
      {/* Header Controls */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Date Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'today', 'week', 'month', 'year'].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  dateFilter === filter
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Time' : 
                 filter === 'today' ? 'Today' :
                 filter === 'week' ? 'This Week' :
                 filter === 'month' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          {onExport && (
            <button
              onClick={() => onExport(sortedEarnings)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          )}
        </div>

        {/* Totals Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
            <p className="text-xs text-gray-600 mb-1">Petrol Sales</p>
            <p className="text-lg font-bold text-orange-600">
              ₹{totals.petrolSales.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
            <p className="text-xs text-gray-600 mb-1">Diesel Sales</p>
            <p className="text-lg font-bold text-blue-600">
              ₹{totals.dieselSales.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
            <p className="text-xs text-gray-600 mb-1">Delivery Charges</p>
            <p className="text-lg font-bold text-green-600">
              ₹{totals.deliveryCharges.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-3">
            <p className="text-xs text-white mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-white">
              ₹{totals.total.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th 
                onClick={() => handleSort('date')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('ordersCount')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Orders {sortBy === 'ordersCount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('petrolSales')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Petrol ⛽ {sortBy === 'petrolSales' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('dieselSales')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Diesel 🛢️ {sortBy === 'dieselSales' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('deliveryCharges')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Delivery {sortBy === 'deliveryCharges' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('total')}
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
              >
                Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sortedEarnings.map((item, index) => (
              <tr key={index} className="hover:bg-orange-50 transition">
                {/* Date */}
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                  </div>
                </td>

                {/* Orders Count */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      {item.ordersCount || 0}
                    </span>
                  </div>
                </td>

                {/* Petrol Sales */}
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-orange-600">
                    ₹{(item.petrolSales || 0).toLocaleString('en-IN')}
                  </div>
                  {item.petrolQuantity && (
                    <div className="text-xs text-gray-500">
                      {item.petrolQuantity}L sold
                    </div>
                  )}
                </td>

                {/* Diesel Sales */}
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-blue-600">
                    ₹{(item.dieselSales || 0).toLocaleString('en-IN')}
                  </div>
                  {item.dieselQuantity && (
                    <div className="text-xs text-gray-500">
                      {item.dieselQuantity}L sold
                    </div>
                  )}
                </td>

                {/* Delivery Charges */}
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-green-600">
                    ₹{(item.deliveryCharges || 0).toLocaleString('en-IN')}
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-4">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{(item.total || 0).toLocaleString('en-IN')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer with Totals */}
          <tfoot className="bg-gradient-to-r from-orange-50 to-red-50 border-t-2 border-orange-300">
            <tr>
              <td className="px-4 py-4 font-bold text-gray-900" colSpan="2">
                TOTAL ({sortedEarnings.length} {dateFilter === 'all' ? 'days' : dateFilter})
              </td>
              <td className="px-4 py-4 text-sm font-bold text-orange-600">
                ₹{totals.petrolSales.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-sm font-bold text-blue-600">
                ₹{totals.dieselSales.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-sm font-bold text-green-600">
                ₹{totals.deliveryCharges.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-lg font-bold text-orange-600">
                ₹{totals.total.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* No Results */}
      {sortedEarnings.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-600">No earnings data for selected period</p>
        </div>
      )}

    </div>
  );
}