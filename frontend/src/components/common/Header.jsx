/**
 * Header Component
 * Navigation header for the app
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🚗</div>
            <span className="text-2xl font-bold text-primary-600">
              PetroGo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Home
            </Link>
            
            {isLoggedIn && (
              <>
                <Link 
                  to="/emergency" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Request Fuel
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  My Orders
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="text-sm">
                  <div className="text-gray-600">Welcome,</div>
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/emergency"
                    className="text-gray-700 hover:text-primary-600 font-medium py-2 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Request Fuel
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary-600 font-medium py-2 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 font-medium py-2 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="pt-3 border-t">
                    <div className="text-sm mb-2">
                      <div className="text-gray-600">Welcome,</div>
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}