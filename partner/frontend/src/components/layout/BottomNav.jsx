/**
 * Bottom Navigation Bar
 * Main navigation for mobile (Home, Orders, Earnings, Profile)
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, DollarSign, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: 'Home' 
    },
    { 
      path: '/orders', 
      icon: Package, 
      label: 'Orders' 
    },
    { 
      path: '/earnings', 
      icon: DollarSign, 
      label: 'Earnings' 
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile' 
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                  active 
                    ? 'text-orange-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;