/**
 * App Routes
 * All route definitions for PetroGo Partner Panel
 * Location: partner/src/routes/AppRoutes.jsx
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyPhone from '../pages/auth/VerifyPhone';

// Main Pages
import Dashboard from '../pages/Dashboard';
import AvailableOrders from '../pages/AvailableOrders';
import MyOrders from '../pages/MyOrders';
import ActiveDelivery from '../pages/ActiveDelivery';
import OrderHistory from '../pages/OrderHistory';
import Earnings from '../pages/Earnings';
import Profile from '../pages/Profile';
import Support from '../pages/Support';
import Settings from '../pages/Settings';

// Layout
import Layout from '../components/layout/Layout';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-large mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner spinner-large mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if not authenticated
  return children;
};

/**
 * App Routes Component
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ============================================
          PUBLIC ROUTES (Auth)
          ============================================ */}
      
      {/* Login */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Register */}
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* OTP Verification */}
      <Route 
        path="/verify-phone" 
        element={
          <VerifyPhone />
        } 
      />

      {/* ============================================
          PROTECTED ROUTES (Main App)
          ============================================ */}

      {/* Dashboard - Home */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Available Orders - Browse new orders */}
      <Route
        path="/available-orders"
        element={
          <ProtectedRoute>
            <Layout>
              <AvailableOrders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* My Orders - Partner's accepted orders */}
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Orders - Alias for My Orders (for bottom nav) */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <MyOrders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Active Delivery - Current ongoing delivery */}
      <Route
        path="/active-delivery"
        element={
          <ProtectedRoute>
            <Layout>
              <ActiveDelivery />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/active-delivery/:orderId"
        element={
          <ProtectedRoute>
            <Layout>
              <ActiveDelivery />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Order History - Past completed/cancelled orders */}
      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderHistory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Earnings - View earnings and statistics */}
      <Route
        path="/earnings"
        element={
          <ProtectedRoute>
            <Layout>
              <Earnings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Profile - Partner profile and settings */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Support - Help and support */}
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Layout>
              <Support />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Settings - App settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

/**
 * Not Found Page Component
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gradient-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}