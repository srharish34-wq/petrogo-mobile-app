/**
 * Admin Login Page
 * Secure login with authentication
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import axios from 'axios';

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📡 Attempting login...');

      // For now, use mock login for testing
      // In production, call your backend API
      if (formData.email === 'admin@petrogo.com' && formData.password === 'admin123') {
        
        console.log('✅ Login successful');

        // Store auth token and data
        const mockToken = 'mock-jwt-token-' + Date.now();
        const adminData = {
          name: 'PetroGo Admin',
          email: formData.email,
          role: 'admin',
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('adminToken', mockToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));

        if (rememberMe) {
          localStorage.setItem('rememberEmail', formData.email);
        }

       setIsLoggedIn(true);
navigate('/dashboard', { replace: true });
      } else {
        setError('❌ Invalid email or password. Use admin@petrogo.com / admin123');
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Use useEffect instead of React.useEffect
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-page">
      
      {/* Background decoration */}
      <div className="bg-decoration decoration-1"></div>
      <div className="bg-decoration decoration-2"></div>

      <div className="login-container">

        {/* LOGO & BRANDING */}
        <div className="login-header">
          <div className="logo-container">
            <span className="logo-emoji">⛽</span>
          </div>
          <h1>PetroGo Admin</h1>
          <p>Manage your fuel delivery platform</p>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="login-card">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert-error">
              <p>{error}</p>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="login-form">

            {/* EMAIL FIELD */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@petrogo.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="form-footer">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me on this device</span>
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="form-divider">
            <span>Demo Credentials</span>
          </div>

          {/* TEST CREDENTIALS */}
          <div className="demo-credentials">
            <div className="demo-icon">🔑</div>
            <div className="demo-content">
              <p className="demo-title">Use these credentials to test:</p>
              <p className="demo-email">
                <strong>Email:</strong> <code>admin@petrogo.com</code>
              </p>
              <p className="demo-password">
                <strong>Password:</strong> <code>admin123</code>
              </p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="login-footer">
          <p>
            Need help? Contact{' '}
            <a href="mailto:support@petrogo.com">support@petrogo.com</a>
          </p>
          <p className="copyright">
            © 2024 PetroGo Admin Panel. All rights reserved.
          </p>
        </div>

      </div>

    </div>
  );
}