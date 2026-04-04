/**
 * Admin Dashboard Page
 * Main dashboard with stats, charts, and recent activity
 */

import "../styles/dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import Loader from "../components/common/Loader";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Dashboard() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    users: 0,
    partners: 0,
    bunks: 0,
    orders: { total: 0, completed: 0, active: 0 },
    revenue: 0
  });

  const [orderTrend, setOrderTrend] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topPartners, setTopPartners] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ========================
  // FETCH DASHBOARD DATA
  // ========================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('📡 Fetching dashboard data...');

      const res = await axios.get(
        `${API_BASE}/admin/dashboard`
      );

      console.log('✅ Dashboard response:', res.data);

      if (!res.data.data) {
        throw new Error("Invalid response format");
      }

      const dashboardData = res.data.data;

      // Set stats
      setStats({
        users: dashboardData.stats?.users || 0,
        partners: dashboardData.stats?.partners || 0,
        bunks: dashboardData.stats?.bunks || 0,
        orders: dashboardData.stats?.orders || { total: 0, completed: 0, active: 0 },
        revenue: dashboardData.stats?.revenue || 0
      });

      // Format order trend for recharts
      const trend = (dashboardData.recentOrders || [])
        .slice(0, 10)
        .reverse()
        .map((order, index) => ({
          date: new Date(order.createdAt).toLocaleDateString('en-IN'),
          orders: index + 1,
          revenue: order.charges?.totalAmount || 0
        }));

      setOrderTrend(trend);

      // Format recent orders
      const formattedOrders = (dashboardData.recentOrders || [])
        .slice(0, 10)
        .map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          customer: order.customer?.name || "Unknown",
          phone: order.customer?.phone || "—",
          amount: order.charges?.totalAmount || 0,
          status: order.status,
          fuelType: order.fuelDetails?.type || "—",
          quantity: order.fuelDetails?.quantity || 0,
          date: new Date(order.createdAt).toLocaleDateString('en-IN')
        }));

      setRecentOrders(formattedOrders);

      // Format top partners
      const formattedPartners = (dashboardData.recentOrders || [])
        .filter(o => o.deliveryPartner)
        .reduce((acc, order) => {
          const partner = acc.find(p => p._id === order.deliveryPartner?._id);
          if (partner) {
            partner.orders += 1;
          }
          return acc;
        }, [])
        .map((p, i) => ({
          ...p,
          name: p.name || `Partner ${i + 1}`,
          rating: (4.5 + Math.random()).toFixed(1)
        }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      setTopPartners(formattedPartners);

      console.log('✅ Dashboard data formatted');

    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loader">⏳ Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert-error">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
        <button className="refresh-btn" onClick={fetchDashboard}>
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Welcome back to PetroGo Admin</p>
        </div>
        <button className="refresh-btn" onClick={fetchDashboard}>
          🔄 Refresh
        </button>
      </div>

      {/* MAIN STATS */}
      <div className="stats-grid">

        <StatCard
          title="Total Users"
          value={stats.users}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Delivery Partners"
          value={stats.partners}
          icon="🚗"
          color="green"
        />
        <StatCard
          title="Petrol Bunks"
          value={stats.bunks}
          icon="⛽"
          color="orange"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.total}
          icon="📦"
          color="purple"
        />

      </div>

      {/* ORDER METRICS */}
      <div className="metrics-grid">

        <StatCard
          title="Completed Orders"
          value={stats.orders.completed}
          icon="✅"
          color="green"
          size="small"
        />
        <StatCard
          title="Active Orders"
          value={stats.orders.active}
          icon="🚙"
          color="blue"
          size="small"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.revenue / 1000).toFixed(1)}K`}
          icon="💰"
          color="orange"
          size="small"
        />

      </div>

      {/* CHARTS SECTION */}
      <div className="charts-container">

        {/* ORDER TREND CHART */}
        {orderTrend.length > 0 && (
          <div className="chart-box">
            <h3>📈 Order Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,24,0.2)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1a1f35', border: '1px solid #ff8c18', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  dataKey="orders"
                  stroke="#ff8c18"
                  strokeWidth={2}
                  name="Orders"
                  dot={{ fill: '#ff8c18', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* RECENT ORDERS */}
      <div className="section-box">
        <h3>📋 Recent Orders ({recentOrders.length})</h3>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <p>No recent orders</p>
          </div>
        ) : (
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-info">
                  <div className="order-header">
                    <span className="order-number">{order.orderNumber}</span>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'completed' && '✅ Completed'}
                      {order.status === 'pending' && '⏳ Pending'}
                      {order.status === 'confirmed' && '✔️ Confirmed'}
                      {order.status === 'partner_assigned' && '🚗 Assigned'}
                      {order.status === 'in_transit' && '🚙 Transit'}
                      {order.status === 'cancelled' && '❌ Cancelled'}
                    </span>
                  </div>
                  <div className="order-details">
                    <span>👤 {order.customer}</span>
                    <span>📱 {order.phone}</span>
                    <span>⛽ {order.fuelType.toUpperCase()} - {order.quantity}L</span>
                  </div>
                </div>
                <div className="order-amount">
                  <span className="amount">₹{order.amount.toLocaleString('en-IN')}</span>
                  <span className="date">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOP PARTNERS */}
      <div className="section-box">
        <h3>🏆 Top Delivery Partners</h3>

        {topPartners.length === 0 ? (
          <div className="empty-state">
            <p>No partners yet</p>
          </div>
        ) : (
          <div className="partners-list">
            {topPartners.map((partner, index) => (
              <div key={partner._id || index} className="partner-item">
                <div className="partner-rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="partner-info">
                  <span className="partner-name">{partner.name}</span>
                  <span className="partner-orders">{partner.orders} deliveries</span>
                </div>
                <div className="partner-rating">
                  ⭐ {partner.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ========================
// STAT CARD COMPONENT
// ========================
function StatCard({ title, value, icon, color = "blue", size = "large" }) {
  return (
    <div className={`stat-card stat-${color} stat-${size}`}>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}