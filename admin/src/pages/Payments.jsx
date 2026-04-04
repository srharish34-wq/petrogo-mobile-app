import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import '../styles/payments.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.orderNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.transactionId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, payments]);

  // FETCH PAYMENTS
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('📡 Fetching payments...');

      const res = await fetch(
        `${API_BASE}/payments/admin/all`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.status !== 'success' || !data.data?.payments) {
        throw new Error("Invalid response format");
      }

      const formatted = data.data.payments.map(p => ({
        _id: p._id,
        orderNumber: p.order?.orderNumber || "N/A",
        customerName: p.customer?.name || "N/A",
        customerPhone: p.customer?.phone || "—",
        amount: p.amount?.total || 0,
        method: p.method || "—",
        status: p.status || "pending",
        transactionId: p.transactionId || "—",
        date: new Date(p.createdAt).toLocaleDateString('en-IN'),
        time: new Date(p.createdAt).toLocaleTimeString('en-IN')
      }));

      setPayments(formatted);
      setFilteredPayments(formatted);

      console.log("✅ Payments loaded:", formatted.length);

    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // CALCULATE STATS
  const calculateStats = () => ({
    totalTransactions: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    cashPayments: payments.filter(p => p.method === 'cash').length,
    onlinePayments: payments.filter(p => p.method !== 'cash' && p.method !== '—').length
  });

  // CALCULATE CHART DATA
  const calculateChartData = () => {
    const dailyRevenue = {};

    payments.forEach(p => {
      if (p.status === 'completed') {
        const date = p.date;
        dailyRevenue[date] = (dailyRevenue[date] || 0) + p.amount;
      }
    });

    return Object.entries(dailyRevenue)
      .map(([day, amount]) => ({ day, amount: Math.round(amount) }))
      .slice(-7);
  };

  if (loading) {
    return (
      <div className="payments-page">
        <div className="loader">⏳ Loading payments...</div>
      </div>
    );
  }

  const stats = calculateStats();
  const chartData = calculateChartData();
  const methodData = [
    { name: "Cash", value: stats.cashPayments, color: "#10b981" },
    { name: "Online", value: stats.onlinePayments, color: "#3b82f6" }
  ];

  const displayPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="payments-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>💳 Payments Management</h1>
          <p>Track and manage all transactions</p>
        </div>

        <button
          className="download-btn"
          onClick={() => {
            let csv = 'Order#,Customer,Phone,Amount,Method,Status,Transaction ID,Date\n';
            payments.forEach(p => {
              csv += `${p.orderNumber},"${p.customerName}",${p.customerPhone},${p.amount},${p.method},${p.status},${p.transactionId},${p.date}\n`;
            });

            const link = document.createElement('a');
            link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            link.download = `payments-report-${new Date().toLocaleDateString('en-IN')}.csv`;
            link.click();
          }}
        >
          📥 Download Report
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert-error">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search order, customer, transaction..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* STAT CARDS */}
      <div className="payment-cards">
        <div className="card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Amount</h3>
            <p>₹{(stats.totalAmount / 1000).toFixed(1)}K</p>
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
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <h3>Failed</h3>
            <p>{stats.failed}</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      {chartData.length > 0 && (
        <div className="charts-container">
          <div className="chart-box" style={{ gridColumn: 'span 2' }}>
            <h3>📈 Daily Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,24,0.2)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1a1f35', border: '1px solid #ff8c18', borderRadius: '8px' }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Bar dataKey="amount" fill="#ff8c18" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>💳 Payment Methods</h3>
            {(stats.cashPayments > 0 || stats.onlinePayments > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={methodData}
                    dataKey="value"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {methodData.map((m, i) => (
                      <Cell key={i} fill={m.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-box-empty">No data available</div>
            )}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table-container">
        <h3>📋 All Payments ({filteredPayments.length})</h3>

        {displayPayments.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {displayPayments.map(p => (
                  <tr key={p._id}>
                    <td className="bold">{p.orderNumber}</td>
                    <td>{p.customerName}</td>
                    <td>{p.customerPhone}</td>
                    <td>{p.transactionId}</td>
                    <td>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td>{p.method.toUpperCase()}</td>
                    <td>
                      <span className={`status ${p.status}`}>
                        {p.status === 'completed' && '✅ Completed'}
                        {p.status === 'pending' && '⏳ Pending'}
                        {p.status === 'failed' && '❌ Failed'}
                      </span>
                    </td>
                    <td>{p.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredPayments.length)} of {filteredPayments.length}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="pagination"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ← Previous
                </button>
                <button
                  className="pagination"
                  disabled={currentPage * rowsPerPage >= filteredPayments.length}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>🚫</p>
            <p>No payments found</p>
          </div>
        )}
      </div>

    </div>
  );
}