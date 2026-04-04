import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './context/LocationContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import EmergencyRequest from './pages/EmergencyRequest';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Auth service
import { authService } from './services/authService';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = authService.isLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <LocationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-1">
                <Routes>
                  {/* Home Page */}
                  <Route path="/" element={<Home />} />

                  {/* Protected Routes */}
                  <Route
                    path="/emergency"
                    element={
                      <ProtectedRoute>
                        <EmergencyRequest />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/tracking/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </LocationProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
