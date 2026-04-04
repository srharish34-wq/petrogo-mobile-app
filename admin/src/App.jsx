/**
 * App Component
 * Main application component with routing and global providers
 * Location: admin/src/App.jsx
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

// Auth Pages
import LoginPage from './pages/auth/Login';
import LogoutPage from './pages/auth/Logout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DeliveryPartners from './pages/DeliveryPartners';
import PetrolBunks from './pages/PetrolBunks';

// Layout
import Layout from './components/layout/Layout';

// Loader
import Loader from './components/common/Loader';

/**
 * Protected Route Component
 * Restricts access to authenticated users only
 */
const ProtectedRoute = ({ children, isLoggedIn, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Public Route Component
 * Redirects authenticated users away from login
 */
const PublicRoute = ({ children, isLoggedIn, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * App Routes Component (Separated for cleaner code)
 */
function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Check if user is authenticated from localStorage
  useEffect(() => {
    const authToken = localStorage.getItem('adminToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route
        path="/login"
        element={
          <PublicRoute isLoggedIn={isLoggedIn} loading={loading}>
            <LoginPage setIsLoggedIn={setIsLoggedIn} />
          </PublicRoute>
        }
      />

      {/* ==================== PROTECTED ROUTES ==================== */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Users Management */}
      <Route
        path="/users"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Orders Management */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Payments Management */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Payments />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Delivery Partners Management */}
      <Route
        path="/delivery-partners"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <DeliveryPartners />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Petrol Bunks Management */}
      <Route
        path="/petrol-bunks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <PetrolBunks />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Analytics & Reporting */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Logout */}
      <Route
        path="/logout"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn} loading={loading}>
            <LogoutPage setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ==================== REDIRECT ROUTES ==================== */}

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 - Not Found */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center" style={{ height: '100vh' }}>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">404</h1>
              <p className="text-2xl mb-8">Page Not Found</p>
              <a 
                href="/dashboard" 
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

/**
 * Main App Component with Providers
 */
function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;