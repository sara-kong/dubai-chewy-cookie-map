'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Store } from '@/types/store';
import { stores } from '@/data/stores'; // Frozen dataset only; no add/infer/fetch.
import StorePopup from '@/components/StorePopup';
import SearchBar from '@/components/SearchBar';
import { Search } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

// Initial view: continental U.S. Markers and search use frozen stores only.
const defaultCenter = { lat: 39.8283, lng: -98.5795 };
const defaultZoom = 4;

// Custom marker icon - cookie emoji style
const createCustomMarkerIcon = (): google.maps.Icon => {
  const svg = `
    <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#D97706" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="2.5" fill="#92400E"/>
      <circle cx="24" cy="16" r="2.5" fill="#92400E"/>
      <path d="M16 22 Q20 25 24 22" stroke="#92400E" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
  `;
  const encodedSvg = encodeURIComponent(svg);
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodedSvg}`,
    scaledSize: new google.maps.Size(40, 50),
    anchor: new google.maps.Point(20, 50),
  };
};

export default function MapPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerIcon, setMarkerIcon] = useState<google.maps.Icon | null>(null);

  const handleMarkerClick = useCallback((store: Store) => {
    setSelectedStore(store);
    setIsSearchOpen(false);
  }, []);

  const handleStoreSelect = useCallback((store: Store) => {
    setSelectedStore(store);
    setIsSearchOpen(false);
    // Center map on selected store
    if (map) {
      map.panTo({ lat: store.lat, lng: store.lng });
      map.setZoom(15);
    }
  }, [map]);

  const handleClosePopup = useCallback(() => {
    setSelectedStore(null);
  }, []);

  const libraries = useMemo(() => ['places'], []);

  // Initialize marker icon when map loads
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (typeof window !== 'undefined' && window.google?.maps) {
      setMarkerIcon(createCustomMarkerIcon());
    }
  }, []);

  return (
    <div className="relative w-full h-screen">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={defaultZoom}
          onLoad={handleMapLoad}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              icon={markerIcon || undefined}
              onClick={() => handleMarkerClick(store)}
              animation={typeof window !== 'undefined' && window.google?.maps?.Animation ? window.google.maps.Animation.DROP : undefined}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Search Toggle Button */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-40">
        {!isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="bg-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Search className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Search locations</span>
          </button>
        ) : (
          <div className="bg-white rounded-full shadow-lg p-2">
            <SearchBar
              stores={stores}
              onStoreSelect={handleStoreSelect}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Store Popup */}
      {selectedStore && (
        <StorePopup
          store={selectedStore}
          onClose={handleClosePopup}
          isOpen={true}
        />
      )}
    </div>
  );
}
