/**
 * Profile Page
 * Bunk profile, owner details, bank information, and license
 * Location: bunk/src/pages/Profile.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loader from '../components/common/Loader';

export default function Profile() {
  const navigate = useNavigate();
  
  const [bunk, setBunk] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    gstNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      setIsLoading(true);

      // Get bunk data from localStorage
      const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
      
      if (!bunkData._id) {
        // If no bunk data, create demo data
        const demoBunk = {
          _id: 'demo123',
          name: 'City Fuel Station',
          ownerName: 'Demo Owner',
          email: 'demo@petrogo.com',
          phone: '9876543210',
          address: '123 Main Street, Chennai, Tamil Nadu, 600001',
          licenseNumber: 'BUNK12345',
          gstNumber: '33AAAAA0000A1Z5',
          bankDetails: {
            bankName: 'HDFC Bank',
            accountNumber: '12345678901234',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Demo Owner'
          }
        };
        
        localStorage.setItem('bunkData', JSON.stringify(demoBunk));
        setBunk(demoBunk);
        
        setFormData({
          name: demoBunk.name,
          ownerName: demoBunk.ownerName,
          email: demoBunk.email,
          phone: demoBunk.phone,
          address: demoBunk.address,
          licenseNumber: demoBunk.licenseNumber,
          gstNumber: demoBunk.gstNumber,
          bankName: demoBunk.bankDetails.bankName,
          accountNumber: demoBunk.bankDetails.accountNumber,
          ifscCode: demoBunk.bankDetails.ifscCode,
          accountHolderName: demoBunk.bankDetails.accountHolderName
        });
      } else {
        setBunk(bunkData);
        
        setFormData({
          name: bunkData.name || '',
          ownerName: bunkData.ownerName || '',
          email: bunkData.email || '',
          phone: bunkData.phone || '',
          address: bunkData.address || '',
          licenseNumber: bunkData.licenseNumber || '',
          gstNumber: bunkData.gstNumber || '',
          bankName: bunkData.bankDetails?.bankName || '',
          accountNumber: bunkData.bankDetails?.accountNumber || '',
          ifscCode: bunkData.bankDetails?.ifscCode || '',
          accountHolderName: bunkData.bankDetails?.accountHolderName || bunkData.ownerName || ''
        });
      }

    } catch (error) {
      console.error('Error loading profile:', error);
      setErrorMessage('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bunk name is required';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    setErrorMessage('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update localStorage
      const updatedBunk = {
        ...bunk,
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        licenseNumber: formData.licenseNumber,
        gstNumber: formData.gstNumber,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          accountHolderName: formData.accountHolderName
        }
      };

      localStorage.setItem('bunkData', JSON.stringify(updatedBunk));
      setBunk(updatedBunk);

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="xl" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your bunk details and settings</p>
        </div>
        {!isEditing && (
          <Button
            variant="primary"
            icon="✏️"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white text-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg">
            ⛽
          </div>
          <div>
            <h2 className="text-2xl font-bold">{bunk?.name || 'Fuel Station'}</h2>
            <p className="text-orange-100">{bunk?.address?.split(',')[0] || 'Location'}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bunk Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.name}
            required
          />

          <Input
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.ownerName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.email}
            icon="📧"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.phone}
            icon="📱"
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.address}
              icon="📍"
              required
            />
          </div>

          <Input
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.licenseNumber}
          />

          <Input
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.gstNumber}
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">💳 Bank Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g., HDFC Bank"
          />

          <Input
            label="Account Holder Name"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Input
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            disabled={!isEditing}
            type={isEditing ? 'text' : 'password'}
            placeholder="••••••••••••"
          />

          <Input
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g., HDFC0001234"
          />
        </div>

        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important:</strong> Bank details are used for earnings withdrawal. Ensure they are correct.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => {
              setIsEditing(false);
              loadProfile();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}

      {/* Logout Button */}
      {!isEditing && (
        <div className="flex gap-4">
          <Button
            variant="danger"
            size="lg"
            fullWidth
            onClick={handleLogout}
            icon="🚪"
          >
            Logout
          </Button>
        </div>
      )}

    </div>
  );
}