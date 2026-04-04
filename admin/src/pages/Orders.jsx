import "../styles/orders.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // 👉 Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  // SEARCH & FILTER
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    // Search by order number or customer
    if (searchTerm) {
      filtered = filtered.filter(o =>
        (o.orderNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (o.customer?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, orders]);

  // ==========================
  // FETCH ORDERS + CALCULATE STATS
  // ==========================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('📡 Fetching orders...');

      const res = await axios.get(
        `${API_BASE}/admin/orders`
      );

      console.log('✅ Orders response:', res.data);

      if (!res.data.data?.orders) {
        throw new Error("Invalid response format");
      }

      const ordersData = res.data.data.orders;
      setOrders(ordersData);

      // Calculate stats
      const total = ordersData.length;
      const pending = ordersData.filter(o => o.status === "pending").length;
      const completed = ordersData.filter(o => o.status === "completed").length;
      const cancelled = ordersData.filter(o => o.status === "cancelled").length;
      const revenue = ordersData.reduce(
        (sum, o) => sum + (o.charges?.totalAmount || 0),
        0
      );

      setStats({
        total,
        pending,
        completed,
        cancelled,
        revenue: Math.round(revenue * 100) / 100
      });

      console.log('✅ Stats calculated:', { total, pending, completed, cancelled, revenue });

    } catch (err) {
      console.error('❌ Fetch orders error:', err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE ORDER STATUS
  // ==========================
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE}/orders/${orderId}/status`,
        { status: newStatus }
      );

      console.log('✅ Order status updated');
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('❌ Update status error:', err);
      alert('Failed to update order status');
    }
  };

  // ==========================
  // CANCEL ORDER
  // ==========================
  const cancelOrderHandler = async (orderId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await axios.post(
        `${API_BASE}/orders/${orderId}/cancel`,
        { reason, cancelledBy: 'admin' }
      );

      console.log('✅ Order cancelled');
      fetchOrders();
      alert('Order cancelled successfully!');
    } catch (err) {
      console.error('❌ Cancel order error:', err);
      alert('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loader">⏳ Loading orders...</div>
      </div>
    );
  }

  const displayOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="orders-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>📦 Orders Management</h1>
          <p>Track and manage all fuel delivery orders</p>
        </div>

        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert-error">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="payment-cards">
        <div className="card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <h3>Cancelled</h3>
            <p>{stats.cancelled}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p>₹{(stats.revenue / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search order number or customer..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">⏳ Pending</option>
          <option value="confirmed">✔️ Confirmed</option>
          <option value="partner_assigned">🚗 Partner Assigned</option>
          <option value="picked_up">📦 Picked Up</option>
          <option value="in_transit">🚙 In Transit</option>
          <option value="completed">✅ Completed</option>
          <option value="cancelled">❌ Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <h3>📋 Orders ({filteredOrders.length})</h3>

        {displayOrders.length === 0 ? (
          <div className="empty-state">
            <p>🚫 No orders found</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Fuel Type</th>
                    <th>Qty (L)</th>
                    <th>Fuel Cost</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayOrders.map(o => (
                    <tr key={o._id}>
                      <td className="bold">{o.orderNumber}</td>
                      <td>{o.customer?.name || "—"}</td>
                      <td>{o.customer?.phone || "—"}</td>
                      <td>{o.fuelDetails?.type?.toUpperCase() || "—"}</td>
                      <td>{o.fuelDetails?.quantity || "—"}</td>
                      <td>₹{o.charges?.fuelCost?.toFixed(2) || "—"}</td>
                      <td>₹{o.charges?.deliveryCharge?.toFixed(2) || "—"}</td>
                      <td className="bold">₹{o.charges?.totalAmount?.toFixed(2) || "—"}</td>
                      <td>
                        <span className={`status ${o.status}`}>
                          {o.status === "pending" && "⏳ Pending"}
                          {o.status === "confirmed" && "✔️ Confirmed"}
                          {o.status === "partner_assigned" && "🚗 Assigned"}
                          {o.status === "picked_up" && "📦 Picked"}
                          {o.status === "in_transit" && "🚙 Transit"}
                          {o.status === "completed" && "✅ Completed"}
                          {o.status === "cancelled" && "❌ Cancelled"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {o.status !== "completed" && o.status !== "cancelled" && (
                            <>
                              {o.status === "pending" && (
                                <button
                                  className="btn-confirm"
                                  onClick={() => updateOrderStatus(o._id, "confirmed")}
                                  title="Confirm order"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                className="btn-cancel"
                                onClick={() => cancelOrderHandler(o._id)}
                                title="Cancel order"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length}
              </div>
              <div className="pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <button
                  disabled={currentPage * rowsPerPage >= filteredOrders.length}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}