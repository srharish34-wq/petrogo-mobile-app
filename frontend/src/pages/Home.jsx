/**
 * Home Page
 * Landing page with hero section and features
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoginModal from '../components/auth/LoginModal';
import Button from '../components/common/Button';

export default function Home() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = authService.isLoggedIn();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/emergency');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-orange-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Emergency Badge */}
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="text-2xl animate-pulse">🚨</span>
              <span className="font-semibold">24/7 Emergency Fuel Assistance</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
              Ran Out of Fuel?
              <br />
              <span className="text-yellow-300">We've Got You Covered!</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-10 text-white text-opacity-90 max-w-2xl mx-auto animate-fade-in">
              Emergency fuel delivery to your location in 30-45 minutes. 
              Safe, legal, and reliable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all"
              >
                <span className="text-2xl mr-2">⚡</span>
                Request Fuel Now
              </Button>
              
              {!isLoggedIn && (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Login / Sign Up
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              {[
                { icon: '🚗', value: '10,000+', label: 'Deliveries' },
                { icon: '⭐', value: '4.8/5', label: 'Rating' },
                { icon: '⏱️', value: '30 min', label: 'Avg. Time' }
              ].map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get emergency fuel delivered in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                icon: '📱',
                title: 'Request Fuel',
                description: 'Select fuel type, quantity, and confirm your location'
              },
              {
                step: '2',
                icon: '⛽',
                title: 'Bunk Confirms',
                description: 'Nearest petrol bunk confirms your order'
              },
              {
                step: '3',
                icon: '🚴',
                title: 'Partner Assigned',
                description: 'Verified delivery partner picks up fuel'
              },
              {
                step: '4',
                icon: '✅',
                title: 'Delivered',
                description: 'Fuel delivered to your location with OTP verification'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                  {item.step}
                </div>

                {/* Card */}
                <div className="bg-gray-50 rounded-2xl p-8 pt-12 hover:shadow-xl transition-all transform hover:-translate-y-2">
                  <div className="text-6xl mb-4 text-center">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose PetroGo?
            </h2>
            <p className="text-xl text-gray-600">
              Safe, Legal, and Reliable Emergency Fuel Assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🛡️',
                title: 'PESO Approved',
                description: 'All fuel transported in Petroleum and Explosives Safety Organisation approved containers'
              },
              {
                icon: '⚡',
                title: 'Fast Delivery',
                description: 'Average delivery time of 30-45 minutes. Available 24/7 for emergencies'
              },
              {
                icon: '💯',
                title: 'Quality Assured',
                description: 'Fuel directly from authorized petrol bunks. No adulteration, guaranteed'
              },
              {
                icon: '🔐',
                title: 'Secure Payment',
                description: 'Multiple payment options including cash on delivery. Safe and secure'
              },
              {
                icon: '👤',
                title: 'Verified Partners',
                description: 'All delivery partners are verified, licensed, and background checked'
              },
              {
                icon: '📱',
                title: 'Live Tracking',
                description: 'Track your delivery in real-time. Know exactly when fuel will arrive'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
            <div className="flex items-start gap-6">
              <div className="text-6xl flex-shrink-0">⚠️</div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Safety & Legal Compliance
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start gap-3">
                    <span className="text-xl">✓</span>
                    <span>Emergency fuel assistance only - for vehicles that have run out of fuel</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-xl">✓</span>
                    <span>Maximum 5 liters per delivery as per safety regulations</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-xl">✓</span>
                    <span>PESO-approved safety containers used for all deliveries</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-xl">✓</span>
                    <span>Diesel preferred for safety due to lower volatility</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-xl">✓</span>
                    <span>OTP verification mandatory at delivery point</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Need Fuel Right Now?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Don't wait! Get emergency fuel delivered to your location in minutes.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
          >
            <span className="text-2xl mr-2">🚗</span>
            Request Emergency Fuel
          </Button>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => navigate('/emergency')}
      />
    </div>
  );
}