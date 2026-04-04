/**
 * App Component with Error Boundary
 * Main application component with error handling
 * Location: partner/src/App.jsx
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PartnerProvider } from './context/PartnerContext';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './context/LocationContext';
import AppRoutes from './routes/AppRoutes';
import { Component } from 'react';

// Import styles
import './styles/index.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <button
              onClick={() => {
                // Clear everything and reload
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
            >
              Clear Data & Restart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Auth Provider - Top level authentication */}
        <AuthProvider>
          
          {/* Partner Provider - Partner profile management */}
          <PartnerProvider>
            
            {/* Order Provider - Orders and polling */}
            <OrderProvider>
              
              {/* Location Provider - GPS tracking */}
              <LocationProvider>
                
                {/* App Routes */}
                <AppRoutes />
                
              </LocationProvider>
              
            </OrderProvider>
            
          </PartnerProvider>
          
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}