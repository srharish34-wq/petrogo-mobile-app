/**
 * Active Delivery Page - COMPLETE FIXED
 * Partner sees OTP and tells customer, customer enters OTP in their panel
 * Location: partner/frontend/src/pages/ActiveDelivery.jsx
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const GOOGLE_MAPS_API_KEY = 'AIzaSyDTF7m5liUyf16q3tcj7JQvu0AB3Gesroc';

export default function ActiveDelivery() {
  const navigate = useNavigate();
  const { orderId: urlOrderId } = useParams();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Get orderId from URL params
  const orderId = urlOrderId;
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Partner location
  const [partnerLocation, setPartnerLocation] = useState(null);
  
  // Delivery progress checkboxes
  const [progress, setProgress] = useState({
    arrivedAtBunk: false,
    collectedFuel: false,
    onTheWay: false,
    reachedCustomer: false,
    deliveredFuel: false,
    paymentCollected: false
  });

  const [customerOTP, setCustomerOTP] = useState('');

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const partnerId = userData._id;

  // Load Google Maps Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Maps loaded');
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps');
      setError('Failed to load Google Maps - Check API key billing');
    };
    
    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch order details
  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      
      if (response.data.status === 'success') {
        const orderData = response.data.data.order;
        setOrder(orderData);
        
        // If order has OTP, show it
        if (orderData.deliveryOtp?.code) {
          setCustomerOTP(orderData.deliveryOtp.code);
        }
        
        console.log('✅ Order loaded:', orderData);
      }
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Get partner's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPartnerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setPartnerLocation({ lat: 13.0827, lng: 80.2707 });
        }
      );

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPartnerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setPartnerLocation({ lat: 13.0827, lng: 80.2707 });
    }
  }, []);

  // Initialize Google Map
  const initializeMap = () => {
    if (!window.google || !mapRef.current || !order || !partnerLocation) {
      return;
    }

    try {
      const bunkLat = order.petrolBunk?.location?.coordinates?.[1] || 13.0827;
      const bunkLng = order.petrolBunk?.location?.coordinates?.[0] || 80.2707;
      
      const customerLat = order.deliveryLocation?.coordinates?.[1] || 13.0827;
      const customerLng = order.deliveryLocation?.coordinates?.[0] || 80.2707;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 13,
        center: partnerLocation,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: false
      });

      mapInstanceRef.current = map;

      // Partner marker (orange)
      new window.google.maps.Marker({
        position: partnerLocation,
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#F97316',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        },
        label: { text: '🚗', fontSize: '18px' }
      });

      // Petrol bunk marker (green)
      new window.google.maps.Marker({
        position: { lat: bunkLat, lng: bunkLng },
        map: map,
        title: order.petrolBunk?.name || 'Petrol Bunk',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        },
        label: { text: '⛽', fontSize: '18px' }
      });

      // Customer marker (red)
      new window.google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map: map,
        title: 'Customer Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3
        },
        label: { text: '🏠', fontSize: '18px' }
      });

      // Blue route line
      const routePath = [
        partnerLocation,
        { lat: bunkLat, lng: bunkLng },
        { lat: customerLat, lng: customerLng }
      ];

      new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      });

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(partnerLocation);
      bounds.extend({ lat: bunkLat, lng: bunkLng });
      bounds.extend({ lat: customerLat, lng: customerLng });
      map.fitBounds(bounds);

      console.log('✅ Map initialized');
    } catch (err) {
      console.error('❌ Error initializing map:', err);
      setError('Failed to load map');
    }
  };

  useEffect(() => {
    if (mapLoaded && order && partnerLocation) {
      initializeMap();
    }
  }, [mapLoaded, order, partnerLocation]);

  // Handle checkbox change
  const handleProgressChange = async (key) => {
    const newProgress = { ...progress, [key]: !progress[key] };
    setProgress(newProgress);

    try {
      if (key === 'arrivedAtBunk' && newProgress.arrivedAtBunk) {
        await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'partner_at_bunk' });
      } else if (key === 'collectedFuel' && newProgress.collectedFuel) {
        await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'picked_up' });
      } else if (key === 'onTheWay' && newProgress.onTheWay) {
        await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'in_transit' });
      } else if (key === 'reachedCustomer' && newProgress.reachedCustomer) {
        await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'arrived_at_customer' });
      } else if (key === 'deliveredFuel' && newProgress.deliveredFuel) {
        await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'delivered' });
        
        // Fetch updated order to get OTP
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        const updatedOrder = response.data.data.order;
        setOrder(updatedOrder);
        
        const otp = updatedOrder.deliveryOtp?.code || '1234';
        setCustomerOTP(otp);
        
        alert(`✅ Fuel Delivered!\n\n📱 Customer OTP: ${otp}\n\nTell this OTP to the customer.\nThey will enter it in their app to confirm delivery.`);
      }
      
      console.log('✅ Status updated');
      fetchOrder();
    } catch (err) {
      console.error('❌ Error updating status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Delivery</h1>
              <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={() => navigate('/my-orders')}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
            <button onClick={() => setError('')} className="text-red-600 mt-2">✕</button>
          </div>
        )}

        {/* Customer OTP Display - Shows after delivery */}
        {customerOTP && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="text-center">
              <p className="text-lg font-bold mb-2">📱 Customer OTP</p>
              <p className="text-5xl font-bold tracking-widest mb-2">{customerOTP}</p>
              <p className="text-sm text-green-100">Tell this OTP to the customer</p>
            </div>
          </div>
        )}

        {/* Google Map */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div 
            ref={mapRef} 
            className="h-96 w-full bg-gray-200"
          ></div>
          
          {/* Map Legend */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-around text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                <span className="text-gray-700">You</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛽</span>
                <span className="text-gray-700">Bunk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="text-gray-700">Customer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">📦 Order Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fuel</p>
              <p className="font-bold">{order.fuelDetails?.type?.toUpperCase()} - {order.fuelDetails?.quantity}L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-bold">{order.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-bold text-orange-600">{(order.distance?.toCustomer || 1).toFixed(2)} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Earning</p>
              <p className="font-bold text-green-600">₹{order.charges?.deliveryCharge || 0}</p>
            </div>
          </div>
        </div>

        {/* Delivery Progress */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">📋 Delivery Progress</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.arrivedAtBunk}
                onChange={() => handleProgressChange('arrivedAtBunk')}
                className="w-5 h-5 text-orange-600 rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">⛽ Arrived at Petrol Bunk</p>
                <p className="text-xs text-gray-600">Check when you reach</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.collectedFuel}
                onChange={() => handleProgressChange('collectedFuel')}
                disabled={!progress.arrivedAtBunk}
                className="w-5 h-5 text-orange-600 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <p className="font-semibold">✅ Collected Fuel</p>
                <p className="text-xs text-gray-600">After collecting fuel</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.onTheWay}
                onChange={() => handleProgressChange('onTheWay')}
                disabled={!progress.collectedFuel}
                className="w-5 h-5 text-orange-600 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <p className="font-semibold">🚗 On the Way</p>
                <p className="text-xs text-gray-600">Started delivery</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.reachedCustomer}
                onChange={() => handleProgressChange('reachedCustomer')}
                disabled={!progress.onTheWay}
                className="w-5 h-5 text-orange-600 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <p className="font-semibold">📍 Reached Customer</p>
                <p className="text-xs text-gray-600">At delivery location</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.deliveredFuel}
                onChange={() => handleProgressChange('deliveredFuel')}
                disabled={!progress.reachedCustomer}
                className="w-5 h-5 text-orange-600 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <p className="font-semibold">⛽ Delivered Fuel</p>
                <p className="text-xs text-gray-600">Shows OTP for customer</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={progress.paymentCollected}
                onChange={() => {
                  setProgress({ ...progress, paymentCollected: true });
                  axios.patch(`${API_URL}/orders/${orderId}/status`, { status: 'completed' })
                    .then(() => {
                      alert('🎉 Order Completed!\n\nGreat job! Redirecting...');
                      setTimeout(() => navigate('/my-orders'), 2000);
                    });
                }}
                disabled={!progress.deliveredFuel}
                className="w-5 h-5 text-orange-600 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <p className="font-semibold">💰 Payment Collected</p>
                <p className="text-xs text-gray-600">After customer confirms</p>
              </div>
            </label>
          </div>
        </div>

        {/* Call Button */}
        <button
          onClick={() => window.location.href = `tel:${order.customer?.phone}`}
          className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">📞</span>
          Call Customer
        </button>

      </div>
    </div>
  );
}