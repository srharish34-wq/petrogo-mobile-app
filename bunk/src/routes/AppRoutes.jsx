/**
 * App Routes
 * All route definitions for Bunk Panel
 * Location: bunk/src/routes/AppRoutes.jsx
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { BunkProvider } from '../context/BunkContext';
import { OrderProvider } from '../context/OrderContext';

// Layout
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Main Pages
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import FuelStock from '../pages/FuelStock';
import Earnings from '../pages/Earnings';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
      >
        Go to Dashboard
      </a>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BunkProvider>
          <OrderProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect root to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
                <Route path="dashboard" element={<Dashboard />} />

                {/* Orders */}
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:orderId" element={<OrderDetails />} />

                {/* Fuel Stock */}
                <Route path="stock" element={<FuelStock />} />

                {/* Earnings */}
                <Route path="earnings" element={<Earnings />} />

                {/* Profile */}
                <Route path="profile" element={<Profile />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OrderProvider>
        </BunkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;