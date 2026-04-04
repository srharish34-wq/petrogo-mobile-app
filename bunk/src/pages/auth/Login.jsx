/**
 * Login Page
 * Bunk owner/manager login with email/phone
 * Location: bunk/src/pages/auth/Login.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await authService.login(formData);
      
      // Mock login for demo (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login
      const mockBunkData = {
        _id: 'bunk123',
        name: 'City Fuel Station',
        ownerName: 'Demo Owner',
        email: formData.emailOrPhone,
        phone: '9876543210',
        address: '123 Main Street, Chennai, Tamil Nadu',
        licenseNumber: 'BUNK12345',
        fuelStock: {
          petrol: { currentStock: 5000, capacity: 10000, pricePerLiter: 102.50 },
          diesel: { currentStock: 7000, capacity: 15000, pricePerLiter: 94.20 }
        }
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Store in localStorage
      localStorage.setItem('bunkToken', mockToken);
      localStorage.setItem('bunkData', JSON.stringify(mockBunkData));

      console.log('✅ Login successful');

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Login error:', error);
      setLoginError(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
            ⛽
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PetroGo Bunk
          </h1>
          <p className="text-gray-600">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Login Error Alert */}
        {loginError && (
          <Alert
            type="error"
            message={loginError}
            onClose={() => setLoginError('')}
            className="mb-6"
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email or Phone */}
          <Input
            label="Email or Phone Number"
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter email or phone"
            required
            error={errors.emailOrPhone}
            icon="👤"
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
            icon="🔒"
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

        </form>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm font-bold text-blue-900 mb-2">
            🧪 Demo Credentials
          </p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Email:</strong> demo@petrogo.com</p>
            <p><strong>Password:</strong> demo123</p>
            <p className="text-blue-600 mt-2">
              ℹ️ Use any credentials to test (mock mode)
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a
              href="tel:+918888888888"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 PetroGo. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>

      </div>
    </div>
  );
}