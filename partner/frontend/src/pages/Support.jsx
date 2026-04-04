/**
 * Support Page
 * Help and customer support
 * Location: partner/src/pages/Support.jsx
 */

import { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function Support() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const topics = [
    { id: 'account', label: 'Account Issues', icon: '👤' },
    { id: 'payment', label: 'Payment & Earnings', icon: '💰' },
    { id: 'orders', label: 'Order Problems', icon: '📦' },
    { id: 'app', label: 'App Issues', icon: '📱' },
    { id: 'other', label: 'Other', icon: '❓' }
  ];

  const faqs = [
    {
      question: 'How do I get paid?',
      answer: 'Earnings are credited after successful delivery. You can withdraw once you reach ₹500.'
    },
    {
      question: 'How to accept orders?',
      answer: 'Go to Available Orders, view order details, and tap Accept Order button.'
    },
    {
      question: 'What if customer is not available?',
      answer: 'Call the customer first. If unreachable after 10 minutes, contact support.'
    },
    {
      question: 'How to go online/offline?',
      answer: 'Toggle your status from the Dashboard page. You must be online to receive orders.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTopic || !message) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In real app: await supportService.submitTicket({ topic: selectedTopic, message });
      
      setTimeout(() => {
        setSuccessMessage('Your message has been sent! We will respond within 24 hours.');
        setSelectedTopic('');
        setMessage('');
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
          <p className="text-gray-600">We're here to help you</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
            className="mb-4"
          />
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <a
            href="tel:+918888888888"
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 transition"
          >
            <span className="text-3xl">📞</span>
            <div>
              <p className="font-bold">Call Us</p>
              <p className="text-xs text-green-100">24/7 Support</p>
            </div>
          </a>

          <a
            href="https://wa.me/918888888888"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3 transition"
          >
            <span className="text-3xl">💬</span>
            <div>
              <p className="font-bold">WhatsApp</p>
              <p className="text-xs text-blue-100">Quick Chat</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Topic <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-3 rounded-lg border-2 font-semibold text-sm transition ${
                      selectedTopic === topic.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {topic.icon} {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={!selectedTopic || !message}
            >
              {isSubmitting ? 'Sending...' : '📨 Send Message'}
            </Button>

          </form>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💡 Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer"
              >
                <summary className="font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <p className="text-sm text-gray-600 mt-2">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <p className="font-bold text-red-900 mb-1">🚨 Emergency Support</p>
          <p className="text-sm text-red-700">
            For urgent issues during delivery, call:{' '}
            <a href="tel:+918888888888" className="font-bold underline">
              +91 88888 88888
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}