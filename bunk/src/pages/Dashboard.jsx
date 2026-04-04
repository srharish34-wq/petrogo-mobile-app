/**
 * Dashboard Page
 * Main overview page with stats, quick actions, and recent orders
 * Location: bunk/src/pages/Dashboard.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickStats } from '../components/cards/StatsCard';
import { FuelStockOverview } from '../components/cards/FuelStockCard';
import { RevenueSummary } from '../components/cards/RevenueCard';
import OrderCard from '../components/cards/OrderCard';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { NoOrdersEmpty } from '../components/common/EmptyState';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [bunk, setBunk] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedToday: 0,
    todayRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [revenueData, setRevenueData] = useState({
    today: 0,
    thisMonth: 0,
    total: 0,
    petrolSales: 0,
    dieselSales: 0,
    deliveryCharges: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      // Get bunk data from localStorage
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      const bunkId = bunkData._id;
      setBunk(bunkData);

      // Check if bunkId is valid (not demo/test IDs)
      if (!bunkId || bunkId === 'demo123' || bunkId === 'bunk123') {
        console.warn('⚠️ No valid bunk ID, using dummy data');
        loadDemoData(bunkData);
        return;
      }

      // Fetch real data from backend
      const token = localStorage.getItem('bunkToken');

      try {
        // 1. Fetch orders from backend
        const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/bunks/${bunkId}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // 2. Fetch stats from backend
        const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/bunks/${bunkId}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        let orders = [];
        let statsData = null;

        // Parse orders if successful
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          orders = ordersData.data?.orders || ordersData.orders || [];
          console.log('✅ Real orders loaded:', orders.length);
          
          // Set recent orders (last 5)
          setRecentOrders(orders.slice(0, 5));
        } else {
          console.log('⚠️ Orders API failed, using dummy orders');
          loadDemoOrders();
        }

        // Parse stats if successful
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          statsData = stats.data;
          console.log('✅ Real stats loaded');

          // Set stats from backend
          setStats({
            totalOrders: statsData?.orders?.total || 0,
            pendingOrders: statsData?.orders?.pending || 0,
            completedToday: statsData?.orders?.completed || 0,
            todayRevenue: statsData?.revenue?.total || 0
          });

          // Set revenue data from backend
          setRevenueData({
            today: statsData?.revenue?.total || 0,
            thisMonth: statsData?.revenue?.total || 0,
            total: statsData?.revenue?.total || 0,
            petrolSales: 0, // Dummy - not in backend
            dieselSales: 0,  // Dummy - not in backend
            deliveryCharges: 0 // Dummy - not in backend
          });
        } else {
          console.log('⚠️ Stats API failed, using dummy stats');
          loadDemoStats();
        }

      } catch (apiError) {
        console.error('❌ Backend API error:', apiError);
        loadDemoData(bunkData);
      }

      // Always load stock from localStorage (dummy data)
      loadStockData(bunkData);

    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      loadDemoData(bunkData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Load all dummy data
  const loadDemoData = (bunkData) => {
    loadDemoStats();
    loadDemoOrders();
    loadDemoRevenue();
    loadStockData(bunkData);
  };

  const loadDemoStats = () => {
    setStats({
      totalOrders: 156,
      pendingOrders: 8,
      completedToday: 12,
      todayRevenue: 45000
    });
  };

  const loadDemoOrders = () => {
    setRecentOrders([
      {
        _id: '1',
        orderNumber: 'ORD001',
        createdAt: new Date(),
        status: 'pending',
        customer: { name: 'Rajesh Kumar', phone: '9876543210' },
        fuelDetails: { type: 'petrol', quantity: 10, pricePerLiter: 102.50 },
        charges: { totalAmount: 1125, deliveryCharge: 100, fuelAmount: 1025 },
        deliveryLocation: { address: '123 MG Road, Chennai', landmark: 'Near City Mall' },
        paymentStatus: 'pending'
      },
      {
        _id: '2',
        orderNumber: 'ORD002',
        createdAt: new Date(Date.now() - 1800000),
        status: 'accepted',
        customer: { name: 'Priya Sharma', phone: '9123456789' },
        fuelDetails: { type: 'diesel', quantity: 15, pricePerLiter: 94.20 },
        charges: { totalAmount: 1513, deliveryCharge: 100, fuelAmount: 1413 },
        deliveryLocation: { address: '456 Anna Nagar, Chennai' },
        paymentStatus: 'completed'
      }
    ]);
  };

  const loadDemoRevenue = () => {
    setRevenueData({
      today: 45000,
      thisMonth: 580000,
      total: 2500000,
      petrolSales: 320000,
      dieselSales: 180000,
      deliveryCharges: 80000
    });
  };

  const loadStockData = (bunkData) => {
    setStockData([
      {
        type: 'Petrol',
        currentStock: bunkData.fuelAvailability?.petrol?.stock || 5000,
        capacity: 10000,
        pricePerLiter: bunkData.fuelAvailability?.petrol?.price || 102.50,
        lowStockThreshold: 2000
      },
      {
        type: 'Diesel',
        currentStock: bunkData.fuelAvailability?.diesel?.stock || 7000,
        capacity: 15000,
        pricePerLiter: bunkData.fuelAvailability?.diesel?.price || 94.20,
        lowStockThreshold: 3000
      }
    ]);
  };

  const handleAcceptOrder = (orderId) => {
    console.log('Accept order:', orderId);
    // Navigate to order details or show accept modal
    navigate(`/orders/${orderId}`);
  };

  const handleRejectOrder = (orderId) => {
    console.log('Reject order:', orderId);
    // Show reject modal
  };

  const handleMarkReady = (orderId) => {
    console.log('Mark ready:', orderId);
    // Mark order ready for pickup
  };

  const handleUpdateStock = (fuelType) => {
    navigate('/stock');
  };

  const handleUpdatePrice = (fuelType) => {
    navigate('/stock');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {bunk?.ownerName || 'Owner'}! 👋
        </h1>
        <p className="text-orange-100">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="📦"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
          <Button
            variant="info"
            size="lg"
            fullWidth
            icon="⛽"
            onClick={() => navigate('/stock')}
          >
            Manage Stock
          </Button>
          <Button
            variant="success"
            size="lg"
            fullWidth
            icon="💰"
            onClick={() => navigate('/earnings')}
          >
            Earnings
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            icon="👤"
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
        </div>
      </div>

      {/* Fuel Stock Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Fuel Stock</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/stock')}
          >
            Manage Stock →
          </Button>
        </div>
        <FuelStockOverview
          stockData={stockData}
          onUpdateStock={handleUpdateStock}
          onUpdatePrice={handleUpdatePrice}
        />
      </div>

      {/* Revenue Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/earnings')}
          >
            View Details →
          </Button>
        </div>
        <RevenueSummary revenueData={revenueData} />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
          >
            View All →
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <NoOrdersEmpty onAction={loadDashboard} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onAccept={handleAcceptOrder}
                onReject={handleRejectOrder}
                onMarkReady={handleMarkReady}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Accept orders quickly to maintain high ratings</li>
          <li>• Keep fuel stock updated to avoid order cancellations</li>
          <li>• Monitor low stock alerts and restock in time</li>
          <li>• Check revenue reports regularly to track performance</li>
        </ul>
      </div>

    </div>
  );
}