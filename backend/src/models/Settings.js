/**
 * Settings Model
 * App-wide settings and configurations
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Setting Type (only one document with type 'app_settings')
  type: {
    type: String,
    default: 'app_settings',
    unique: true
  },
  
  // Fuel Pricing
  fuelPrices: {
    diesel: {
      basePrice: {
        type: Number,
        default: 95,
        min: 0
      },
      lastUpdated: Date
    },
    petrol: {
      basePrice: {
        type: Number,
        default: 105,
        min: 0
      },
      lastUpdated: Date
    }
  },
  
  // Delivery Settings
  delivery: {
    maxFuelLimit: {
      type: Number,
      default: 5, // Liters
      min: 0.5,
      max: 10
    },
    deliveryRadius: {
      type: Number,
      default: 5000, // Meters (5 km)
      min: 1000,
      max: 20000
    },
    baseDeliveryCharge: {
      type: Number,
      default: 30,
      min: 0
    },
    perKmCharge: {
      type: Number,
      default: 10,
      min: 0
    },
    maxDeliveryCharge: {
      type: Number,
      default: 100,
      min: 0
    },
    emergencyFee: {
      type: Number,
      default: 50,
      min: 0
    }
  },
  
  // Commission Settings
  commission: {
    platform: {
      percentage: {
        type: Number,
        default: 5,
        min: 0,
        max: 20
      }
    },
    deliveryPartner: {
      percentage: {
        type: Number,
        default: 15,
        min: 0,
        max: 50
      }
    },
    petrolBunk: {
      percentage: {
        type: Number,
        default: 2,
        min: 0,
        max: 10
      }
    }
  },
  
  // OTP Settings
  otp: {
    length: {
      type: Number,
      default: 6,
      min: 4,
      max: 8
    },
    expiryMinutes: {
      type: Number,
      default: 10,
      min: 5,
      max: 30
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    }
  },
  
  // Order Settings
  order: {
    autoAssignPartner: {
      type: Boolean,
      default: true
    },
    partnerAcceptTimeout: {
      type: Number,
      default: 5, // Minutes
      min: 1,
      max: 15
    },
    deliverySLA: {
      type: Number,
      default: 45, // Minutes
      min: 15,
      max: 120
    },
    autoCancelTimeout: {
      type: Number,
      default: 30, // Minutes
      min: 10,
      max: 60
    }
  },
  
  // Partner Settings
  partner: {
    minRatingForOrders: {
      type: Number,
      default: 3.0,
      min: 0,
      max: 5
    },
    dailyEarningsLimit: {
      type: Number,
      default: 5000,
      min: 0
    },
    withdrawalMinAmount: {
      type: Number,
      default: 500,
      min: 100
    }
  },
  
  // Safety Settings
  safety: {
    containerType: {
      type: String,
      default: 'PESO-approved safety container'
    },
    maxFuelPerDelivery: {
      type: Number,
      default: 5
    },
    preferredFuel: {
      type: String,
      default: 'diesel',
      enum: ['diesel', 'petrol']
    },
    mandatoryOTPVerification: {
      type: Boolean,
      default: true
    }
  },
  
  // App Features
  features: {
    multiplePaymentMethods: {
      type: Boolean,
      default: true
    },
    cashOnDelivery: {
      type: Boolean,
      default: true
    },
    realTimeTracking: {
      type: Boolean,
      default: true
    },
    ratings: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  
  // Maintenance Mode
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'System is under maintenance. Please try again later.'
    },
    startTime: Date,
    endTime: Date
  },
  
  // Contact Information
  contact: {
    supportPhone: {
      type: String,
      default: '1800-XXX-XXXX'
    },
    supportEmail: {
      type: String,
      default: 'support@petrogo.com'
    },
    emergencyPhone: {
      type: String,
      default: '911'
    }
  },
  
  // Legal
  legal: {
    termsVersion: {
      type: String,
      default: '1.0'
    },
    privacyVersion: {
      type: String,
      default: '1.0'
    },
    lastUpdated: Date
  }

}, {
  timestamps: true
});

// Static method to get settings (create if not exists)
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ type: 'app_settings' });
  
  if (!settings) {
    settings = await this.create({ type: 'app_settings' });
  }
  
  return settings;
};

// Static method to update fuel prices
settingsSchema.statics.updateFuelPrices = async function(dieselPrice, petrolPrice) {
  const settings = await this.getSettings();
  
  if (dieselPrice) {
    settings.fuelPrices.diesel.basePrice = dieselPrice;
    settings.fuelPrices.diesel.lastUpdated = new Date();
  }
  
  if (petrolPrice) {
    settings.fuelPrices.petrol.basePrice = petrolPrice;
    settings.fuelPrices.petrol.lastUpdated = new Date();
  }
  
  await settings.save();
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;