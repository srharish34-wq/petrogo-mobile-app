/**
 * Filters Component
 * Reusable search and filter component
 * Location: partner/src/components/tables/Filters.jsx
 * Connected to backend: filters orders by status, date, amount
 */

import { useState } from 'react';

export default function Filters({
  onFilter = () => {},
  onSearch = () => {},
  filters = [],
  searchPlaceholder = 'Search orders...'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters };
    
    if (value === 'all' || value === '') {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  // Get active filter count
  const activeCount = Object.keys(activeFilters).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Filter Toggle Button */}
      {filters.length > 0 && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          <span>🔽 Filters</span>
          {activeCount > 0 && (
            <span className="ml-2 bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              {activeCount}
            </span>
          )}
        </button>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Filter By</h3>
            {activeCount > 0 && (
              <button
                onClick={() => {
                  setActiveFilters({});
                  onFilter({});
                }}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {filter.label}
                </label>

                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || 'all'}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="all">All {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'checkbox' ? (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key] === option.value}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange(filter.key, option.value);
                            } else {
                              handleFilterChange(filter.key, '');
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                ) : filter.type === 'daterange' ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      placeholder="From"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="date"
                      placeholder="To"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                ) : (
                  <input
                    type={filter.type || 'text'}
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setShowFilters(false)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Predefined Status Filter for Orders
 * Usage: <StatusFilter onFilter={handleFilter} />
 */
export function StatusFilter({ onFilter = () => {} }) {
  const statusOptions = [
    { value: 'pending', label: '⏳ Pending', icon: '⏳' },
    { value: 'confirmed', label: '✅ Confirmed', icon: '✅' },
    { value: 'partner_assigned', label: '🚗 Partner Assigned', icon: '🚗' },
    { value: 'picked_up', label: '📦 Picked Up', icon: '📦' },
    { value: 'in_transit', label: '🚗 In Transit', icon: '🚗' },
    { value: 'delivered', label: '✅ Delivered', icon: '✅' },
    { value: 'completed', label: '🎉 Completed', icon: '🎉' },
    { value: 'cancelled', label: '❌ Cancelled', icon: '❌' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilter(null)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
      >
        All
      </button>
      {statusOptions.map((status) => (
        <button
          key={status.value}
          onClick={() => onFilter(status.value)}
          className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-700 rounded-lg font-semibold transition"
        >
          {status.icon} {status.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Predefined Date Range Filter
 */
export function DateRangeFilter({ onFilter = () => {} }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleFilter = () => {
    onFilter({ from: fromDate, to: toDate });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
      />
      <button
        onClick={handleFilter}
        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
      >
        Filter
      </button>
    </div>
  );
}