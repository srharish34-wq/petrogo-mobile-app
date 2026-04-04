/**
 * RouteTracker Component
 * Display route progress and delivery tracking info
 * Location: partner/src/components/maps/RouteTracker.jsx
 */

import { useEffect, useState } from 'react';

export default function RouteTracker({ order, partnerLocation, onStatusUpdate }) {
  const [routeStatus, setRouteStatus] = useState('preparing');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  // Calculate elapsed time and progress
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      const now = new Date();
      const startTime = order.confirmedAt ? new Date(order.confirmedAt) : new Date(order.createdAt);
      const elapsed = Math.floor((now - startTime) / 1000); // in seconds

      setElapsedTime(elapsed);

      // Calculate progress based on time
      const estimatedMinutes = 30; // Default estimate
      const estimatedSeconds = estimatedMinutes * 60;
      const progress = Math.min((elapsed / estimatedSeconds) * 100, 100);

      setDeliveryProgress(progress);

      // Update status based on order state
      if (order.status === 'picked_up') {
        setRouteStatus('in_transit');
      } else if (order.status === 'in_transit') {
        setRouteStatus('approaching');
      } else if (order.status === 'delivered') {
        setRouteStatus('completed');
      }

      // Simulate speed (in real app, calculate from GPS coordinates)
      const speed = Math.random() * 40 + 20; // 20-60 km/h
      setCurrentSpeed(Math.round(speed));
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return 'bg-gray-100 text-gray-700';
      case 'in_transit':
        return 'bg-blue-100 text-blue-700';
      case 'approaching':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'preparing':
        return '📋 Preparing for Delivery';
      case 'in_transit':
        return '🚗 On the Way';
      case 'approaching':
        return '🎯 Approaching Destination';
      case 'completed':
        return '✅ Delivery Completed';
      default:
        return 'Tracking Delivery';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return '📋';
      case 'in_transit':
        return '🚗';
      case 'approaching':
        return '🎯';
      case 'completed':
        return '✅';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className={`rounded-2xl shadow-md p-6 ${getStatusColor(routeStatus)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl">{getStatusIcon(routeStatus)}</span>
          <div className="text-right">
            <p className="text-xs font-semibold opacity-75">Elapsed Time</p>
            <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
          </div>
        </div>
        <p className="text-xl font-bold">{getStatusLabel(routeStatus)}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-900">Delivery Progress</p>
          <span className="text-sm font-bold text-orange-600">{Math.round(deliveryProgress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
            style={{ width: `${deliveryProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-gray-900 mb-4">Route Timeline</h3>
        
        <div className="space-y-3">
          {/* Pickup Point */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                order?.pickedUpAt ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {order?.pickedUpAt ? '✓' : '○'}
              </div>
              <div className={`w-1 h-12 my-2 ${order?.pickedUpAt ? 'bg-green-300' : 'bg-gray-300'}`}></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Pickup from Bunk</p>
              <p className="text-sm text-gray-600">
                {order?.pickedUpAt 
                  ? new Date(order.pickedUpAt).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : 'Waiting...'}
              </p>
            </div>
          </div>

          {/* In Transit */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                order?.status === 'in_transit' || order?.status === 'delivered' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {order?.status === 'in_transit' || order?.status === 'delivered' ? '✓' : '○'}
              </div>
              <div className={`w-1 h-12 my-2 ${
                order?.status === 'in_transit' || order?.status === 'delivered'
                  ? 'bg-blue-300' 
                  : 'bg-gray-300'
              }`}></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">In Transit</p>
              <p className="text-sm text-gray-600">
                {order?.status === 'in_transit' || order?.status === 'delivered'
                  ? 'On the way to customer'
                  : 'Not started yet'}
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                order?.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {order?.status === 'delivered' ? '✓' : '○'}
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">
                {order?.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : 'Pending...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Info */}
      <div className="grid grid-cols-2 gap-3">
        {/* Speed */}
        <div className="bg-blue-50 rounded-lg p-3 text-center border-l-4 border-blue-500">
          <p className="text-xs text-gray-600 mb-1">Current Speed</p>
          <p className="text-2xl font-bold text-blue-600">{currentSpeed} km/h</p>
        </div>

        {/* Pickup Status */}
        <div className={`rounded-lg p-3 text-center border-l-4 ${
          order?.pickedUpAt 
            ? 'bg-green-50 border-green-500' 
            : 'bg-yellow-50 border-yellow-500'
        }`}>
          <p className="text-xs text-gray-600 mb-1">Fuel Status</p>
          <p className="text-lg font-bold">
            {order?.pickedUpAt ? '✅ Picked' : '⏳ Waiting'}
          </p>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
        <h4 className="font-bold text-gray-900 mb-2">🚗 Safety Tips</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>✓ Follow traffic rules</li>
          <li>✓ Drive safely and maintain speed limits</li>
          <li>✓ Call customer 5 minutes before arrival</li>
          <li>✓ Keep your vehicle secure</li>
        </ul>
      </div>
    </div>
  );
}