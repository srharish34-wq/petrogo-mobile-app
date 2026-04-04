/**
 * Pagination Component
 * Standalone pagination controls for tables
 * Location: partner/src/components/tables/Pagination.jsx
 */

import { useMemo } from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  maxVisible = 5,
  showInfo = true
}) {
  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxVisible]);

  // Calculate display info
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Info Text */}
      {showInfo && totalItems > 0 && (
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{startItem}</span> to <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{totalItems}</span> results
        </p>
      )}

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-4 py-2 rounded-lg border font-semibold transition
              ${currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            ← Previous
          </button>

          {/* First Page Button (if needed) */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="text-gray-500">...</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                px-4 py-2 rounded-lg border font-semibold transition
                ${currentPage === page
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          ))}

          {/* Last Page Button (if needed) */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-4 py-2 rounded-lg border font-semibold transition
              ${currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            Next →
          </button>
        </div>
      )}

      {/* Jump to Page */}
      {totalPages > 10 && (
        <div className="flex items-center justify-center gap-2">
          <label className="text-sm text-gray-600">Go to page:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onChange={(e) => {
              const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
              onPageChange(page);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:border-orange-500"
          />
          <span className="text-sm text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
}