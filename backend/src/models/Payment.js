/**
 * Payment Model
 * Handles payment transactions (simplified for now)
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
  // Order Reference
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  
  // Customer
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Amount Details
  amount: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    paid: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Payment Status
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
    required: true
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['cash', 'online', 'upi', 'card'],
    default: 'cash'
  },
  
  // Transaction ID (for online payments)
  transactionId: {
    type: String,
    sparse: true
  },
  
  // Timestamps
  paidAt: Date,
  
  // Notes
  notes: String

}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;