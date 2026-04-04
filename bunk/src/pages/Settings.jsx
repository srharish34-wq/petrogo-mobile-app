/**
 * Settings Page
 * App preferences, notifications, and account settings
 * Location: bunk/src/pages/Settings.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

export default function Settings() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    // Notifications
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: true,
    lowStockAlerts: true,
    
    // Operating Hours
    openTime: '06:00',
    closeTime: '22:00',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    
    // Business Settings
    autoAcceptOrders: false,
    maxDailyOrders: 100,
    deliveryRadius: 10, // km
    minimumOrderAmount: 500,
    
    // Display
    theme: 'light',
    language: 'en'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('bunkSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day) => {
    setSettings(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      // Save to localStorage
      localStorage.setItem('bunkSettings', JSON.stringify(settings));

      await new Promise(resolve => setTimeout(resolve, 800));

      setSuccessMessage('Settings saved successfully!');

    } catch (error) {
      setErrorMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error) {
      setErrorMessage('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and account settings</p>
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🔔 Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Order Notifications</p>
              <p className="text-sm text-gray-600">Receive alerts for new orders</p>
            </div>
            <button
              onClick={() => handleToggle('orderNotifications')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                settings.orderNotifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.orderNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Get updates via email</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                settings.emailNotifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-600">Receive SMS for important updates</p>
            </div>
            <button
              onClick={() => handleToggle('smsNotifications')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                settings.smsNotifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.smsNotifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Low Stock Alerts</p>
              <p className="text-sm text-gray-600">Alert when fuel stock is low</p>
            </div>
            <button
              onClick={() => handleToggle('lowStockAlerts')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                settings.lowStockAlerts ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.lowStockAlerts ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🕐 Operating Hours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Opening Time"
            type="time"
            name="openTime"
            value={settings.openTime}
            onChange={handleChange}
          />

          <Input
            label="Closing Time"
            type="time"
            name="closeTime"
            value={settings.closeTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Operating Days</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {daysOfWeek.map(day => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  settings.operatingDays.includes(day)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">⚙️ Business Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Auto Accept Orders</p>
              <p className="text-sm text-gray-600">Automatically accept all incoming orders</p>
            </div>
            <button
              onClick={() => handleToggle('autoAcceptOrders')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                settings.autoAcceptOrders ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                settings.autoAcceptOrders ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Max Daily Orders"
              type="number"
              name="maxDailyOrders"
              value={settings.maxDailyOrders}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="Delivery Radius (km)"
              type="number"
              name="deliveryRadius"
              value={settings.deliveryRadius}
              onChange={handleChange}
              min="1"
            />

            <Input
              label="Minimum Order Amount (₹)"
              type="number"
              name="minimumOrderAmount"
              value={settings.minimumOrderAmount}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🔒 Change Password</h2>
        
        <div className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={errors.currentPassword}
            required
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
            helperText="Must be at least 6 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleChangePassword}
            loading={isSaving}
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="sticky bottom-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSaveSettings}
          loading={isSaving}
          icon="💾"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

    </div>
  );
}