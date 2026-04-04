/**
 * Safety Instructions Component
 * Displays safety guidelines and compliance info
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function SafetyInstructions({ isOpen, onClose, onAccept }) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleAccept = () => {
    if (acknowledged) {
      onAccept();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Safety Guidelines & Compliance"
      size="lg"
    >
      <div className="space-y-6">
        {/* Main Warning */}
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl flex-shrink-0">🚨</span>
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">
                Emergency Fuel Assistance Only
              </h3>
              <p className="text-red-800">
                This service is strictly for emergency situations where vehicles have run out of fuel. 
                Please use responsibly and only when necessary.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>🛡️</span>
            Safety Guidelines
          </h3>

          <div className="space-y-3">
            {[
              {
                icon: '🛢️',
                title: 'PESO-Approved Containers',
                description: 'All fuel is transported in Petroleum and Explosives Safety Organisation (PESO) approved safety containers only.'
              },
              {
                icon: '⚖️',
                title: 'Maximum Quantity Limit',
                description: 'Maximum 5 liters per delivery as per safety regulations. This limit is strictly enforced.'
              },
              {
                icon: '🚗',
                title: 'Diesel Preferred',
                description: 'Diesel is safer to transport due to lower volatility. We recommend diesel for emergency deliveries when possible.'
              },
              {
                icon: '🔐',
                title: 'OTP Verification',
                description: 'Delivery will only be completed after OTP verification to ensure fuel reaches the right person.'
              },
              {
                icon: '👤',
                title: 'Authorized Personnel',
                description: 'Only verified and licensed delivery partners handle fuel transportation.'
              },
              {
                icon: '📋',
                title: 'Legal Compliance',
                description: 'All operations comply with Indian fuel transportation and safety laws.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dos and Don'ts */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Do's */}
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Do's
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Stay with your vehicle during delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Verify partner identity before accepting fuel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Keep OTP ready for verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Ensure vehicle engine is off during fueling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Follow partner's safety instructions</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">❌</span>
              Don'ts
            </h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Don't smoke or use open flames nearby</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Don't leave the delivery location before fuel transfer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Don't request fuel for storage purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Don't handle fuel containers yourself</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Don't exceed the 5-liter safety limit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            Legal Disclaimer
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            By using this service, you acknowledge that you understand and agree to comply with all applicable 
            laws and regulations regarding fuel transportation in India. This service is provided for emergency 
            situations only. PetroGo and its partners follow all PESO guidelines and safety protocols.
          </p>
        </div>

        {/* Acknowledgment Checkbox */}
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-6 h-6 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">
                I acknowledge and accept
              </p>
              <p className="text-sm text-gray-700">
                I have read and understood the safety guidelines and legal compliance requirements. 
                I confirm that this is an emergency situation and I will comply with all safety instructions 
                during fuel delivery.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAccept}
            disabled={!acknowledged}
          >
            Accept & Continue
          </Button>
        </div>

        {/* Emergency Contact */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">
            For emergencies, contact:
          </p>
          <a href="tel:1800" className="text-lg font-bold text-primary-600 hover:text-primary-700">
            📞 1800-XXX-XXXX
          </a>
        </div>
      </div>
    </Modal>
  );
}