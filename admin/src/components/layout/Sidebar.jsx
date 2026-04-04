/**
 * Sidebar Component - FIXED VERSION
 * Location: admin/src/components/layout/Sidebar.jsx
 */

import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const navLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/users', icon: '👥', label: 'Users' },
    { to: '/delivery-partners', icon: '🚗', label: 'Delivery Partners' },
    { to: '/petrol-bunks', icon: '⛽', label: 'Petrol Bunks' },
    { to: '/orders', icon: '📦', label: 'Orders' },
    { to: '/payments', icon: '💰', label: 'Payments' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-orange-600">PetroGo Admin</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-2xl text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={() => onClose()}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <NavLink
            to="/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-semibold"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}