/**
 * Earnings Page
 * Revenue tracking, breakdown, and export functionality
 * Location: bunk/src/pages/Earnings.jsx
 *
 * Data source: GET /api/v1/payments/admin/all
 * Each payment has:
 *   payment.amount.total, payment.amount.paid
 *   payment.status  ('pending' | 'completed' | ...)
 *   payment.method  ('cash' | 'online' | 'upi' | 'card')
 *   payment.createdAt, payment.paidAt
 *   payment.order   → { orderNumber, charges, status, createdAt }
 *   payment.customer→ { name, phone }
 */

import { useState, useEffect, useCallback } from 'react';
import EarningsTable from '../components/tables/EarningsTable';
import { EarningsCard, RevenueSummary } from '../components/cards/RevenueCard';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import api from '../services/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate()     === now.getDate()     &&
    d.getMonth()    === now.getMonth()    &&
    d.getFullYear() === now.getFullYear()
  );
};

const isThisMonth = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

/**
 * Group payments by calendar date → array of daily row objects
 * sorted newest-first, matching the shape EarningsTable expects.
 *
 * FIX: use order.charges.totalAmount as the source of truth for revenue.
 *      payment.amount.paid is 0 until manually marked completed — not reliable.
 *      order.charges.fuelCost gives us fuel revenue.
 *      order.fuelDetails.type (populated via order) splits petrol vs diesel.
 */
