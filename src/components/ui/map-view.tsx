
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if the script is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setError('Failed to load Google Maps API');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;
      
      // Get user location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(userPosition);
          setIsLoading(false);
          
          // Create map instance centered on user location
          if (window.google && mapRef.current) {
            const mapOptions = {
              center: userPosition,
              zoom: 15,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#7c93a3" }]
                },
                {
                  featureType: "administrative.country",
                  elementType: "geometry",
                  stylers: [{ visibility: "on" }]
                },
                {
                  featureType: "landscape",
                  elementType: "geometry",
                  stylers: [{ color: "#f5f5f5" }]
                }
              ]
            };
            
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
            
            // Add marker for user location
            markerRef.current = new window.google.maps.Marker({
              position: userPosition,
              map: mapInstanceRef.current,
              title: "You are here",
              animation: window.google.maps.Animation.DROP,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#9F025E",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2
              }
            });
            
            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: "<strong>You are here</strong>"
            });
            
            markerRef.current.addListener("click", () => {
              infoWindow.open(mapInstanceRef.current, markerRef.current);
            });
          }
        },
        (geolocationError) => {
          setIsLoading(false);
          setError('Error getting your location. Please allow location access.');
          console.error('Geolocation error:', geolocationError);
        },
        { enableHighAccuracy: true }
      );
      
      // Set up continuous location tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(newPosition);
          
          // Update marker position
          if (markerRef.current && mapInstanceRef.current) {
            markerRef.current.setPosition(newPosition);
            mapInstanceRef.current.panTo(newPosition);
          }
        },
        (watchError) => {
          console.error('Location watch error:', watchError);
        },
        { enableHighAccuracy: true }
      );
      
      // Cleanup
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    };
    
    loadGoogleMapsScript();
  }, []);

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-80 z-10">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-safeguard-primary dark:text-safeguard-secondary" />
            <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 bg-opacity-80 z-10">
          <div className="text-center p-4 max-w-md">
            <MapPin className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-2 font-medium text-gray-800 dark:text-gray-200">{error}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              This app needs location access to show your position on the map.
              Please check your browser settings.
            </p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="h-full w-full min-h-[300px]"
        style={{ height: "100%", width: "100%" }}
      />
      
      {/* Overlay with user location coordinates */}
      {userLocation && (
        <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 p-2 rounded shadow-md text-xs">
          <p className="font-mono">
            Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
