/**
 * DeleteModal Component
 * Confirmation modal for deleting items
 * Location: admin/src/components/modals/DeleteModal.jsx
 */

import { useState } from 'react';

export default function DeleteModal({
  isOpen,
  title = 'Delete Item?',
  itemName = '',
  itemDescription = '',
  warning = null,
  onClose = () => {},
  onConfirm = () => {},
  loading = false,
  isDangerous = false,
  requiresConfirmation = false
}) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requiresConfirmation && confirmText !== itemName) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = !requiresConfirmation || confirmText === itemName;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className={`px-6 py-6 border-b-2 ${
          isDangerous ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`text-4xl flex-shrink-0 ${
              isDangerous ? 'text-red-600' : 'text-orange-600'
            }`}>
              {isDangerous ? '⚠️' : '🗑️'}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${
                isDangerous ? 'text-red-900' : 'text-gray-900'
              }`}>
                {title}
              </h2>
              {itemName && (
                <p className={`text-sm font-semibold mt-2 ${
                  isDangerous ? 'text-red-800' : 'text-gray-700'
                }`}>
                  {itemName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Item Description */}
          {itemDescription && (
            <p className="text-gray-700">
              {itemDescription}
            </p>
          )}

          {/* Warning Box */}
          {warning && (
            <div className={`rounded-lg p-4 border-l-4 ${
              isDangerous
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-yellow-50 border-yellow-500 text-yellow-800'
            }`}>
              <p className="text-sm font-semibold">
                <strong>⚠️ Warning:</strong>
              </p>
              <p className="text-sm mt-1">{warning}</p>
            </div>
          )}

          {/* Confirmation Text Input */}
          {requiresConfirmation && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Type "<strong>{itemName}</strong>" to confirm deletion:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={itemName}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition font-mono ${
                  confirmText === itemName
                    ? 'border-green-500 bg-green-50 focus:border-green-600'
                    : 'border-gray-300 focus:border-orange-500'
                }`}
                disabled={isDeleting}
              />
              <p className="text-xs text-gray-600">
                {confirmText === itemName ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <span>✅</span> Text matches. Deletion enabled.
                  </span>
                ) : (
                  <span className="text-orange-600 flex items-center gap-1">
                    <span>⚠️</span> Text must match exactly to delete.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Impact Description */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900">This action will:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>✓ Permanently remove this item from the database</li>
              <li>✓ Cannot be undone</li>
              <li>✓ All associated data will be deleted</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || !canDelete || loading}
            className={`flex-1 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-600'
                : 'bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-600'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                🗑️ Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}