const buildDailyRows = (payments) => {
  const map = {};

  payments.forEach((p) => {
    const dateKey = new Date(p.createdAt).toISOString().split('T')[0];

    if (!map[dateKey]) {
      map[dateKey] = {
        date:            dateKey,
        ordersCount:     0,
        petrolSales:     0,
        petrolQuantity:  0,
        dieselSales:     0,
        dieselQuantity:  0,
        deliveryCharges: 0,
        emergencyFees:   0,
        fuelRevenue:     0,
        total:           0,
      };
    }

    const row     = map[dateKey];
    const order   = p.order;
    const charges = order?.charges  ?? {};
    const fuel    = order?.fuelDetails ?? {};   // populated if backend sends it

    row.ordersCount += 1;

    // ✅ Use order.charges as source of truth (always populated via order ref)
    const fuelCost       = charges.fuelCost      ?? 0;
    const deliveryCharge = charges.deliveryCharge ?? 0;
    const emergencyFee   = charges.emergencyFee   ?? 0;
    // totalAmount = fuelCost + deliveryCharge + emergencyFee
    const totalAmount    = charges.totalAmount    ?? p.amount?.total ?? 0;

    row.deliveryCharges += deliveryCharge;
    row.emergencyFees   += emergencyFee;
    row.fuelRevenue     += fuelCost;
    row.total           += totalAmount;

    // ✅ Split petrol vs diesel if fuelDetails is available on the order
    if (fuel.type === 'petrol') {
      row.petrolSales    += fuelCost;
      row.petrolQuantity += fuel.quantity ?? 0;
    } else if (fuel.type === 'diesel') {
      row.dieselSales    += fuelCost;
      row.dieselQuantity += fuel.quantity ?? 0;
    }
  });

  return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Compute summary stats from raw payments + daily rows.
 * FIX: use order.charges.totalAmount for total revenue (not amount.paid).
 *      Separate "pending settlement" = orders not yet marked paid.
 */
const computeSummary = (payments, dailyRows) => {
  // ✅ Total revenue = sum of all order charges (regardless of payment.status)
  const total = payments.reduce((s, p) => {
    return s + (p.order?.charges?.totalAmount ?? p.amount?.total ?? 0);
  }, 0);

  // Paid = payments marked completed
  const paidRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((s, p) => s + (p.amount?.paid ?? p.order?.charges?.totalAmount ?? 0), 0);

  // Pending settlement = total - paid
  const pendingSettlement = total - paidRevenue;

  const todayTotal     = dailyRows.filter((r) => isToday(r.date))    .reduce((s, r) => s + r.total, 0);
  const thisMonthTotal = dailyRows.filter((r) => isThisMonth(r.date)).reduce((s, r) => s + r.total, 0);
  const totalDelivery  = dailyRows.reduce((s, r) => s + r.deliveryCharges, 0);
  const totalPetrol    = dailyRows.reduce((s, r) => s + r.petrolSales, 0);
  const totalDiesel    = dailyRows.reduce((s, r) => s + r.dieselSales, 0);

  const completedOrdersCount = payments.filter(
    (p) => p.order?.status === 'completed'
  ).length;

  return {
    total,                               // ✅ all revenue (the big number)
    thisMonth:           thisMonthTotal,
    today:               todayTotal,
    availableToWithdraw: paidRevenue,    // only truly paid
    pending:             pendingSettlement,
    completedOrders:     completedOrdersCount,
    petrolSales:         totalPetrol,
    dieselSales:         totalDiesel,
    deliveryCharges:     totalDelivery,
  };
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Earnings() {
  const [payments,       setPayments]       = useState([]);
  const [dailyRows,      setDailyRows]      = useState([]);
  const [summary,        setSummary]        = useState(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage,   setErrorMessage]   = useState('');

  // ─── Auto-clear alerts ────────────────────────────────────────────────────
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

  // ─── Fetch from backend ───────────────────────────────────────────────────
  // GET /api/v1/payments/admin/all
  // Returns: { status: 'success', data: { payments: [...], count: N } }
  const loadEarnings = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const { data } = await api.get('/payments/admin/all');
      const raw = data.data.payments ?? [];

      const rows = buildDailyRows(raw);
      const stats = computeSummary(raw, rows);

      setPayments(raw);
      setDailyRows(rows);
      setSummary(stats);

    } catch (error) {
      console.error('Error loading earnings:', error);
      setErrorMessage(error.message || 'Failed to load earnings data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  // ─── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = (rows = dailyRows) => {
    try {
      const headers = [
        'Date',
        'Orders',
        'Delivery Charges',
        'Emergency Fees',
        'Total Revenue',
        'Completed Revenue',
      ];

      const csvRows = rows.map((r) => [
        new Date(r.date).toLocaleDateString('en-IN'),
        r.ordersCount,
        r.deliveryCharges,
        r.emergencyFees,
        r.total,
        r.completedOnly,
      ]);

      const csv = [headers, ...csvRows].map((r) => r.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `earnings_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setSuccessMessage('Earnings report exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      setErrorMessage('Failed to export report');
    }
  };

  const handleWithdraw = () => {
    setSuccessMessage('Withdrawal request submitted! Amount will be credited in 2–3 business days.');
  };

  // ─── Derived display values ───────────────────────────────────────────────
  const revenueData = summary
    ? {
        today:           summary.today,
        thisMonth:       summary.thisMonth,
        total:           summary.total,
        petrolSales:     summary.petrolSales,
        dieselSales:     summary.dieselSales,
        deliveryCharges: summary.deliveryCharges,
      }
    : null;

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading earnings..." />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Revenue</h1>
          <p className="text-gray-600 mt-1">Track your earnings and financial performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon="🔄" onClick={loadEarnings}>
            Refresh
          </Button>
          <Button
            variant="success"
            icon="📊"
            onClick={() => handleExportCSV(dailyRows)}
            disabled={dailyRows.length === 0}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* No data state */}
      {dailyRows.length === 0 && !isLoading && (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-5xl mb-4">💰</p>
          <p className="text-xl font-bold text-gray-700">No earnings data yet</p>
          <p className="text-gray-500 mt-2">Earnings will appear here once orders are completed.</p>
        </div>
      )}

      {summary && dailyRows.length > 0 && (
        <>
          {/* Total Earnings Card */}
          <EarningsCard
            earnings={summary}
            onWithdraw={handleWithdraw}
          />

          {/* Revenue Overview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
            <RevenueSummary revenueData={revenueData} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl">
                  📦
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.completedOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl">
                  ⏳
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Math.round(summary.pending).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl">
                  🚚
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Charges</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Math.round(summary.deliveryCharges).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl">
                  📅
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Math.round(summary.thisMonth).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Breakdown Table */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Earnings Breakdown</h2>
            <EarningsTable
              earnings={dailyRows}
              onExport={handleExportCSV}
            />
          </div>

          {/* Payment method breakdown */}
          <PaymentMethodBreakdown payments={payments} />
        </>
      )}

      {/* Payment Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3">💳 Payment Information</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• Earnings are calculated from completed payments</p>
          <p>• Settlements are processed every week on Monday</p>
          <p>• Withdrawal requests take 2–3 business days</p>
          <p>• Check your bank details in Profile settings</p>
        </div>
      </div>

    </div>
  );
}

// ─── Payment Method Breakdown (sub-component) ─────────────────────────────────
function PaymentMethodBreakdown({ payments }) {
  const methods = ['cash', 'online', 'upi', 'card'];

  const breakdown = methods.map((method) => {
    const subset   = payments.filter((p) => p.method === method);
    const revenue  = subset
      .filter((p) => p.status === 'completed')
      .reduce((s, p) => s + (p.amount?.paid ?? 0), 0);
    return { method, count: subset.length, revenue };
  }).filter((m) => m.count > 0);

  if (breakdown.length === 0) return null;

  const icons = { cash: '💵', online: '🌐', upi: '📱', card: '💳' };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Methods</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {breakdown.map(({ method, count, revenue }) => (
          <div key={method} className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl mb-2">{icons[method]}</p>
            <p className="font-bold text-gray-900 capitalize">{method}</p>
            <p className="text-sm text-gray-500">{count} orders</p>
            <p className="text-lg font-bold text-orange-600 mt-1">
              ₹{Math.round(revenue).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}