/**
 * DeliveryMap Component
 * Interactive Google Map for delivery tracking
 * Location: partner/src/components/maps/DeliveryMap.jsx
 */

import { useEffect, useRef, useState } from 'react';

export default function DeliveryMap({ 
  order, 
  partnerLocation, 
  onLocationChange,
  showRoute = true 
}) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [distance, setDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  // ✅ FIXED: Use environment variable instead of hardcoded key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('❌ Google Maps API key not found. Add VITE_GOOGLE_MAPS_API_KEY to .env file');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY;
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
  }, [GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (!mapLoaded || !order || !document.getElementById('delivery-map')) {
      return;
    }

    try {
      const customerLat = order.deliveryLocation?.coordinates?.[1] || 13.0827;
      const customerLng = order.deliveryLocation?.coordinates?.[0] || 80.2707;
      const partnerLat = partnerLocation?.latitude || 13.0827;
      const partnerLng = partnerLocation?.longitude || 80.2707;

      const map = new window.google.maps.Map(
        document.getElementById('delivery-map'),
        {
          zoom: 15,
          center: { lat: partnerLat, lng: partnerLng },
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true
        }
      );

      new window.google.maps.Marker({
        position: { lat: partnerLat, lng: partnerLng },
        map: map,
        title: 'Your Current Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">' +
            '<circle cx="25" cy="25" r="22" fill="#F97316" stroke="white" stroke-width="2"/>' +
            '<circle cx="25" cy="25" r="6" fill="white"/>' +
            '<polygon points="25,5 35,20 25,15 15,20" fill="white"/>' +
            '</svg>'
          ),
          scaledSize: new window.google.maps.Size(50, 50)
        }
      });

      new window.google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map: map,
        title: 'Delivery Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">' +
            '<circle cx="25" cy="25" r="22" fill="#EF4444" stroke="white" stroke-width="2"/>' +
            '<circle cx="25" cy="25" r="8" fill="white"/>' +
            '<circle cx="25" cy="25" r="4" fill="#EF4444"/>' +
            '</svg>'
          ),
          scaledSize: new window.google.maps.Size(50, 50)
        }
      });

      if (showRoute) {
        const directionsService = new window.google.maps.DirectionsService();
        const renderer = new window.google.maps.DirectionsRenderer({
          map: map,
          polylineOptions: {
            strokeColor: '#F97316',
            strokeOpacity: 1,
            strokeWeight: 5,
            geodesic: true
          },
          suppressMarkers: true
        });

        setDirectionsRenderer(renderer);

        const request = {
          origin: new window.google.maps.LatLng(partnerLat, partnerLng),
          destination: new window.google.maps.LatLng(customerLat, customerLng),
          travelMode: window.google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            renderer.setDirections(result);

            const route = result.routes[0];
            const leg = route.legs[0];

            const distanceKm = (leg.distance.value / 1000).toFixed(2);
            const timeMin = Math.round(leg.duration.value / 60);

            setDistance(parseFloat(distanceKm));
            setEstimatedTime(timeMin);

            console.log('📍 Distance: ' + distanceKm + ' km, Time: ' + timeMin + ' min');

            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(new window.google.maps.LatLng(partnerLat, partnerLng));
            bounds.extend(new window.google.maps.LatLng(customerLat, customerLng));
            map.fitBounds(bounds);
          } else {
            console.error('Directions request failed:', status);
          }
        });
      } else {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(partnerLat, partnerLng));
        bounds.extend(new window.google.maps.LatLng(customerLat, customerLng));
        map.fitBounds(bounds);
      }

      console.log('✅ Map initialized');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }
  }, [mapLoaded, order, partnerLocation, showRoute]);

  // ✅ FIXED: Pre-calculate phone href
  const customerPhone = order?.customer?.phone || '';
  const phoneHref = customerPhone ? 'tel:' + customerPhone : '#';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div id="delivery-map" className="w-full h-96 bg-gray-200"></div>
      </div>

      {distance > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Distance</p>
              <p className="text-2xl font-bold text-orange-600">
                {distance.toFixed(2)} km
              </p>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Est. Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {estimatedTime} min
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Speed</p>
              <p className="text-2xl font-bold text-green-600">
                {distance > 0 ? Math.round((distance / estimatedTime) * 60) : 0} km/h
              </p>
            </div>
          </div>
        </div>
      )}

      {order && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-l-4 border-orange-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivering to</p>
              <p className="font-bold text-gray-900">
                {order.customer?.name || 'Customer'}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                📍 {order.deliveryLocation?.address?.split(',')[0] || 'Location'}
              </p>
            </div>
            {customerPhone && (
              <a
                href={phoneHref}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition"
                title="Call customer"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.917 1.888 3.386 3.804 3.804l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}