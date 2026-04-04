/**
 * Order Tracking Page - ENHANCED & FIXED VERSION
 * Track live order status with Google Maps, delivery partner details, and distance visualization
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

/**
 * ✅ FIXED: Convert address object to string
 */
const formatAddress = (addr) => {
  if (!addr) return '';
  
  // If it's a string, return it
  if (typeof addr === 'string') {
    return addr;
  }
  
  // If it's an object with fields, combine them
  if (typeof addr === 'object') {
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.pincode) parts.push(addr.pincode);
    if (addr.country) parts.push(addr.country);
    
    if (parts.length > 0) {
      return parts.filter(Boolean).join(', ');
    }
  }
  
  return '';
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [distance, setDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const mapRef = useRef(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc';

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(orderId);
      if (response.status === 'success') {
        const orderData = response.data.order;
        
        // ✅ FIXED: Format address immediately when fetching
        if (orderData.deliveryLocation) {
          orderData.deliveryLocation.address = formatAddress(orderData.deliveryLocation.address);
        }
        
        setOrder(orderData);
        
        // Set initial partner location if assigned
        if (orderData.deliveryPartner) {
          setPartnerLocation({
            latitude: orderData.deliveryPartner.currentLocation?.coordinates[1] || 13.0827,
            longitude: orderData.deliveryPartner.currentLocation?.coordinates[0] || 80.2707,
            timestamp: new Date()
          });
        }
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/');
      return;
    }
    fetchOrder();
  }, [orderId, navigate]);

  // Auto-refresh order status every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    try {
      if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
      
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    } catch (err) {
      console.error('Error calculating distance:', err);
      return 0;
    }
  };

  // Calculate estimated time
  const calculateEstimatedTime = (distanceKm) => {
    try {
      if (!distanceKm || distanceKm === 0) return 0;
      const avgSpeed = 40; // km/h
      const timeInHours = distanceKm / avgSpeed;
      const timeInMinutes = Math.round(timeInHours * 60);
      return timeInMinutes;
    } catch (err) {
      console.error('Error calculating time:', err);
      return 0;
    }
  };

  // Initialize Google Map
  const initializeMap = () => {
    if (!window.google || !document.getElementById('tracking-map')) {
      console.warn('Map element or Google Maps not available');
      return;
    }

    try {
      const mapElement = document.getElementById('tracking-map');
      
      // Get coordinates with fallback
      const customerLat = order?.deliveryLocation?.coordinates?.[1] || 13.0827;
      const customerLng = order?.deliveryLocation?.coordinates?.[0] || 80.2707;
      const bunkLat = order?.petrolBunk?.location?.coordinates?.[1] || 13.0827;
      const bunkLng = order?.petrolBunk?.location?.coordinates?.[0] || 80.2707;
      const partnerLat = partnerLocation?.latitude || customerLat;
      const partnerLng = partnerLocation?.longitude || customerLng;

      // Validate coordinates
      if (isNaN(customerLat) || isNaN(customerLng) || isNaN(bunkLat) || isNaN(bunkLng)) {
        console.warn('Invalid coordinates');
        return;
      }

      // Calculate distance
      const dist = calculateDistance(bunkLat, bunkLng, customerLat, customerLng);
      setDistance(dist);
      
      // Calculate estimated time
      const time = calculateEstimatedTime(dist);
      setEstimatedTime(time);

      // Create map
      const map = new window.google.maps.Map(mapElement, {
        zoom: 14,
        center: { lat: customerLat, lng: customerLng },
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true
      });

      mapRef.current = map;

      // Add customer location marker (red)
      new window.google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="2"/>
              <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">📍</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Add petrol bunk marker (green)
      new window.google.maps.Marker({
        position: { lat: bunkLat, lng: bunkLng },
        map: map,
        title: order?.petrolBunk?.name || 'Petrol Bunk',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#10B981" stroke="white" stroke-width="2"/>
              <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">⛽</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Add delivery partner marker if assigned (orange/yellow)
      if (order?.deliveryPartner && (order?.status === 'picked_up' || order?.status === 'in_transit')) {
        new window.google.maps.Marker({
          position: { lat: partnerLat, lng: partnerLng },
          map: map,
          title: order?.deliveryPartner?.name || 'Delivery Partner',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#F97316" stroke="white" stroke-width="2"/>
                <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🚗</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });
      }

      // Draw polyline from bunk to customer (orange line)
      new window.google.maps.Polyline({
        path: [
          { lat: bunkLat, lng: bunkLng },
          { lat: customerLat, lng: customerLng }
        ],
        geodesic: true,
        strokeColor: '#EA580C',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      });

      // Adjust map bounds
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: bunkLat, lng: bunkLng });
      bounds.extend({ lat: customerLat, lng: customerLng });
      if (order?.deliveryPartner) {
        bounds.extend({ lat: partnerLat, lng: partnerLng });
      }
      map.fitBounds(bounds);

      console.log('✅ Map initialized with route');
    } catch (err) {
      console.error('❌ Error initializing map:', err);
    }
  };

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      console.log('✅ Google Maps loaded');
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps');
    };
    document.head.appendChild(script);

    return () => {
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      } catch (err) {
        console.warn('Error removing script:', err);
      }
    };
  }, []);

  // Initialize map when loaded and order data is available
  useEffect(() => {
    if (mapLoaded && order && !['cancelled', 'completed'].includes(order?.status)) {
      initializeMap();
    }
  }, [mapLoaded, order, partnerLocation]);

  // Mock partner location updates
  useEffect(() => {
    if (order?.deliveryPartner && (order?.status === 'in_transit' || order?.status === 'picked_up')) {
      const interval = setInterval(() => {
        const customerLat = order?.deliveryLocation?.coordinates?.[1] || 13.0827;
        const customerLng = order?.deliveryLocation?.coordinates?.[0] || 80.2707;
        
        setPartnerLocation({
          latitude: customerLat + (Math.random() - 0.5) * 0.02,
          longitude: customerLng + (Math.random() - 0.5) * 0.02,
          timestamp: new Date()
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [order?.status, order?.deliveryPartner]);

  // Show OTP modal when delivered
  useEffect(() => {
    if (order?.status === 'delivered' && !order.deliveryOtp?.verified) {
      setShowOTPModal(true);
    }
  }, [order?.status]);

  // Verify delivery OTP
  const handleVerifyOTP = async () => {
    setActionLoading(true);
    setError('');

    try {
      const response = await orderService.verifyDeliveryOTP(orderId, otp);
      
      if (response.status === 'success') {
        setShowOTPModal(false);
        setOrder(response.data.order);
        
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel order
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      const response = await orderService.cancelOrder(orderId, cancelReason);
      
      if (response.status === 'success') {
        setShowCancelModal(false);
        setOrder(response.data.order);
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/orders')} variant="primary">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Order completed
  if (order?.status === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl text-center animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Order Completed!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for using PetroGo. Your fuel has been delivered successfully.
          </p>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-bold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fuel Delivered</p>
                <p className="font-bold text-gray-900 capitalize">
                  {order.fuelDetails?.quantity}L {order.fuelDetails?.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-primary-600">
                  ₹{order.charges?.totalAmount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered At</p>
                <p className="font-bold text-gray-900">
                  {new Date(order.deliveredAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/orders')}
              variant="secondary"
              size="lg"
              fullWidth
            >
              View All Orders
            </Button>
            <Button
              onClick={() => navigate('/emergency')}
              variant="primary"
              size="lg"
              fullWidth
            >
              New Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Order cancelled
  if (order?.status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl text-center">
          <div className="text-8xl mb-6">❌</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Order Cancelled
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Your order #{order.orderNumber} has been cancelled.
          </p>
          
          {order.cancellation?.reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-red-700">
                <strong>Reason:</strong> {order.cancellation.reason}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/orders')}
              variant="secondary"
              size="lg"
              fullWidth
            >
              View Orders
            </Button>
            <Button
              onClick={() => navigate('/emergency')}
              variant="primary"
              size="lg"
              fullWidth
            >
              New Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Track Your Order
              </h1>
              <p className="text-gray-600 mt-1">
                Order #{order?.orderNumber}
              </p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div id="tracking-map" className="h-96 w-full bg-gray-200"></div>
              
              {/* Route Info */}
              <div className="p-6 border-t-2 border-orange-300 bg-gradient-to-r from-orange-50 to-white">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {distance.toFixed(2)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {estimatedTime} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-2xl font-bold text-green-600 capitalize">
                      {order?.status?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Progress</h3>
              <div className="space-y-4">
                {/* Order Placed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {order?.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Confirmed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      order?.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">
                      {order?.confirmedAt ? new Date(order.confirmedAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Pending...'}
                    </p>
                  </div>
                </div>

                {/* Partner Assigned */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      order?.deliveryPartner ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {order?.deliveryPartner ? '✓' : '○'}
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Partner Assigned</p>
                    <p className="text-sm text-gray-600">
                      {order?.deliveryPartner ? `${order.deliveryPartner.name}` : 'Assigning partner...'}
                    </p>
                  </div>
                </div>

                {/* In Transit */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      order?.status === 'in_transit' || order?.status === 'delivered' ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {order?.status === 'in_transit' || order?.status === 'delivered' ? '✓' : '○'}
                    </div>
                    <div className="w-1 h-12 bg-gray-300 my-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">In Transit</p>
                    <p className="text-sm text-gray-600">
                      {order?.status === 'in_transit' || order?.status === 'delivered' ? 'On the way' : 'Pending...'}
                    </p>
                  </div>
                </div>

                {/* Delivered */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      order?.status === 'delivered' || order?.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {order?.status === 'delivered' || order?.status === 'completed' ? '✓' : '○'}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">
                      {order?.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Pending...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Delivery Partner Details */}
            {order?.deliveryPartner && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🚗 Delivery Partner</h3>
                <div className="space-y-4">
                  {/* Partner Avatar */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl text-white">
                      👤
                    </div>
                  </div>

                  {/* Partner Info */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{order.deliveryPartner.name || 'Partner'}</p>
                    <p className="text-sm text-gray-600">{order.deliveryPartner.phone || 'N/A'}</p>
                  </div>

                  {/* Rating */}
                  {order.deliveryPartner.rating && (
                    <div className="flex justify-center items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <p className="font-semibold text-gray-900">
                        {order.deliveryPartner.rating.toFixed(1)} / 5.0
                      </p>
                    </div>
                  )}

                  {/* Vehicle Info */}
                  <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="font-bold text-gray-900">{order.deliveryPartner.vehicleType || 'Bike'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License</span>
                      <span className="font-bold text-gray-900 font-mono">{order.deliveryPartner.vehiclePlate || 'TN 01 AB 1234'}</span>
                    </div>
                  </div>

                  {/* Call Button */}
                  {order.deliveryPartner.phone && (
                    <a
                      href={`tel:${order.deliveryPartner.phone}`}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <span>📱</span> Call Partner
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Petrol Bunk Details */}
            {order?.petrolBunk && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">⛽ Petrol Bunk</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-bold text-gray-900">{order.petrolBunk.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm text-gray-700">
  {typeof order.petrolBunk.address === 'string' 
    ? order.petrolBunk.address 
    : formatAddress(order.petrolBunk.address) || 'N/A'}
</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    {order.petrolBunk.phone ? (
                      <a href={`tel:${order.petrolBunk.phone}`} className="text-blue-600 hover:underline">
                        {order.petrolBunk.phone}
                      </a>
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-bold text-gray-900 capitalize">{order?.fuelDetails?.type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-bold text-gray-900">{order?.fuelDetails?.quantity || 'N/A'} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price/L</span>
                  <span className="font-bold text-gray-900">₹{order?.fuelDetails?.pricePerLiter || 'N/A'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-600 font-semibold">Total</span>
                  <span className="font-bold text-orange-600 text-lg">₹{order?.charges?.totalAmount || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order?.deliveryLocation && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Delivery Address</h3>
                <p className="text-sm text-gray-700 mb-3">
                  {typeof order.deliveryLocation.address === 'string' 
                    ? order.deliveryLocation.address 
                    : formatAddress(order.deliveryLocation.address) || 'Address not available'}
                </p>
                {order.deliveryLocation.landmark && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Landmark:</strong> {order.deliveryLocation.landmark}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cancel Button */}
            {order && ['pending', 'confirmed'].includes(order?.status) && (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="danger"
                size="lg"
                fullWidth
              >
                ❌ Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Modal
        isOpen={showOTPModal}
        onClose={() => {}}
        title="🎉 Fuel Delivered!"
        size="sm"
      >
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-center">
              Please verify the OTP provided by the delivery partner to complete your order.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Delivery OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            onClick={handleVerifyOTP}
            variant="primary"
            size="lg"
            fullWidth
            loading={actionLoading}
            disabled={otp.length !== 6}
          >
            Verify & Complete Order
          </Button>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order?"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-gray-700">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cancellation Reason
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please tell us why you're cancelling..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => setShowCancelModal(false)}
              variant="secondary"
              size="lg"
              fullWidth
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="danger"
              size="lg"
              fullWidth
              loading={actionLoading}
              disabled={!cancelReason.trim()}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}