import "../styles/analytics.css";
import { useEffect, useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Alert from "../components/common/Alert";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Analytics() {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // ==========================
  // FETCH DASHBOARD DATA
  // ==========================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('📡 Fetching dashboard...');

      const res = await fetch(
        `${API_BASE}/admin/dashboard`
      );

      if (!res.ok) throw new Error("Failed to fetch dashboard");

      const dashboardData = await res.json();

      console.log('✅ Dashboard data:', dashboardData);

      // Fetch analytics for trends
      const analyticsRes = await fetch(
        `${API_BASE}/admin/analytics?period=week`
      );

      const analyticsData = await analyticsRes.json();

      console.log('✅ Analytics data:', analyticsData);

      // Fetch orders for trends
      const ordersRes = await fetch(
        `${API_BASE}/admin/orders`
      );

      const ordersData = await ordersRes.json();

      // Fetch partners
      const partnersRes = await fetch(
        `${API_BASE}/admin/partners`
      );

      const partnersData = await partnersRes.json();

      // Format order trend data (last 7 days)
      const orderTrend = generateOrderTrend(ordersData.data?.orders || []);

      // Format top partners
      const topPartners = (partnersData.data?.partners || [])
        .slice(0, 5)
        .map((p, i) => ({
          name: p.user?.name || `Partner ${i + 1}`,
          orders: p.performance?.completedDeliveries || 0,
          rating: (p.performance?.rating?.average || 0).toFixed(1)
        }));

      const combinedData = {
        stats: dashboardData.data?.stats || {},
        recentOrders: dashboardData.data?.recentOrders || [],
        orderTrend,
        topPartners,
        analyticsData: analyticsData.data || {}
      };

      setData(combinedData);

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Generate order trend from orders array
  const generateOrderTrend = (orders) => {
    const trendMap = {};
    const today = new Date();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN');
      trendMap[dateStr] = { _id: dateStr, orders: 0, revenue: 0 };
    }

    // Count orders by day
    orders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN');
      if (trendMap[dateStr]) {
        trendMap[dateStr].orders += 1;
        trendMap[dateStr].revenue += order.charges?.totalAmount || 0;
      }
    });

    return Object.values(trendMap);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader fullScreen message="Loading analytics..." />;

  if (error || !data?.stats) {
    return (
      <div className="analytics-page">
        <Alert
          type="error"
          title="Error"
          message={error || "Unable to load analytics"}
          actions={[
            { label: "Retry", onClick: fetchDashboard, variant: "primary" }
          ]}
        />
      </div>
    );
  }

  // ==========================
  // CALCULATIONS
  // ==========================
  const totalOrders = Number(data.stats?.orders?.total) || 0;
  const completedOrders = Number(data.stats?.orders?.completed) || 0;
  const totalRevenue = Number(data.stats?.revenue) || 0;

  const avgOrderValue = totalOrders > 0
    ? Math.round(totalRevenue / totalOrders)
    : 0;

  const successRate = totalOrders > 0
    ? Math.round((completedOrders / totalOrders) * 100)
    : 0;

  const totalBunks = Number(data.stats?.bunks) || 0;
  const totalPartners = Number(data.stats?.partners) || 0;
  const totalUsers = Number(data.stats?.users) || 0;

  // ==========================
  // EXPORT EXCEL
  // ==========================
  const exportToExcel = () => {

    const sheetData = [
      ["Metric", "Value"],
      ["Total Orders", totalOrders],
      ["Completed Orders", completedOrders],
      ["Total Revenue", `₹${totalRevenue.toFixed(2)}`],
      ["Avg Order Value", `₹${avgOrderValue}`],
      ["Success Rate", `${successRate}%`],
      ["Total Bunks", totalBunks],
      ["Total Partners", totalPartners],
      ["Total Users", totalUsers]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(file, `PetroGo_Analytics_${new Date().toLocaleDateString('en-IN')}.xlsx`);
  };

  // ==========================
  // DEMO FUEL DATA
  // ==========================
  const fuelData = [
    { time: "00:00", petrol: 80, diesel: 120 },
    { time: "06:00", petrol: 150, diesel: 200 },
    { time: "12:00", petrol: 280, diesel: 350 },
    { time: "18:00", petrol: 360, diesel: 410 },
    { time: "23:59", petrol: 120, diesel: 180 }
  ];

  // ==========================
  // UI
  // ==========================
  return (
    <div className="analytics-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>📊 Analytics & Insights</h1>
          <p>Detailed reports and performance metrics</p>
        </div>

        <button className="download-btn" onClick={exportToExcel}>
          📥 Generate Report
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="payment-cards">

        <div className="card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Completed</h3>
            <p>{completedOrders}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p>₹{(totalRevenue / 1000).toFixed(1)}K</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Avg Order Value</h3>
            <p>₹{avgOrderValue}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Success Rate</h3>
            <p>{successRate}%</p>
          </div>
        </div>

      </div>

      {/* STATS ROW */}
      <div className="payment-cards">

        <div className="card">
          <div className="card-icon">⛽</div>
          <div className="card-content">
            <h3>Petrol Bunks</h3>
            <p>{totalBunks}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">🚗</div>
          <div className="card-content">
            <h3>Delivery Partners</h3>
            <p>{totalPartners}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
        </div>

      </div>

      {/* ORDER TREND CHART */}
      {data.orderTrend && data.orderTrend.length > 0 && (
        <div className="chart-box">
          <h3>📈 Order Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.orderTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,24,0.2)" />
              <XAxis dataKey="_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ background: '#1a1f35', border: '1px solid #ff8c18', borderRadius: '8px' }}
              />
              <Legend />
              <Area dataKey="orders" stroke="#ff8c18" fill="rgba(255,140,24,0.1)" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FUEL DISTRIBUTION CHART */}
      <div className="chart-box">
        <h3>⛽ Fuel Distribution by Time</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fuelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,140,24,0.2)" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ background: '#1a1f35', border: '1px solid #ff8c18', borderRadius: '8px' }}
            />
            <Legend />
            <Line dataKey="petrol" stroke="#ff8c18" strokeWidth={2} name="Petrol (Liters)" />
            <Line dataKey="diesel" stroke="#3b82f6" strokeWidth={2} name="Diesel (Liters)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TOP PARTNERS */}
      {data.topPartners && data.topPartners.length > 0 && (
        <div className="chart-box">
          <h3>🏆 Top Partners Performance</h3>

          {data.topPartners.map((p, i) => (
            <div
              key={i}
              className="partner-row"
            >
              <div className="partner-rank">#{i + 1}</div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-orders">{p.orders} orders</div>
              <div className="partner-rating">⭐ {p.rating}</div>
            </div>
          ))}
        </div>
      )}

      {/* KEY INSIGHTS */}
      <div className="chart-box">
        <h3>💡 Key Insights</h3>

        <ul className="insights-list">
          <li>🏆 Peak Order Hour: 18:00 - 19:00</li>
          <li>⛽ Fuel Preference: Diesel preferred (60% vs 40%)</li>
          <li>📈 Success Rate: {successRate}% order completion</li>
          <li>✅ Total Revenue: ₹{totalRevenue.toFixed(0)}</li>
        </ul>
      </div>

    </div>
  );
}