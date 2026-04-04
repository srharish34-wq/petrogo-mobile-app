/**
 * Profile Page - Enhanced with KYC Upload & Delivery Kit Purchase
 * Location: partner/src/pages/Profile.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Profile() {
  const navigate = useNavigate();
  
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState({ totalDeliveries: 0, totalEarnings: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Document upload states
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [documents, setDocuments] = useState({
    licenseImage: null,
    aadhaarImage: null,
    photoImage: null
  });
  const [uploadProgress, setUploadProgress] = useState({});

  // Delivery kit modal
  const [showKitModal, setShowKitModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicleNumber: '',
    vehicleType: 'bike',
    licenseNumber: '',
    aadhaarNumber: ''
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const partnerId = userData._id;

  useEffect(() => {
    if (partnerId) {
      loadProfile();
      loadStats();
    } else {
      navigate('/login');
    }
  }, [partnerId, navigate]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
      setPartner(storedData);
      
      setFormData({
        name: storedData.name || '',
        email: storedData.email || '',
        vehicleNumber: storedData.vehicle?.number || '',
        vehicleType: storedData.vehicle?.type || 'bike',
        licenseNumber: storedData.license?.number || '',
        aadhaarNumber: storedData.documents?.aadhaar?.number || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/partners/${partnerId}/orders`);
      const completedOrders = (response.data?.data?.orders || []).filter(o => o.status === 'completed');
      
      const totalEarnings = completedOrders.reduce((sum, order) => {
        return sum + (order.charges?.deliveryCharge || 0) + (order.charges?.emergencyFee || 0);
      }, 0);

      setStats({
        totalDeliveries: completedOrders.length,
        totalEarnings: totalEarnings
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      setDocuments(prev => ({ ...prev, [docType]: file }));
      setError('');
    }
  };

  const handleUploadDocuments = async () => {
    try {
      setUploadProgress({ uploading: true });
      setError('');

      // Mock upload (no backend)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update localStorage
      const updatedPartner = {
        ...partner,
        documents: {
          licenseImage: documents.licenseImage?.name || partner.documents?.licenseImage,
          aadhaarImage: documents.aadhaarImage?.name || partner.documents?.aadhaarImage,
          photoImage: documents.photoImage?.name || partner.documents?.photoImage
        },
        license: {
          ...partner.license,
          number: formData.licenseNumber,
          imageUrl: documents.licenseImage?.name || partner.license?.imageUrl
        },
        kycStatus: 'under_review'
      };

      localStorage.setItem('userData', JSON.stringify(updatedPartner));
      setPartner(updatedPartner);
      
      setSuccessMessage('✅ Documents uploaded successfully! KYC under review.');
      setShowKYCModal(false);
      setDocuments({ licenseImage: null, aadhaarImage: null, photoImage: null });
      
    } catch (err) {
      setError(err.message || 'Failed to upload documents');
    } finally {
      setUploadProgress({});
    }
  };

  const handleBuyKit = async () => {
    if (!selectedPayment) {
      setError('Please select a payment method');
      return;
    }

    try {
      setError('');
      
      // Mock payment (no backend)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update partner data
      const updatedPartner = {
        ...partner,
        deliveryKit: {
          purchased: true,
          purchasedAt: new Date(),
          paymentMethod: selectedPayment,
          amount: 1500
        }
      };

      localStorage.setItem('userData', JSON.stringify(updatedPartner));
      setPartner(updatedPartner);
      
      setSuccessMessage('🎉 Delivery Kit purchased successfully! It will be delivered in 3-5 days.');
      setShowKitModal(false);
      setSelectedPayment('');
      
    } catch (err) {
      setError(err.message || 'Payment failed');
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        ...partner,
        name: formData.name,
        email: formData.email,
        vehicle: {
          ...partner.vehicle,
          number: formData.vehicleNumber,
          type: formData.vehicleType
        },
        license: {
          ...partner.license,
          number: formData.licenseNumber
        }
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedData));
      setPartner(updatedData);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account & documents</p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex justify-between items-start">
            <p className="text-sm text-green-800">{successMessage}</p>
            <button onClick={() => setSuccessMessage('')} className="text-green-600">✕</button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex justify-between items-start">
            <p className="text-sm text-red-800">{error}</p>
            <button onClick={() => setError('')} className="text-red-600">✕</button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {(partner?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{partner?.name || 'Partner'}</h2>
              <p className="text-gray-600">{partner?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Personal Info (existing code) */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{partner?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{partner?.email || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{partner?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* KYC Documents Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📋 KYC Documents</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              partner?.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
              partner?.kycStatus === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {partner?.kycStatus === 'approved' ? '✅ Approved' :
               partner?.kycStatus === 'under_review' ? '⏳ Under Review' :
               '❌ Pending'}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">📄 Driving License</span>
              <span className="text-sm">{partner?.documents?.licenseImage ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">🆔 Aadhaar Card</span>
              <span className="text-sm">{partner?.documents?.aadhaarImage ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">📸 Photo</span>
              <span className="text-sm">{partner?.documents?.photoImage ? '✅' : '❌'}</span>
            </div>
          </div>

          <button
            onClick={() => setShowKYCModal(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition"
          >
            📤 Upload Documents
          </button>
        </div>

        {/* Buy Delivery Kit Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎒 Delivery Kit</h3>
              <p className="text-orange-100 text-sm">Professional delivery essentials</p>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <p className="text-2xl font-bold">₹1,500</p>
            </div>
          </div>

          {partner?.deliveryKit?.purchased ? (
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <p className="font-bold mb-1">✅ Kit Purchased</p>
              <p className="text-sm text-orange-100">
                Purchased on {new Date(partner.deliveryKit.purchasedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowKitModal(true)}
              className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition"
            >
              🛒 Buy Now
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.totalDeliveries}</p>
            <p className="text-sm text-gray-600 mt-1">Total Deliveries</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <p className="text-3xl font-bold text-green-600">₹{Math.round(stats.totalEarnings)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🚪</span>
          Logout
        </button>

      </div>

      {/* KYC Upload Modal */}
      {showKYCModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📋 Upload KYC Documents</h2>
              <button onClick={() => setShowKYCModal(false)} className="text-2xl text-gray-500">✕</button>
            </div>

            <div className="space-y-6">
              {/* License Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📄 Driving License *
                </label>
                <input
                  type="text"
                  placeholder="License Number (e.g., TN0120230001234)"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-4 py-3 border-2 rounded-xl mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('licenseImage', e)}
                  className="w-full px-4 py-3 border-2 rounded-xl"
                />
                {documents.licenseImage && (
                  <p className="text-sm text-green-600 mt-2">✅ {documents.licenseImage.name}</p>
                )}
              </div>

              {/* Aadhaar Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  🆔 Aadhaar Card *
                </label>
                <input
                  type="text"
                  placeholder="Aadhaar Number (12 digits)"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                  maxLength={12}
                  className="w-full px-4 py-3 border-2 rounded-xl mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('aadhaarImage', e)}
                  className="w-full px-4 py-3 border-2 rounded-xl"
                />
                {documents.aadhaarImage && (
                  <p className="text-sm text-green-600 mt-2">✅ {documents.aadhaarImage.name}</p>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  📸 Your Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('photoImage', e)}
                  className="w-full px-4 py-3 border-2 rounded-xl"
                />
                {documents.photoImage && (
                  <p className="text-sm text-green-600 mt-2">✅ {documents.photoImage.name}</p>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadDocuments}
                disabled={!documents.licenseImage || !documents.aadhaarImage || !documents.photoImage || uploadProgress.uploading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                {uploadProgress.uploading ? '⏳ Uploading...' : '📤 Upload Documents'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Max file size: 5MB | Formats: JPG, PNG
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Kit Modal */}
      {showKitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🎒 Buy Delivery Kit</h2>
              <button onClick={() => setShowKitModal(false)} className="text-2xl text-gray-500">✕</button>
            </div>

            {/* Kit Items Grid */}
       {/* Kit Items Grid - WITH REAL IMAGES */}
<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="bg-gray-100 rounded-xl p-4 text-center">
    <img 
      src="/assets/images/petrogo-tshirt.png" 
      alt="PetroGo T-Shirt" 
      className="w-24 h-24 mx-auto mb-2 object-contain"
    />
    <p className="font-bold text-sm">PetroGo T-Shirt</p>
  </div>
  <div className="bg-gray-100 rounded-xl p-4 text-center">
    <img 
      src="/assets/images/petrogo-bag.png" 
      alt="Delivery Bag" 
      className="w-24 h-24 mx-auto mb-2 object-contain"
    />
    <p className="font-bold text-sm">Delivery Bag</p>
  </div>
  <div className="bg-gray-100 rounded-xl p-4 text-center">
    <img 
      src="/assets/images/petrogo-helmet.png" 
      alt="Safety Helmet" 
      className="w-24 h-24 mx-auto mb-2 object-contain"
    />
    <p className="font-bold text-sm">Safety Helmet</p>
  </div>
  <div className="bg-gray-100 rounded-xl p-4 text-center">
    <img 
      src="/assets/images/petrogo-can.png" 
      alt="Petroleum Can" 
      className="w-24 h-24 mx-auto mb-2 object-contain"
    />
    <p className="font-bold text-sm">Petroleum Can</p>
  </div>
</div>

            {/* Price */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-600 mb-1">Total Price</p>
              <p className="text-4xl font-bold text-orange-600">₹1,500</p>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <p className="font-bold text-gray-900 mb-3">Select Payment Method</p>
              <div className="space-y-3">
                {['cash', 'upi', 'card'].map(method => (
                  <button
                    key={method}
                    onClick={() => setSelectedPayment(method)}
                    className={`w-full p-4 border-2 rounded-xl font-bold transition ${
                      selectedPayment === method
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {method === 'cash' && '💵 Cash on Delivery'}
                    {method === 'upi' && '📱 UPI Payment'}
                    {method === 'card' && '💳 Card Payment'}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleBuyKit}
              disabled={!selectedPayment}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl disabled:opacity-50"
            >
              💳 Confirm Purchase
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Kit will be delivered in 3-5 business days
            </p>
          </div>
        </div>
      )}
    </div>
  );
}