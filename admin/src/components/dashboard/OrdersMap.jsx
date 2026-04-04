/**
 * Orders Map Component
 * Location: admin/src/components/dashboard/OrdersMap.jsx
 */

import { useEffect, useRef } from 'react';

export default function OrdersMap({ orders }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Load Google Maps
    if (!window.google && !document.querySelector('script[src*="maps.googleapis"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.google) {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    // Chennai center
    const center = { lat: 13.0827, lng: 80.2707 };

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 11,
      center: center,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Sample order locations (you can pass real orders data)
    const sampleOrders = [
      { id: 1, lat: 13.0418, lng: 80.2337, status: 'pending' },
      { id: 2, lat: 13.0850, lng: 80.2088, status: 'delivered' },
      { id: 3, lat: 13.0067, lng: 80.2574, status: 'in_progress' },
      { id: 4, lat: 12.9750, lng: 80.2207, status: 'pending' },
    ];

    // Add markers
    sampleOrders.forEach(order => {
      const color = order.status === 'delivered' ? 'green' : 
                    order.status === 'in_progress' ? 'orange' : 'red';
      
      new window.google.maps.Marker({
        position: { lat: order.lat, lng: order.lng },
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2
        },
        title: `Order #${order.id}`
      });
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Orders Map</h3>
          <p className="text-sm text-gray-500">Real-time order tracking</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Delivered</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
      />
    </div>
  );
}