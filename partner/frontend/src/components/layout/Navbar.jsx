/**
 * Top Navigation Bar
 * Shows partner status, notifications, and profile
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePartner } from '../../hooks/usePartner';
import { Bell, Menu, User, Power } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { partner, toggleAvailability } = usePartner();
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = () => {
    if (!partner?.isAvailable) return 'bg-gray-400';
    switch (partner?.currentStatus) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'on_delivery': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!partner?.isAvailable) return 'Offline';
    switch (partner?.currentStatus) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'on_delivery': return 'On Delivery';
      default: return 'Offline';
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleAvailability();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              PG
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">PetroGo Partner</h1>
              <p className="text-xs text-gray-500">{user?.name || 'Partner'}</p>
            </div>
          </div>

          {/* Status Toggle & Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Online/Offline Toggle */}
            <button
              onClick={handleToggleStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all ${getStatusColor()}`}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>{getStatusText()}</span>
            </button>

            {/* Notifications */}
            <button 
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Menu size={24} />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Power size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;