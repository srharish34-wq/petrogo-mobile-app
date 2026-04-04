/**
 * Admin Settings Page
 * Manage system settings, configuration, and preferences
 */

import "../styles/settings.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/common/Loader';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'PetroGo',
    appEmail: 'admin@petrogo.com',
    appPhone: '+91-9876543210',
    timezone: 'IST',
    language: 'en'
  });

  // Delivery Settings
  const [deliverySettings, setDeliverySettings] = useState({
    maxDeliveryDistance: 20,
    baseDeliveryCharge: 30,
    perKmCharge: 10,
    maxDeliveryCharge: 100,
    maxFuelLimit: 5,
    emergencyFee: 50,
    deliveryTimeEstimate: 45
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptOnline: true,
    onlineCharges: 2,
    minPaymentAmount: 100,
    maxPaymentAmount: 10000,
    autoRefund: true,
    refundDays: 7
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    paymentAlerts: true,
    partnerAlerts: true,
    customerAlerts: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  // =========================
  // FETCH SETTINGS
  // =========================
  const fetchSettings = async () => {
    try {
      setLoading(true);

      console.log('📡 Fetching settings...');

      const res = await axios.get(
        `${API_BASE}/admin/settings`
      );

      console.log('✅ Settings response:', res.data);

      if (res.data.data?.settings) {
        const settings = res.data.data.settings;

        // Update state from backend
        if (settings.general) setGeneralSettings(settings.general);
        if (settings.delivery) setDeliverySettings(settings.delivery);
        if (settings.payment) setPaymentSettings(settings.payment);
        if (settings.notification) setNotificationSettings(settings.notification);
      }

    } catch (err) {
      console.error('❌ Fetch settings error:', err);
      // Use default values if fetch fails
      setErrorMessage('Failed to load settings. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE HANDLERS
  // =========================
  const handleSaveGeneral = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      console.log('💾 Saving general settings:', generalSettings);

      await axios.patch(
        `${API_BASE}/admin/settings`,
        { general: generalSettings }
      );

      console.log('✅ General settings saved');
      setSuccessMessage('General settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);
      setErrorMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      console.log('💾 Saving delivery settings:', deliverySettings);

      await axios.patch(
        `${API_BASE}/admin/settings`,
        { delivery: deliverySettings }
      );

      console.log('✅ Delivery settings saved');
      setSuccessMessage('Delivery settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);
      setErrorMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayment = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      console.log('💾 Saving payment settings:', paymentSettings);

      await axios.patch(
        `${API_BASE}/admin/settings`,
        { payment: paymentSettings }
      );

      console.log('✅ Payment settings saved');
      setSuccessMessage('Payment settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);
      setErrorMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotification = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      console.log('💾 Saving notification settings:', notificationSettings);

      await axios.patch(
        `${API_BASE}/admin/settings`,
        { notification: notificationSettings }
      );

      console.log('✅ Notification settings saved');
      setSuccessMessage('Notification settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);
      setErrorMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="loader">⏳ Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>⚙️ Settings</h1>
          <p>Manage system configuration and preferences</p>
        </div>

        <button className="refresh-btn" onClick={fetchSettings}>
          🔄 Refresh
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="alert-success">
          <p>✅ {successMessage}</p>
          <button onClick={() => setSuccessMessage("")}>×</button>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="alert-error">
          <p>❌ {errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>×</button>
        </div>
      )}

      {/* TABS */}
      <div className="settings-container">

        {/* TAB BUTTONS */}
        <div className="tabs-header">
          {[
            { id: 'general', label: 'General Settings', icon: '⚙️' },
            { id: 'delivery', label: 'Delivery Settings', icon: '🚗' },
            { id: 'payment', label: 'Payment Settings', icon: '💳' },
            { id: 'notification', label: 'Notifications', icon: '🔔' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">

          {/* GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="settings-form">
              <h3>General Settings</h3>

              <div className="form-group">
                <label>Application Name</label>
                <input
                  type="text"
                  value={generalSettings.appName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })}
                  placeholder="App Name"
                />
              </div>

              <div className="form-group">
                <label>Support Email</label>
                <input
                  type="email"
                  value={generalSettings.appEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, appEmail: e.target.value })}
                  placeholder="support@example.com"
                />
              </div>

              <div className="form-group">
                <label>Support Phone</label>
                <input
                  type="tel"
                  value={generalSettings.appPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, appPhone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                >
                  <option value="IST">Indian Standard Time (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Standard Time (EST)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>

              <div className="form-buttons">
                <button className="btn-secondary">Reset</button>
                <button
                  className="btn-primary"
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* DELIVERY SETTINGS */}
          {activeTab === 'delivery' && (
            <div className="settings-form">
              <h3>Delivery Configuration</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Delivery Distance (km)</label>
                  <input
                    type="number"
                    value={deliverySettings.maxDeliveryDistance}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, maxDeliveryDistance: parseFloat(e.target.value) })}
                    min={1}
                  />
                </div>

                <div className="form-group">
                  <label>Base Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={deliverySettings.baseDeliveryCharge}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, baseDeliveryCharge: parseFloat(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Per KM Charge (₹)</label>
                  <input
                    type="number"
                    value={deliverySettings.perKmCharge}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, perKmCharge: parseFloat(e.target.value) })}
                    min={0}
                    step={0.5}
                  />
                </div>

                <div className="form-group">
                  <label>Max Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={deliverySettings.maxDeliveryCharge}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, maxDeliveryCharge: parseFloat(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Fuel Limit (Liters)</label>
                  <input
                    type="number"
                    value={deliverySettings.maxFuelLimit}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, maxFuelLimit: parseFloat(e.target.value) })}
                    min={0.5}
                    step={0.5}
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Fee (₹)</label>
                  <input
                    type="number"
                    value={deliverySettings.emergencyFee}
                    onChange={(e) => setDeliverySettings({ ...deliverySettings, emergencyFee: parseFloat(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Time Estimate (minutes)</label>
                <input
                  type="number"
                  value={deliverySettings.deliveryTimeEstimate}
                  onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryTimeEstimate: parseFloat(e.target.value) })}
                  min={15}
                />
              </div>

              <div className="form-buttons">
                <button className="btn-secondary">Reset</button>
                <button
                  className="btn-primary"
                  onClick={handleSaveDelivery}
                  disabled={isSaving}
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* PAYMENT SETTINGS */}
          {activeTab === 'payment' && (
            <div className="settings-form">
              <h3>Payment Configuration</h3>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptCash}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCash: e.target.checked })}
                  />
                  <span>Accept Cash Payments</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptOnline}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptOnline: e.target.checked })}
                  />
                  <span>Accept Online Payments</span>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Online Payment Charge (%)</label>
                  <input
                    type="number"
                    value={paymentSettings.onlineCharges}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, onlineCharges: parseFloat(e.target.value) })}
                    min={0}
                    max={10}
                    step={0.1}
                  />
                </div>

                <div className="form-group">
                  <label>Min Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentSettings.minPaymentAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, minPaymentAmount: parseFloat(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentSettings.maxPaymentAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, maxPaymentAmount: parseFloat(e.target.value) })}
                    min={0}
                  />
                </div>

                <div className="form-group">
                  <label>Refund Days</label>
                  <input
                    type="number"
                    value={paymentSettings.refundDays}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, refundDays: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={paymentSettings.autoRefund}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, autoRefund: e.target.checked })}
                  />
                  <span>Enable Auto Refund</span>
                </label>
              </div>

              <div className="form-buttons">
                <button className="btn-secondary">Reset</button>
                <button
                  className="btn-primary"
                  onClick={handleSavePayment}
                  disabled={isSaving}
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeTab === 'notification' && (
            <div className="settings-form">
              <h3>Notification Preferences</h3>

              <div className="settings-section">
                <h4>Notification Channels</h4>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                    />
                    <span>📧 Email Notifications</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                    />
                    <span>📱 SMS Notifications</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                    />
                    <span>🔔 Push Notifications</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h4>Alert Types</h4>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.orderUpdates}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, orderUpdates: e.target.checked })}
                    />
                    <span>📦 Order Updates</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentAlerts: e.target.checked })}
                    />
                    <span>💳 Payment Alerts</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.partnerAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, partnerAlerts: e.target.checked })}
                    />
                    <span>🚗 Partner Alerts</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.customerAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, customerAlerts: e.target.checked })}
                    />
                    <span>👤 Customer Alerts</span>
                  </label>
                </div>
              </div>

              <div className="form-buttons">
                <button className="btn-secondary">Reset</button>
                <button
                  className="btn-primary"
                  onClick={handleSaveNotification}
                  disabled={isSaving}
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SYSTEM INFO */}
      <div className="system-info">
        <h3>📋 System Information</h3>
        <div className="info-grid">
          <div className="info-card">
            <p>Application Version</p>
            <span>v2.1.0</span>
          </div>
          <div className="info-card">
            <p>Last Updated</p>
            <span>2024-06-10</span>
          </div>
          <div className="info-card">
            <p>Database Status</p>
            <span>✅ Connected</span>
          </div>
        </div>
      </div>

    </div>
  );
}