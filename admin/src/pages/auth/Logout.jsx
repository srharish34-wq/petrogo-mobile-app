/**
 * Admin Logout Page
 * Logout confirmation and session cleanup
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/logout.css";

export default function Logout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        setAdminInfo(JSON.parse(adminData));
      } catch (err) {
        console.warn('Could not parse admin data');
      }
    }
  }, []);

  // Handle logout confirmation
  const handleConfirmLogout = async () => {
    setIsLoading(true);

    try {
      // Call logout API endpoint (optional)
      // await axios.post('http://localhost:5000/api/v1/auth/logout');

      // Clear localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('authToken');

      console.log('✅ Logged out successfully');

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to login
      navigate('/admin/login', { replace: true });

    } catch (err) {
      console.error('❌ Logout error:', err);
      
      // Force logout even if API fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('authToken');
      
      navigate('/admin/login', { replace: true });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="logout-page">

      {/* Background decoration */}
      <div className="background-decoration decoration-1"></div>
      <div className="background-decoration decoration-2"></div>

      {/* Logout Confirmation Card */}
      <div className="logout-container">
        <div className="logout-card">

          {/* HEADER */}
          <div className="logout-header">
            <div className="logout-emoji">👋</div>
            <h1>Goodbye!</h1>
            <p>You're about to log out of PetroGo Admin</p>
          </div>

          {/* ADMIN INFO */}
          {adminInfo && (
            <div className="admin-info">
              <div className="admin-avatar">👤</div>
              <div className="admin-details">
                <p className="admin-label">Logged in as</p>
                <p className="admin-name">{adminInfo.name || 'Admin'}</p>
                <p className="admin-email">{adminInfo.email || 'admin@petrogo.com'}</p>
              </div>
            </div>
          )}

          {/* WHAT WILL HAPPEN */}
          <div className="info-section info-blue">
            <p className="info-title">ℹ️ What will happen:</p>
            <ul className="info-list">
              <li>✓ Your session will be ended</li>
              <li>✓ You'll be signed out from this device</li>
              <li>✓ Your login data will be cleared</li>
              <li>✓ You'll need to sign in again to access the admin panel</li>
            </ul>
          </div>

          {/* SECURITY NOTICE */}
          <div className="info-section info-yellow">
            <p className="info-title">🔐 Security Tip:</p>
            <p>Always log out when using a shared computer.</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="action-buttons">
            <button
              className="btn btn-logout"
              onClick={handleConfirmLogout}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Logging out...' : '✓ Yes, Log Me Out'}
            </button>

            <button
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              ← Take Me Back
            </button>
          </div>

          {/* FOOTER MESSAGE */}
          <div className="logout-footer">
            <p>See you next time! 👋</p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="copyright">
          <p>&copy; 2024 PetroGo Admin Panel. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
}