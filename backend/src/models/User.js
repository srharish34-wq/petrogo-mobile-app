/**
 * User Model
 * Handles customers, delivery partners, and admins
 */

const mongoose = require('mongoose');
const { USER_ROLES, PARTNER_STATUS } = require('../config/constants');

const userSchema = new mongoose.Schema({
  // Basic Information
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
  },
  
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  
  // Role & Status
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER,
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile Picture
  profilePicture: {
    type: String,
    default: null
  },
  
  // Location (current location)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Delivery Partner Specific Fields
  partnerDetails: {
    vehicleNumber: String,
    vehicleType: {
      type: String,
      enum: ['bike', 'scooter', 'car']
    },
    licenseNumber: String,
    status: {
      type: String,
      enum: Object.values(PARTNER_STATUS),
      default: PARTNER_STATUS.OFFLINE
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalDeliveries: {
      type: Number,
      default: 0
    },
    earnings: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 }
    }
  },
  
  // Timestamps
  lastLoginAt: {
    type: Date
  },
  
  lastActiveAt: {
    type: Date
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'partnerDetails.currentLocation': '2dsphere' });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, pincode } = this.address;
  return [street, city, state, pincode].filter(Boolean).join(', ');
});

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Static method to find nearby partners
userSchema.statics.findNearbyPartners = async function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    role: USER_ROLES.DELIVERY_PARTNER,
    'partnerDetails.status': PARTNER_STATUS.AVAILABLE,
    isActive: true,
    'partnerDetails.currentLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;