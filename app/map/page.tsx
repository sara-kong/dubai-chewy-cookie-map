'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Store } from '@/types/store';
import StorePopup from '@/components/StorePopup';
import SearchBar from '@/components/SearchBar';
import Onboarding from '@/components/Onboarding';
import { Search } from 'lucide-react';

/** Raw location from /locations.json */
interface LocationFromJson {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  verified: boolean;
  verifiedSources: string | string[];
  discoveredFrom: string;
  discoveredAt: string;
}

function locationToStore(loc: LocationFromJson): Store {
  const verifiedSources = Array.isArray(loc.verifiedSources)
    ? loc.verifiedSources
    : (loc.verifiedSources || '').split(',').map((s) => s.trim()).filter(Boolean);
  let discoveredAt: Date;
  if (loc.discoveredAt) {
    const d = new Date(loc.discoveredAt);
    discoveredAt = Number.isNaN(d.getTime()) ? new Date() : d;
  } else {
    discoveredAt = new Date();
  }
  return {
    id: String(loc.id),
    name: loc.name ?? '',
    address: loc.address ?? '',
    lat: Number(loc.lat) || 0,
    lng: Number(loc.lng) || 0,
    verified: Boolean(loc.verified),
    verifiedSources,
    discoveredFrom: (loc.discoveredFrom === 'tiktok' || loc.discoveredFrom === 'instagram' ? loc.discoveredFrom : 'manual') as Store['discoveredFrom'],
    discoveredAt,
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

// Initial view: continental U.S. Markers and search use frozen stores only.
const defaultCenter = { lat: 39.8283, lng: -98.5795 };
const defaultZoom = 4;

// Custom marker icon from public/marker-icon.svg
const getMarkerIcon = (): google.maps.Icon => ({
  url: '/marker-icon.svg',
  scaledSize: new google.maps.Size(40, 28),
  anchor: new google.maps.Point(20, 28),
});

// Google Maps libraries - explicitly typed as mutable array of allowed library names
const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = ["places"];

export default function MapPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerIcon, setMarkerIcon] = useState<google.maps.Icon | null>(null);

  useEffect(() => {
    setStoresLoading(true);
    setStoresError(null);
    fetch('/locations.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load locations: ${res.status}`);
        return res.json();
      })
      .then((data: LocationFromJson[]) => {
        const list = Array.isArray(data) ? data : [];
        setStores(list.map(locationToStore));
      })
      .catch((err) => {
        setStoresError(err instanceof Error ? err.message : 'Failed to load locations');
        setStores([]);
      })
      .finally(() => setStoresLoading(false));
  }, []);

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

  // Initialize marker icon when map loads
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (typeof window !== 'undefined' && window.google?.maps) {
      setMarkerIcon(getMarkerIcon());
    }
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Onboarding: full-screen overlay on every load; map loads only after CTA */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Map content: fade in after onboarding dismisses */}
      {!showOnboarding && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {storesError && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg shadow-md text-sm font-sans max-w-md text-center">
              {storesError}
            </div>
          )}
          {storesLoading && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white/90 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md text-sm font-sans">
              Loading locations…
            </div>
          )}
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
              {!storesLoading &&
                stores.map((store) => (
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

          {/* Search: button (closed) and SearchBar (open) share identical Figma styling */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
            {!isSearchOpen ? (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="relative w-full h-12 bg-white border border-figma-green-badge-text rounded-xl shadow-md font-sans text-base font-normal text-gray-500 pl-12 pr-11 py-3 text-left outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:outline-none"
                style={{ outline: 'none', boxShadow: 'none' }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-figma-black/60 pointer-events-none" aria-hidden />
                <span>Search for cookie locations...</span>
              </button>
            ) : (
              <SearchBar
                stores={stores}
                onStoreSelect={handleStoreSelect}
                onClose={() => setIsSearchOpen(false)}
              />
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
        </motion.div>
      )}
    </div>
  );
}
