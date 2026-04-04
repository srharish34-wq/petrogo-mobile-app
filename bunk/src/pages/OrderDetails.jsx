/**
 * OrderDetails Page
 * Detailed view of a single order with timeline and actions
 * Location: bunk/src/pages/OrderDetails.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import AcceptOrderModal from '../components/modals/AcceptOrderModal';
import RejectOrderModal from '../components/modals/RejectOrderModal';
import api from '../services/api';

// Map backend ORDER_STATUS values to human-readable timeline labels
const STATUS_LABELS = {
  pending:          'Order Placed',
  accepted:         'Order Accepted',
  partner_assigned: 'Partner Assigned',
  ready_for_pickup: 'Ready for Pickup',
  picked_up:        'Picked Up',
  in_transit:       'In Transit',
  delivered:        'Delivered',
  completed:        'Completed',
  cancelled:        'Cancelled',
};

// Fixed display order for the timeline
const TIMELINE_ORDER = [
  'pending',
  'accepted',
  'partner_assigned',
  'ready_for_pickup',
  'picked_up',
  'in_transit',
  'delivered',
];

/**
 * Build a display timeline from the order's backend `timeline` array.
 * Each entry in the backend looks like: { status, timestamp, notes, _id }
 */
const buildTimeline = (order) => {
  if (!order) return [];

  // Map already-recorded statuses to their timestamps
  const recorded = {};
  (order.timeline || []).forEach((t) => {
    recorded[t.status] = t.timestamp;
  });

  return TIMELINE_ORDER.map((status) => ({
    status,
    label:     STATUS_LABELS[status] || status,
    timestamp: recorded[status] || null,
    completed: Boolean(recorded[status]),
  }));
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate    = useNavigate();

  const [order,          setOrder]          = useState(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isActioning,    setIsActioning]    = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage,   setErrorMessage]   = useState('');

  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // ─── Auto-clear messages ─────────────────────────────────────────────────
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

  // ─── Load order from backend ─────────────────────────────────────────────
  // GET /api/v1/orders/:orderId
  // Returns: { status: 'success', data: { order } }
  const loadOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data.data.order);

    } catch (error) {
      console.error('Error loading order:', error);
      setErrorMessage(error.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  // ─── Accept ──────────────────────────────────────────────────────────────
  // PATCH /api/v1/orders/:orderId/status  { status: 'accepted', notes: '...' }
  const handleConfirmAccept = async (id, preparationTime) => {
    try {
      setIsActioning(true);

      const { data } = await api.patch(`/orders/${id}/status`, {
        status: 'accepted',
        notes: preparationTime
          ? `Preparation time: ${preparationTime} minutes`
          : undefined,
      });

      setOrder(data.data.order);
      setSuccessMessage('Order accepted successfully!');
      setShowAcceptModal(false);

    } catch (error) {
      console.error('Error accepting order:', error);
      setErrorMessage(error.message || 'Failed to accept order');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Reject / Cancel ─────────────────────────────────────────────────────
  // POST /api/v1/orders/:orderId/cancel  { reason, cancelledBy: 'bunk' }
  const handleConfirmReject = async (id, reason) => {
    try {
      setIsActioning(true);

      const { data } = await api.post(`/orders/${id}/cancel`, {
        reason,
        cancelledBy: 'bunk',
      });

      setOrder(data.data.order);
      setSuccessMessage('Order rejected successfully');
      setShowRejectModal(false);

    } catch (error) {
      console.error('Error rejecting order:', error);
      setErrorMessage(error.message || 'Failed to reject order');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Mark Ready for Pickup ───────────────────────────────────────────────
  // PATCH /api/v1/orders/:orderId/status  { status: 'ready_for_pickup' }
  const handleMarkReady = async () => {
    try {
      setIsActioning(true);

      const { data } = await api.patch(`/orders/${orderId}/status`, {
        status: 'ready_for_pickup',
      });

      setOrder(data.data.order);
      setSuccessMessage('Order marked ready for pickup!');

    } catch (error) {
      console.error('Error marking ready:', error);
      setErrorMessage(error.message || 'Failed to mark order ready');
    } finally {
      setIsActioning(false);
    }
  };

  // ─── Phone helpers ───────────────────────────────────────────────────────
  const handleCallCustomer = () => {
    if (order?.customer?.phone)
      window.location.href = `tel:${order.customer.phone}`;
  };

  const handleCallPartner = () => {
    if (order?.deliveryPartner?.phone)
      window.location.href = `tel:${order.deliveryPartner.phone}`;
  };

  // ─── Map link ────────────────────────────────────────────────────────────
  // Backend stores coordinates as [longitude, latitude]
  const handleOpenMap = () => {
    const coords = order?.deliveryLocation?.coordinates;
    if (!coords) return;
    const [lng, lat] = coords;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  };

  // ─── Loading / not found ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  // Derived display values
  const timeline         = buildTimeline(order);
  const partner          = order.deliveryPartner;   // populated: name, phone, partnerDetails.vehicleNumber
  const fuelCostDisplay  = order.charges.fuelCost   ?? order.charges.fuelAmount ?? '—';
  const totalDisplay     = order.charges.totalAmount ?? '—';

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        <Button variant="outline" icon="🔄" onClick={loadOrderDetails} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* Order Header Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-orange-100 mt-1">
              {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <OrderStatusBadge status={order.status} size="lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-orange-100">Total Amount</p>
            <p className="text-3xl font-bold">₹{totalDisplay}</p>
          </div>
          <div>
            <p className="text-orange-100">Payment Status</p>
            {/* Payment lives in Payment collection; show paymentStatus if populated, else '—' */}
            <PaymentStatusBadge status={order.paymentStatus || 'pending'} size="md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Fuel Details */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⛽ Fuel Details</h2>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {order.fuelDetails.type.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-lg font-bold text-gray-900">
                    {order.fuelDetails.quantity}L
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price / Liter</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{order.fuelDetails.pricePerLiter}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Cost</p>
                  <p className="text-lg font-bold text-orange-600">
                    ₹{fuelCostDisplay}
                  </p>
                </div>
              </div>
            </div>

            {/* Charges breakdown */}
            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charge</span>
                <span>₹{order.charges.deliveryCharge ?? '—'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Emergency Fee</span>
                <span>₹{order.charges.emergencyFee ?? 0}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
                <span>Total Amount</span>
                <span>₹{totalDisplay}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Customer Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-bold text-gray-900">{order.customer?.name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-bold text-gray-900">{order.customer?.phone || '—'}</p>
              </div>
              <Button
                variant="info"
                size="md"
                fullWidth
                icon="📞"
                onClick={handleCallCustomer}
                disabled={!order.customer?.phone}
              >
                Call Customer
              </Button>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Delivery Location</h2>
            <div className="space-y-3">
              <p className="text-gray-900">
                {order.deliveryLocation?.address || 'Address not provided'}
              </p>
              {order.deliveryLocation?.landmark && (
                <p className="text-sm text-blue-600">
                  🏠 {order.deliveryLocation.landmark}
                </p>
              )}
              {order.distance?.toCustomer && (
                <p className="text-sm text-gray-500">
                  📏 Distance: {order.distance.toCustomer} km
                </p>
              )}
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon="🗺️"
                onClick={handleOpenMap}
                disabled={!order.deliveryLocation?.coordinates?.length}
              >
                View on Map
              </Button>
            </div>
          </div>

          {/* Delivery Partner — only shown when assigned */}
          {partner && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🏍️ Delivery Partner</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-bold text-gray-900">{partner.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-bold text-gray-900">{partner.phone}</p>
                </div>
                {partner.partnerDetails?.vehicleNumber && (
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Number</p>
                    <p className="font-bold text-gray-900">
                      {partner.partnerDetails.vehicleNumber}
                    </p>
                  </div>
                )}
                <Button
                  variant="info"
                  size="md"
                  fullWidth
                  icon="📞"
                  onClick={handleCallPartner}
                >
                  Call Partner
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Timeline — built from backend order.timeline */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Order Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={item.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      item.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {item.completed ? '✓' : index + 1}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${
                        item.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className={`font-semibold ${
                      item.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {(order.status === 'pending' || order.status === 'accepted') && (
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Actions</h2>

              {order.status === 'pending' && (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setShowAcceptModal(true)}
                    disabled={isActioning}
                  >
                    ✅ Accept Order
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    fullWidth
                    onClick={() => setShowRejectModal(true)}
                    disabled={isActioning}
                  >
                    ❌ Reject Order
                  </Button>
                </>
              )}

              {order.status === 'accepted' && (
                <Button
                  variant="success"
                  size="lg"
                  fullWidth
                  onClick={handleMarkReady}
                  disabled={isActioning}
                >
                  {isActioning ? '⏳ Updating...' : '📦 Mark Ready for Pickup'}
                </Button>
              )}
            </div>
          )}

          {/* Cancellation info — shown if cancelled */}
          {order.status === 'cancelled' && order.cancellation && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-sm font-bold text-red-900 mb-1">❌ Cancellation Info</p>
              <p className="text-sm text-red-800">
                Cancelled by: <span className="font-semibold capitalize">
                  {order.cancellation.cancelledBy}
                </span>
              </p>
              {order.cancellation.reason && (
                <p className="text-sm text-red-800 mt-1">
                  Reason: {order.cancellation.reason}
                </p>
              )}
              {order.cancellation.cancelledAt && (
                <p className="text-xs text-red-600 mt-1">
                  {new Date(order.cancellation.cancelledAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <AcceptOrderModal
        isOpen={showAcceptModal}
        order={order}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleConfirmAccept}
        isLoading={isActioning}
      />

      <RejectOrderModal
        isOpen={showRejectModal}
        order={order}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleConfirmReject}
        isLoading={isActioning}
      />

    </div>
  );
}