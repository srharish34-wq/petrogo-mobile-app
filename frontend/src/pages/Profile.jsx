/**
 * Profile Page
 * User profile and account settings
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });

  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const response = await orderService.getCustomerOrders(user.phone);
        
        if (response.status === 'success') {
          const orders = response.data.orders;
          const completed = orders.filter(o => o.status === 'completed');
          const totalSpent = completed.reduce((sum, o) => sum + (o.charges?.totalAmount || 0), 0);
          
          setStats({
            totalOrders: orders.length,
            completedOrders: completed.length,
            totalSpent: totalSpent.toFixed(2)
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfile(user.phone, formData);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-orange-600 text-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-white text-opacity-90 mb-1">
                📱 +91 {user?.phone}
              </p>
              {user?.email && (
                <p className="text-white text-opacity-90">
                  📧 {user.email}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition"
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              icon: '📦', 
              label: 'Total Orders', 
              value: stats.totalOrders,
              color: 'from-blue-500 to-blue-600'
            },
            { 
              icon: '✅', 
              label: 'Completed', 
              value: stats.completedOrders,
              color: 'from-green-500 to-green-600'
            },
            { 
              icon: '💰', 
              label: 'Total Spent', 
              value: `₹${stats.totalSpent}`,
              color: 'from-orange-500 to-orange-600'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all`}
            >
              <div className="text-5xl mb-3">{stat.icon}</div>
              <p className="text-white text-opacity-90 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                  isEditing 
                    ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                  isEditing 
                    ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Phone (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={`+91 ${user?.phone}`}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Phone number cannot be changed
              </p>
            </div>

            {/* Address Section */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Address Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Street */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                      isEditing 
                        ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Chennai"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                      isEditing 
                        ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tamil Nadu"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                      isEditing 
                        ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="600001"
                    maxLength={6}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                      isEditing 
                        ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      address: user?.address || {}
                    });
                  }}
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={saveLoading}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
              📦
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Order History
            </h3>
            <p className="text-gray-600 text-sm">
              View all your past fuel delivery orders
            </p>
          </button>

          <button
            onClick={() => navigate('/emergency')}
            className="bg-gradient-to-br from-primary-500 to-orange-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">
              Request Fuel
            </h3>
            <p className="text-white text-opacity-90 text-sm">
              Order emergency fuel delivery now
            </p>
          </button>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Button
            onClick={handleLogout}
            variant="danger"
            size="lg"
            fullWidth
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}