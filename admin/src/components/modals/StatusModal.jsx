/**
 * StatusModal Component
 * Modal to change status of orders or delivery partners
 * Location: admin/src/components/modals/StatusModal.jsx
 */

import { useState } from 'react';

export default function StatusModal({
  isOpen,
  title = 'Change Status',
  currentItem = null,
  currentStatus = '',
  statuses = [],
  onClose = () => {},
  onConfirm = () => {},
  loading = false,
  showReason = false
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  if (!isOpen || !currentItem) return null;

  const handleConfirm = async () => {
    if (showReason && !reason.trim()) {
      alert('Please provide a reason for this status change');
      return;
    }

    setIsChanging(true);
    try {
      await onConfirm({
        newStatus: selectedStatus,
        reason: showReason ? reason : undefined
      });
      // Reset form
      setSelectedStatus(currentStatus);
      setReason('');
    } finally {
      setIsChanging(false);
    }
  };

  // Get status config
  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status);
  };

  const statusConfig = getStatusConfig(selectedStatus);
  const currentStatusConfig = getStatusConfig(currentStatus);
  const hasChanged = selectedStatus !== currentStatus;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b-2 border-blue-200 bg-blue-50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentItem?.name || currentItem?.orderNumber || 'Item'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Status
            </label>
            <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-3">
              {currentStatusConfig?.icon && (
                <span className="text-xl">{currentStatusConfig.icon}</span>
              )}
              <div>
                <p className="font-semibold text-gray-900">{currentStatusConfig?.label || currentStatus}</p>
                <p className="text-xs text-gray-600">
                  Changed {currentItem?.lastStatusChangeAt 
                    ? new Date(currentItem.lastStatusChangeAt).toLocaleDateString('en-IN')
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Change To
            </label>
            <div className="space-y-2">
              {statuses.map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedStatus === status.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {status.icon && <span className="text-lg">{status.icon}</span>}
                      <p className="font-semibold text-gray-900">{status.label}</p>
                    </div>
                    {status.description && (
                      <p className="text-xs text-gray-600 mt-1">{status.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          {showReason && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Reason for Status Change
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you changing the status?"
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
              />
              <p className="text-xs text-gray-600 text-right">
                {reason.length}/200 characters
              </p>
            </div>
          )}

          {/* Impact Info */}
          {hasChanged && statusConfig && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Status will change to:</strong> <br />
                {statusConfig.label}
              </p>
              {statusConfig.impact && (
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Impact:</strong> {statusConfig.impact}
                </p>
              )}
            </div>
          )}

          {/* Warning */}
          {statusConfig?.warning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Warning:</strong> <br />
                {statusConfig.warning}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isChanging}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isChanging || !hasChanged || loading || (showReason && !reason.trim())}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isChanging ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                ✅ Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}