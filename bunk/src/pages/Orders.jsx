/**
 * Orders Page
 * View and manage all orders with tabs (New, Accepted, Completed, etc.)
 * Location: bunk/src/pages/Orders.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import OrdersTable from '../components/tables/OrdersTable';
import AcceptOrderModal from '../components/modals/AcceptOrderModal';
import RejectOrderModal from '../components/modals/RejectOrderModal';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import api from '../services/api';

const TABS = [
  { id: 'all',              label: 'All Orders'  },
  { id: 'pending',          label: 'New'         },
  { id: 'accepted',         label: 'Accepted'    },
  { id: 'ready_for_pickup', label: 'Ready'       },
  { id: 'completed',        label: 'Completed'   },
  { id: 'cancelled',        label: 'Cancelled'   },
];

export default function Orders() {
  const [activeTab,       setActiveTab]       = useState('all');
  const [orders,          setOrders]          = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isActioning,     setIsActioning]     = useState(false);
  const [successMessage,  setSuccessMessage]  = useState('');
  const [errorMessage,    setErrorMessage]    = useState('');

  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder,   setSelectedOrder]   = useState(null);

  // ─── Auto-clear messages ───────────────────────────────────────────────────
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(''), 5000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  // ─── Load orders from backend ──────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // GET /api/v1/orders  (optionally ?status=pending etc.)
      const { data } = await api.get('/orders');

      // Backend returns: { status: 'success', data: { orders: [...], count: N } }
      setOrders(data.data.orders || []);

    } catch (error) {
      console.error('Error loading orders:', error);
      setErrorMessage(error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ─── Filtered orders for active tab ───────────────────────────────────────
  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((o) => o.status === activeTab);

  // ─── Tab counts ───────────────────────────────────────────────────────────
  const tabsWithCounts = TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === 'all'
        ? orders.length
        : orders.filter((o) => o.status === tab.id).length,
  }));

  // ─── Accept ───────────────────────────────────────────────────────────────
  const handleAccept = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    setSelectedOrder(order);
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = async (orderId, preparationTime) => {
    try {
      setIsActioning(true);

      // PATCH /api/v1/orders/:orderId/status  → { status: 'accepted' }
      await api.patch(`/orders/${orderId}/status`, {
        status: 'accepted',
        notes: preparationTime
          ? `Preparation time: ${preparationTime} minutes`
          : undefined,
      });

      // Optimistic UI update
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'accepted' } : o
        )
      );

      setSuccessMessage('Order accepted successfully!');
      setShowAcceptModal(false);
      setSelectedOrder(null);

    } catch (error) {
      console.error('Error accepting order:', error);
      setErrorMessage(error.message || 'Failed to accept order');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Reject / Cancel ──────────────────────────────────────────────────────
  const handleReject = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (orderId, reason) => {
    try {
      setIsActioning(true);

      // POST /api/v1/orders/:orderId/cancel
      await api.post(`/orders/${orderId}/cancel`, {
        reason,
        cancelledBy: 'bunk',
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );

      setSuccessMessage('Order rejected successfully');
      setShowRejectModal(false);
      setSelectedOrder(null);

    } catch (error) {
      console.error('Error rejecting order:', error);
      setErrorMessage(error.message || 'Failed to reject order');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Mark Ready for Pickup ────────────────────────────────────────────────
  const handleMarkReady = async (orderId) => {
    try {
      setIsActioning(true);

      // PATCH /api/v1/orders/:orderId/status  → { status: 'ready_for_pickup' }
      await api.patch(`/orders/${orderId}/status`, {
        status: 'ready_for_pickup',
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'ready_for_pickup' } : o
        )
      );

      setSuccessMessage('Order marked ready for pickup!');

    } catch (error) {
      console.error('Error marking ready:', error);
      setErrorMessage(error.message || 'Failed to mark order ready');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading orders..." />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage all your fuel delivery orders</p>
        </div>
        <Button
          variant="primary"
          icon="🔄"
          onClick={loadOrders}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex overflow-x-auto border-b">
          {tabsWithCounts.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-4 font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600 border-b-4 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onAccept={handleAccept}
        onReject={handleReject}
        onMarkReady={handleMarkReady}
        showActions={true}
        isActioning={isActioning}
      />

      {/* Modals */}
      <AcceptOrderModal
        isOpen={showAcceptModal}
        order={selectedOrder}
        onClose={() => {
          setShowAcceptModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmAccept}
        isLoading={isActioning}
      />

      <RejectOrderModal
        isOpen={showRejectModal}
        order={selectedOrder}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleConfirmReject}
        isLoading={isActioning}
      />

    </div>
  );
}