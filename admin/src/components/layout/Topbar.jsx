/**
 * Topbar Component - FIXED VERSION
 * Location: admin/src/components/layout/Topbar.jsx
 */

import { useState, useEffect, useRef } from 'react';

export default function Topbar({ onMenuClick }) {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminName = adminData.name || 'Admin User';
  const adminEmail = adminData.email || 'admin@petrogo.com';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfile]);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white shadow-md z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Side - Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-2xl text-gray-700 hover:text-orange-600 transition"
        >
          ☰
        </button>

        {/* Center - Page Title */}
        <div className="hidden lg:block">
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>

        {/* Right Side - User Info */}
        <div className="relative ml-auto" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-gray-900">{adminName}</p>
              <p className="text-xs text-gray-600">{adminEmail}</p>
            </div>
            <span className="text-gray-600">▼</span>
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfile(false)}
              >
                ⚙️ Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => setShowProfile(false)}
              >
                🚪 Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}