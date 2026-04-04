/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a delivery partner
  if (user.role !== 'delivery_partner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">This panel is only for delivery partners.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;