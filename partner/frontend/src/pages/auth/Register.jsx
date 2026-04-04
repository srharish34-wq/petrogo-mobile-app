/**
 * Register Page - FIXED with better validation
 * Location: partner/frontend/src/pages/auth/Register.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    vehicleNumber: '',
    vehicleType: 'bike',
    vehicleModel: '',
    licenseNumber: '',
    aadhaarNumber: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'aadhaarNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'vehicleNumber' || name === 'licenseNumber') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    if (!formData.name || formData.name.length < 2) {
      setError('Please enter your full name');
      return false;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.vehicleNumber || formData.vehicleNumber.length < 6) {
      setError('Please enter a valid vehicle number');
      return false;
    }

    if (!formData.licenseNumber || formData.licenseNumber.length < 8) {
      setError('Please enter a valid license number');
      return false;
    }

    if (!validateAadhaar(formData.aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return false;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugInfo('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('📝 Starting registration...');

      // Prepare data for backend - EXACTLY as backend expects
      const registrationData = {
        phone: formData.phone,
        name: formData.name,
        email: formData.email || undefined, // Don't send empty string
        vehicle: {
          number: formData.vehicleNumber,
          type: formData.vehicleType,
          model: formData.vehicleModel || 'Not specified',
          color: 'Black' // Default color
        },
        license: {
          number: formData.licenseNumber,
          expiryDate: new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000).toISOString() // 5 years from now
        },
        documents: {
          aadhaar: {
            number: formData.aadhaarNumber
          }
        }
      };

      console.log('📤 Sending data:', JSON.stringify(registrationData, null, 2));
      console.log('🌐 API URL:', `${API_URL}/partners/register`);
      // Call backend API
      const response = await axios.post(`${API_URL}/partners/register`, registrationData);

      console.log('✅ Registration successful!');
      console.log('📥 Response:', response.data);

      // Store temp data for OTP verification
      localStorage.setItem('tempPhone', formData.phone);
      localStorage.setItem('tempRegistration', JSON.stringify(formData));
      
      // Generate dev OTP
      const devOTP = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('devOTP', devOTP);

      console.log('📱 Dev OTP:', devOTP);

      alert('✅ Registration successful! Redirecting to OTP verification...');

      // Navigate to OTP verification
      navigate('/verify-phone', {
        state: { 
          phone: formData.phone, 
          isNewUser: true,
          devOTP: devOTP
        }
      });

    } catch (err) {
      console.error('❌ Registration error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || err.message || 'Registration failed';
      
      setDebugInfo(`
Status: ${err.response?.status}
URL: ${API_URL}/partners/register
Error: ${errorMessage}
Response: ${JSON.stringify(errorData, null, 2)}
      `);
      
      if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
        setError('Phone number already registered. Please login instead.');
      } else if (err.response?.status === 400) {
        setError('Validation Error: ' + errorMessage + '. Please check all fields.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            PG
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Partner Registration
          </h1>
          <p className="text-gray-600">
            Join PetroGo and start earning today
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          {debugInfo && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-6">
              <p className="text-xs font-bold text-gray-900 mb-2">🔍 Debug Info:</p>
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                {debugInfo}
              </pre>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📋 Personal Information
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  icon="👤"
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  icon="📱"
                  required
                  maxLength={10}
                />

                <Input
                  label="Email Address (Optional)"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  icon="📧"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🚗 Vehicle Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                  >
                    <option value="bike">🏍️ Bike/Motorcycle</option>
                    <option value="scooter">🛵 Scooter</option>
                    <option value="car">🚗 Car</option>
                  </select>
                </div>

                <Input
                  label="Vehicle Number"
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="TN01AB1234"
                  icon="🚗"
                  required
                />

                <Input
                  label="Vehicle Model (Optional)"
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Hero Splendor"
                  icon="🏍️"
                />

                <Input
                  label="Driving License Number"
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="TN0120200001234"
                  icon="📄"
                  required
                />
              </div>
            </div>

            {/* KYC Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🆔 KYC Documents
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Aadhaar Number"
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar number"
                  icon="🆔"
                  required
                  maxLength={12}
                />

                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>📸 Document Upload:</strong>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    After registration, you'll be asked to upload photos of your documents for KYC verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-orange-500 font-semibold hover:text-orange-600">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-500 font-semibold hover:text-orange-600">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!termsAccepted}
            >
              {isLoading ? 'Registering...' : 'Register & Continue'}
            </Button>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-orange-500 font-semibold hover:text-orange-600 transition"
              >
                Login here
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}