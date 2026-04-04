/**
 * Layout Component
 * Main layout wrapper with navbar and bottom navigation
 * Location: partner/src/components/layout/Layout.jsx
 */

import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}