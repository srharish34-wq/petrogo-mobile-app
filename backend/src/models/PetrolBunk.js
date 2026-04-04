/**
 * Petrol Bunk Model
 * Manages fuel stations on the platform
 */

const mongoose = require('mongoose');
const { FUEL_TYPES } = require('../config/constants');

const petrolBunkSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Bunk name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  
  // Contact Information
  contactPerson: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  
  // Location
  address: {
    street: {
      type: String,
      required: true
    },
    landmark: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  
  // ✅ Service Area (3 km radius)
  serviceRadius: {
    type: Number,
    default: 3000, // in meters (3 km)
    min: 1000,
    max: 10000
  },
  
  // Fuel Availability
  fuelAvailability: {
    diesel: {
      available: {
        type: Boolean,
        default: true
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        default: 95 // Default price per liter
      },
      stock: {
        type: Number,
        default: 1000,
        min: 0
      }
    },
    petrol: {
      available: {
        type: Boolean,
        default: true
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        default: 105 // Default price per liter
      },
      stock: {
        type: Number,
        default: 1000,
        min: 0
      }
    }
  },
  
  // Operating Hours
  isOpen24x7: {
    type: Boolean,
    default: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  isPesoApproved: {
    type: Boolean,
    default: true,
    required: true
  },
  
  // Ratings
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
  
  // Statistics
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    completedOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  
  // Owner User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
petrolBunkSchema.index({ location: '2dsphere' });
petrolBunkSchema.index({ status: 1 });
petrolBunkSchema.index({ isVerified: 1 });

// Virtual for full address
petrolBunkSchema.virtual('fullAddress').get(function() {
  const { street, landmark, city, state, pincode } = this.address;
  const parts = [street, landmark, city, state, pincode].filter(Boolean);
  return parts.join(', ');
});

// Method to check fuel availability
petrolBunkSchema.methods.checkFuelAvailability = function(fuelType, quantity) {
  const fuel = this.fuelAvailability[fuelType];
  return fuel && fuel.available && fuel.stock >= quantity;
};

// ✅ Static method to find nearby bunks (default 3km)
petrolBunkSchema.statics.findNearbyBunks = async function(longitude, latitude, maxDistance = 3000) {
  return this.find({
    status: 'active',
    isVerified: true,
    isPesoApproved: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// ✅ Static method to find available bunks with specific fuel (3km radius)
petrolBunkSchema.statics.findAvailableBunks = async function(longitude, latitude, fuelType, quantity) {
  return this.find({
    status: 'active',
    isVerified: true,
    isPesoApproved: true,
    [`fuelAvailability.${fuelType}.available`]: true,
    [`fuelAvailability.${fuelType}.stock`]: { $gte: quantity },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: 3000 // 3 km
      }
    }
  });
};

const PetrolBunk = mongoose.model('PetrolBunk', petrolBunkSchema);

module.exports = PetrolBunk;