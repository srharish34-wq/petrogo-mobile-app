/**
 * Settings Page
 * App settings and preferences
 * Location: partner/src/pages/Settings.jsx
 */

import { useState } from 'react';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundAlerts: true,
    locationTracking: true,
    autoAcceptOrders: false,
    darkMode: false
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSuccessMessage('Settings updated');
  };

  const handleClearCache = () => {
    // Clear cache logic
    setSuccessMessage('Cache cleared successfully');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic
      alert('Account deletion feature coming soon');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your app experience</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
            className="mb-4"
          />
        )}

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔔 Notifications</h3>
          
          <div className="space-y-4">
            <SettingToggle
              label="Push Notifications"
              description="Receive order alerts and updates"
              checked={settings.notifications}
              onChange={() => handleToggle('notifications')}
            />

            <SettingToggle
              label="Sound Alerts"
              description="Play sound for new orders"
              checked={settings.soundAlerts}
              onChange={() => handleToggle('soundAlerts')}
            />
          </div>
        </div>

        {/* Privacy & Location */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔒 Privacy & Location</h3>
          
          <div className="space-y-4">
            <SettingToggle
              label="Location Tracking"
              description="Share your location during deliveries"
              checked={settings.locationTracking}
              onChange={() => handleToggle('locationTracking')}
            />
          </div>
        </div>

        {/* Order Preferences */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Order Preferences</h3>
          
          <div className="space-y-4">
            <SettingToggle
              label="Auto Accept Orders"
              description="Automatically accept orders (not recommended)"
              checked={settings.autoAcceptOrders}
              onChange={() => handleToggle('autoAcceptOrders')}
            />
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ App Settings</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleClearCache}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <p className="font-semibold text-gray-900">Clear Cache</p>
              <p className="text-sm text-gray-600">Free up storage space</p>
            </button>

            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">App Version</p>
              <p className="text-sm text-gray-600">v1.0.0</p>
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📄 Legal</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">Terms & Conditions</p>
            </button>

            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">Privacy Policy</p>
            </button>

            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">About PetroGo</p>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ Danger Zone</h3>
          
          <Button
            onClick={handleDeleteAccount}
            variant="danger"
            size="lg"
            fullWidth
          >
            Delete Account
          </Button>
          
          <p className="text-xs text-red-600 mt-2 text-center">
            This action is permanent and cannot be undone
          </p>
        </div>

      </div>
    </div>
  );
}

// Toggle Component
function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}