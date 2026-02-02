'use client';

import { Store, isStoreNew } from '@/types/store';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import StorePopupCard from '@/components/StorePopupCard';

interface StorePopupProps {
  store: Store;
  onClose: () => void;
  isOpen: boolean;
}

export default function StorePopup({ store, onClose, isOpen }: StorePopupProps) {
  const controls = useAnimation();

  // Only call controls.start after mount so the motion component is in the DOM
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      controls.start({ y: 0, opacity: 1 });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, controls]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    } else {
      // User interaction only — component is mounted
      requestAnimationFrame(() => {
        controls.start({ y: 0 });
      });
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Centered at bottom: pb-8 + mb-8 so all 4 rounded corners are visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-8 pointer-events-none overflow-visible">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={controls}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="w-full max-w-[500px] max-h-[80vh] mb-8 overflow-y-auto overflow-x-visible pointer-events-auto"
          style={{ touchAction: 'pan-y' }}
        >
          <StorePopupCard
            name={store.name}
            address={store.address}
            isNew={newStore}
            onOpenMapsClick={handleGoogleMapsClick}
            onClose={onClose}
          />
        </motion.div>
      </div>
    </>
  );
}
