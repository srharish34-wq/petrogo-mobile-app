/**
 * ForgotPassword Page
 * Password recovery with email/phone OTP verification
 * Location: bunk/src/pages/auth/ForgotPassword.jsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(0);

  // Demo OTP (remove in production)
  const [demoOTP, setDemoOTP] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.emailOrPhone.trim()) {
      setErrors({ emailOrPhone: 'Email or phone number is required' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // await authService.sendPasswordResetOTP(formData.emailOrPhone);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate demo OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoOTP(generatedOTP);

      console.log('📱 Demo OTP:', generatedOTP);

      setSuccessMessage(`OTP sent to ${formData.emailOrPhone}`);
      setStep(2);
      setTimer(300); // 5 minutes countdown

      // Start timer
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Error:', error);
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }

    // Demo OTP verification
    if (formData.otp !== demoOTP) {
      setErrorMessage('Invalid OTP. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // await authService.verifyOTP(formData.emailOrPhone, formData.otp);
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('OTP verified! Set your new password.');
      setStep(3);

    } catch (error) {
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // await authService.resetPassword(formData.emailOrPhone, formData.newPassword);
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage('Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMessage(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    setTimer(300);
    await handleSendOTP({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
            🔒
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h1>
          <p className="text-gray-600">
            {step === 1 && 'Enter your email or phone to receive OTP'}
            {step === 2 && 'Enter the 6-digit code we sent'}
            {step === 3 && 'Create a new strong password'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
            className="mb-6"
          />
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
            className="mb-6"
          />
        )}

        {/* Step 1: Email/Phone */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <Input
              label="Email or Phone Number"
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter email or phone"
              required
              error={errors.emailOrPhone}
              icon="📧"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Send OTP
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            {/* Demo OTP Display */}
            {demoOTP && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                <p className="text-sm font-bold text-yellow-900">
                  🧪 Demo OTP: <span className="text-lg">{demoOTP}</span>
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <Input
                label="Enter OTP"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="000000"
                required
                error={errors.otp}
                maxLength={6}
                icon="🔢"
              />

              {/* Timer */}
              {timer > 0 && (
                <p className="text-center text-sm text-gray-600">
                  OTP expires in: <strong className="text-orange-600">{formatTime(timer)}</strong>
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Verify OTP
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={timer > 0}
                  className={`text-sm font-semibold ${
                    timer > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-orange-600 hover:text-orange-700'
                  }`}
                >
                  {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              error={errors.newPassword}
              icon="🔒"
              helperText="Must be at least 6 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
              error={errors.confirmPassword}
              icon="✅"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Reset Password
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Back to Login
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}