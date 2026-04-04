/**
 * Login Page - DEBUG VERSION
 * Shows detailed error messages
 * Location: partner/frontend/src/pages/auth/Login.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 API URL:', `${API_URL}/partners/phone/${phone}`);
      
      const response = await axios.get(`${API_URL}/partners/phone/${phone}`);
      
      console.log('✅ Full response:', response);
      console.log('✅ Response data:', response.data);
      
      if (response.data.status === 'success' && response.data.data.partner) {
        const partner = response.data.data.partner;
        
        console.log('✅ Partner found:', partner);
        console.log('📋 Partner user:', partner.user);
        
        // Generate dev OTP
        const devOTP = Math.floor(100000 + Math.random() * 900000).toString();
        
        localStorage.setItem('tempPhone', phone);
        localStorage.setItem('devOTP', devOTP);
        localStorage.setItem('tempPartnerData', JSON.stringify(partner));
        
        console.log('📱 Dev OTP:', devOTP);
        
        // Navigate to OTP
        navigate('/verify-phone', { 
          state: { 
            phone, 
            isNewUser: false,
            devOTP: devOTP
          } 
        });
      } else {
        setDebugInfo('Response: ' + JSON.stringify(response.data));
        throw new Error('Partner not found in response');
      }
      
    } catch (err) {
      console.error('❌ Full error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      
      setDebugInfo(`
        Status: ${err.response?.status}
        URL: ${API_URL}/partners/phone/${phone}
        Error: ${err.response?.data?.message || err.message}
      `);
      
      if (err.response?.status === 404) {
        setError('Phone number not registered. Please register first or check if you entered the correct number.');
      } else if (err.response?.status === 400) {
        setError('Bad request: ' + (err.response?.data?.message || 'Invalid request'));
      } else {
        setError(err.response?.data?.message || 'Failed to process login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        
        <div className="text-center mb-8">
          <div className="bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            PG
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Partner Login
          </h1>
          <p className="text-gray-600">
            Enter your registered phone number
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        {debugInfo && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4">
            <p className="text-xs font-mono text-gray-800 whitespace-pre-wrap">{debugInfo}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setPhone(value);
              }
            }}
            placeholder="Enter 10-digit number"
            icon="📱"
            required
            maxLength={10}
            error={phone.length > 0 && !validatePhone(phone) ? 'Invalid phone number' : ''}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!validatePhone(phone)}
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </Button>

        </form>

        <div className="mt-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>🔍 Debug Info:</strong>
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              /partners/phone/{phone || '[phone]'}
            </p>
            <p className="text-xs text-yellow-700">
              Phone: {phone || 'Not entered'}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            New partner?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-orange-500 font-semibold hover:text-orange-600 transition"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>📱 First Time?</strong>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            You must register as a delivery partner before you can login.
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help?{' '}
            <a href="tel:+918888888888" className="text-orange-500 font-semibold">
              Contact Support
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}