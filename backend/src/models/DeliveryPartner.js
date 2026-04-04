/**
 * Delivery Partner Model
 * Separate model for detailed partner information
 */

const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Vehicle Details
  vehicle: {
    number: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['bike', 'scooter', 'car'],
      required: true
    },
    model: String,
    color: String
  },
  
  // License Details
  license: {
    number: {
      type: String,
      required: true,
      uppercase: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    imageUrl: String
  },
  
  // KYC Documents
  documents: {
    aadhaar: {
      number: {
        type: String,
        required: true,
        match: /^\d{12}$/
      },
      imageUrl: String
    },
    pan: {
      number: {
        type: String,
        uppercase: true
      },
      imageUrl: String
    },
    photo: String,
    addressProof: String
  },
  
  // KYC Status
  kycStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  
  kycRejectionReason: String,
  
  // Bank Details
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
    branch: String
  },
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: false
  },
  
  currentStatus: {
    type: String,
    enum: ['offline', 'available', 'busy', 'on_delivery'],
    default: 'offline'
  },
  
  // Current Location
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Performance Metrics
  performance: {
    totalDeliveries: {
      type: Number,
      default: 0
    },
    completedDeliveries: {
      type: Number,
      default: 0
    },
    cancelledDeliveries: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    onTimeDeliveryRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Earnings
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    withdrawn: {
      type: Number,
      default: 0
    },
    lastWithdrawal: Date
  },
  
  // Working Hours
  workingHours: {
    monday: { start: String, end: String, isWorking: Boolean },
    tuesday: { start: String, end: String, isWorking: Boolean },
    wednesday: { start: String, end: String, isWorking: Boolean },
    thursday: { start: String, end: String, isWorking: Boolean },
    friday: { start: String, end: String, isWorking: Boolean },
    saturday: { start: String, end: String, isWorking: Boolean },
    sunday: { start: String, end: String, isWorking: Boolean }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  
  // Account Status
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  blockReason: String,
  
  // Verification Dates
  verifiedAt: Date,
  lastActiveAt: Date

}, {
  timestamps: true
});

// Indexes
deliveryPartnerSchema.index({ user: 1 });
deliveryPartnerSchema.index({ currentLocation: '2dsphere' });
deliveryPartnerSchema.index({ kycStatus: 1 });
deliveryPartnerSchema.index({ currentStatus: 1 });
deliveryPartnerSchema.index({ isAvailable: 1 });

// Method to update location
deliveryPartnerSchema.methods.updateLocation = async function(longitude, latitude, address) {
  this.currentLocation.coordinates = [longitude, latitude];
  this.currentLocation.address = address;
  this.currentLocation.lastUpdated = new Date();
  await this.save();
};

// Method to calculate earnings
deliveryPartnerSchema.methods.addEarnings = async function(amount) {
  this.earnings.total += amount;
  this.earnings.thisMonth += amount;
  this.earnings.pending += amount;
  await this.save();
};

// Static method to find available partners near location
deliveryPartnerSchema.statics.findAvailableNearby = async function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    kycStatus: 'approved',
    currentStatus: 'available',
    isAvailable: true,
    isBlocked: false,
    'currentLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  }).populate('user', 'name phone profilePicture');
};

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartner;