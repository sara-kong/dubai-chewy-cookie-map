'use client';

import { Store, isStoreNew } from '@/types/store';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { MapPin, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

interface StorePopupProps {
  store: Store;
  onClose: () => void;
  isOpen: boolean;
}

export default function StorePopup({ store, onClose, isOpen }: StorePopupProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: 0, opacity: 1 });
    } else {
      controls.start({ y: 100, opacity: 0 });
    }
  }, [isOpen, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down more than 100px, close the popup
    if (info.offset.y > 100) {
      onClose();
    } else {
      // Otherwise, snap back to original position
      controls.start({ y: 0 });
    }
  };

  const handleGoogleMapsClick = () => {
    const query = encodeURIComponent(`${store.name}, ${store.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (!isOpen) return null;

  const newStore = isStoreNew(store);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />
      
      {/* Popup */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={controls}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
        style={{ touchAction: 'pan-y' }}
      >
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      {/* Content */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h2>
            {newStore && (
              <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                New
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 leading-relaxed">{store.address}</p>
        </div>

        {store.verifiedSources?.length > 0 && (
          <div className="flex items-start gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Verified sources</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-0.5">
                {store.verifiedSources.map((source, i) => (
                  <li key={i}>{source}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleMapsClick}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
    </>
  );
}
