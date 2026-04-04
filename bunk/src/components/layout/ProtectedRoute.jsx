/**
 * ProtectedRoute Component
 * Protects routes from unauthorized access
 * Location: bunk/src/components/layout/ProtectedRoute.jsx
 */

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('bunkToken');
  const bunkData = localStorage.getItem('bunkData');

  // If not authenticated, redirect to login
  if (!isAuthenticated || !bunkData) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}