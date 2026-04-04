/**
 * 404 Not Found Page
 * Shown when route doesn't exist
 */

import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="mb-8 animate-bounce-slow">
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-600 mb-4">
            404
          </div>
          <div className="text-6xl mb-6">🚗💨</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Oops! Wrong Turn
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Looks like you've run out of road! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Here's what you can do:
          </h2>
          <ul className="space-y-3 text-left max-w-md mx-auto">
            {[
              { icon: '🏠', text: 'Go back to homepage', action: '/' },
              { icon: '⚡', text: 'Request emergency fuel', action: '/emergency' },
              { icon: '📦', text: 'Check your orders', action: '/orders' },
              { icon: '👤', text: 'View your profile', action: '/profile' }
            ].map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.action)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-left group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-gray-700 group-hover:text-primary-600 font-medium">
                    {item.text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            size="lg"
          >
            ← Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
          >
            🏠 Go Home
          </Button>
        </div>

        {/* Fun Message */}
        <div className="mt-12 bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 max-w-lg mx-auto">
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">💡</span>
            <div className="text-left">
              <p className="font-semibold text-orange-900 mb-2">
                Pro Tip:
              </p>
              <p className="text-sm text-orange-800">
                If you're actually out of fuel and stranded, use our emergency fuel delivery service to get back on the road quickly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}