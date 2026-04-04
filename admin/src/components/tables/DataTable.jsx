/**
 * DataTable Component
 * Generic reusable data table for displaying orders, history, etc.
 * Location: partner/src/components/tables/DataTable.jsx
 */

import { useState, useMemo } from 'react';

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  onRowClick = null,
  onActionClick = null,
  searchable = true,
  searchPlaceholder = 'Search...',
  rowsPerPage = 10,
  striped = true,
  hover = true,
  compact = false
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <span className="text-gray-300 text-xs">⇅</span>;
    }
    return sortConfig.direction === 'asc'
      ? <span className="text-orange-600">▲</span>
      : <span className="text-orange-600">▼</span>;
  };

  // Format cell value
  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '—';

    if (column.render) {
      return column.render(value);
    }

    if (column.type === 'currency') {
      return `₹${Number(value).toLocaleString('en-IN')}`;
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('en-IN');
    }

    if (column.type === 'badge') {
      const badgeColors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'in_transit': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          badgeColors[String(value).toLowerCase()] || 'bg-gray-100 text-gray-800'
        }`}>
          {String(value).replace('_', ' ')}
        </span>
      );
    }

    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  className={`
                    px-4 py-3 text-left text-sm font-semibold text-gray-700
                    ${compact ? 'py-2' : ''}
                    ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {onActionClick && (
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onActionClick ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <p>No data found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    border-b border-gray-100
                    ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    ${hover && onRowClick ? 'hover:bg-orange-50 cursor-pointer transition' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`px-4 py-3 text-sm text-gray-700 ${compact ? 'py-2' : ''}`}
                    >
                      {formatCellValue(row[column.key], column)}
                    </td>
                  ))}
                  {onActionClick && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {Array.isArray(row._actions) ? (
                          row._actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                onActionClick(action.type, row);
                              }}
                              title={action.label}
                              className={`
                                px-3 py-1 rounded-lg text-sm font-semibold transition
                                ${action.color === 'green'
                                  ? 'bg-green-100 hover:bg-green-200 text-green-700'
                                  : action.color === 'red'
                                  ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }
                              `}
                            >
                              {action.icon || action.label}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onActionClick('view', row);
                            }}
                            className="text-orange-600 hover:text-orange-700 font-semibold"
                          >
                            View →
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`
                    px-4 py-2 rounded-lg border
                    ${currentPage === pageNum
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}