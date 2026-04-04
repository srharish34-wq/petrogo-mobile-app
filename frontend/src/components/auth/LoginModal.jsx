/**
 * Login Modal Component
 * Handles phone login with OTP
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PhoneInput from './PhoneInput';
import OTPInput from './OTPInput';
import { authService } from '../../services/authService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentOTP, setSentOTP] = useState(''); // For development display

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.sendOTP(phone);

      if (response.status === 'success') {
        setStep('otp');
        // Show OTP in development
        if (response.data?.otp) {
          setSentOTP(response.data.otp);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.verifyOTP(phone, otp, name);

      if (response.status === 'success') {
        // Success! Close modal and redirect
        onLoginSuccess && onLoginSuccess(response.data.user);
        onClose();
        window.location.href = '/'; // Redirect to home page
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset and go back
  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setSentOTP('');
  };

  // Reset on close
  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setName('');
    setError('');
    setSentOTP('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'phone' ? 'Welcome to PetroGo' : 'Verify OTP'}
      size="sm"
    >
      <div className="space-y-6">
        {/* Step 1: Phone Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <p className="text-gray-600 mb-4">
                Enter your phone number to get started with emergency fuel assistance.
              </p>

              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={error}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={phone.length !== 10}
            >
              Send OTP
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit OTP to <strong>+91 {phone}</strong>
              </p>

              {/* Show OTP in development */}
              {sentOTP && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Development Mode:</strong> Your OTP is <strong>{sentOTP}</strong>
                  </p>
                </div>
              )}

              <OTPInput
                value={otp}
                onChange={setOtp}
                error={error}
              />

              {/* Name input for new users */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={otp.length !== 6}
            >
              Verify & Login
            </Button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Change Phone Number
            </button>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full text-center text-gray-600 hover:text-gray-700 text-sm"
            >
              Didn't receive OTP? Resend
            </button>
          </form>
        )}

        {/* Safety Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div className="text-sm text-orange-800">
              <p className="font-semibold mb-1">Safety Notice</p>
              <p>Emergency fuel assistance only using PESO-approved containers. Maximum 5 liters per delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}