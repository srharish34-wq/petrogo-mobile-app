/**
 * Layout Component
 * Main layout wrapper with Navbar and Sidebar
 * Location: bunk/src/components/layout/Layout.jsx
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bunk, setBunk] = useState(null);

  useEffect(() => {
    // Get bunk data from localStorage
    const bunkData = JSON.parse(localStorage.getItem('bunkData') || '{}');
    setBunk(bunkData);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navbar */}
      <Navbar 
        bunk={bunk} 
        onToggleSidebar={toggleSidebar}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
}