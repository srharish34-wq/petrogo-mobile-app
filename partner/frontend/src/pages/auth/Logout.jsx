/**
 * Logout Page
 * Handle partner logout
 * Location: partner/src/pages/auth/Logout.jsx
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all stored data
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userData');
        localStorage.removeItem('tempPhone');
        localStorage.removeItem('tempRegistration');
        
        console.log('✅ Logged out successfully');

        // Wait a moment for visual feedback
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1000);

      } catch (error) {
        console.error('❌ Logout error:', error);
        // Still navigate to login even if error occurs
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
        <Loader size="xl" />
        <p className="text-gray-600 font-semibold mt-6">
          Logging out...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          See you again soon! 👋
        </p>
      </div>
    </div>
  );
}
