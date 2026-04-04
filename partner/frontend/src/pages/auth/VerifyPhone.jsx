/**
 * VerifyPhone Page
 * OTP verification - fetches partner data from backend
 * Location: partner/frontend/src/pages/auth/VerifyPhone.jsx
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function VerifyPhone() {
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const phone = location.state?.phone || localStorage.getItem('tempPhone') || '';
  const devOTP = location.state?.devOTP || localStorage.getItem('devOTP') || '';
  const isNewUser = location.state?.isNewUser || false;

  useEffect(() => {
    if (!phone) {
      window.location.href = '/login';
    }
  }, [phone]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);
    console.log('🔐 Verifying OTP...');

    try {
      // Fetch partner data from backend
      const response = await axios.get(`${API_URL}/partners/phone/${phone}`);

      if (response.data.status === 'success' && response.data.data.partner) {
        const partnerData = response.data.data.partner;
        console.log('✅ Partner data fetched:', partnerData);

        // Merge user and partner data
        const userData = {
          _id: partnerData._id,
          phone: partnerData.user.phone,
          name: partnerData.user.name,
          email: partnerData.user.email,
          role: 'partner',
          vehicle: partnerData.vehicle,
          license: partnerData.license,
          kycStatus: partnerData.kycStatus,
          isAvailable: partnerData.isAvailable,
          currentStatus: partnerData.currentStatus,
          currentLocation: partnerData.currentLocation,
          performance: partnerData.performance,
          earnings: partnerData.earnings
        };

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userPhone', phone);

        // Clear temp data
        localStorage.removeItem('tempPhone');
        localStorage.removeItem('devOTP');
        localStorage.removeItem('tempPartnerData');
        localStorage.removeItem('tempRegistration');

        console.log('✅ User data saved!');
        console.log('🚀 Redirecting to dashboard...');

        // Redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        throw new Error('Partner data not found');
      }

    } catch (err) {
      console.error('❌ Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">

        <div className="text-center mb-8">
          <div className="bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            📱
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Phone</h1>
          <p className="text-orange-600 font-bold text-lg">+91 {phone}</p>
        </div>

        {devOTP && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 font-bold">🎯 Demo Mode</p>
            <p className="text-xs text-blue-700">Generated OTP: <strong className="text-lg">{devOTP}</strong></p>
            <p className="text-xs text-blue-700">Or use any 6 digits (e.g., 123456)</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP *</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) setOtp(val);
              }}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-xl focus:border-orange-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

      </div>
    </div>
  );
}