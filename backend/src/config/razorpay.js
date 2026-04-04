/**
 * Razorpay Configuration
 * Payment Gateway (Skip for now - we'll add later)
 */

// For now, we'll skip payment integration
// This is a placeholder for future implementation

const razorpayConfig = {
  // Will be implemented when adding payment features
  enabled: false,
  
  createOrder: async (amount) => {
    // Mock order creation for now
    return {
      id: 'order_' + Date.now(),
      amount: amount,
      currency: 'INR',
      status: 'created'
    };
  }
};

module.exports = razorpayConfig;