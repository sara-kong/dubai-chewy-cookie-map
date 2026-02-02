'use client';

import { Store, FrozenStoreList } from '@/types/store';
import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/** Consumes frozen dataset only; no additional locations. Styled to match Figma. */
interface SearchBarProps {
  stores: FrozenStoreList;
  onStoreSelect: (store: Store) => void;
  onClose?: () => void;
}

export default function SearchBar({ stores, onStoreSelect, onClose }: SearchBarProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredStores([]);
      setIsOpen(false);
      return;
    }

    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.address.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredStores(filtered);
    setIsOpen(true);
  }, [query, stores]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStoreClick = (store: Store) => {
    onStoreSelect(store);
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Results dropdown — z-40, narrower width, compact padding, slides under bar */}
      {isOpen && filteredStores.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-0.5 pt-2 bg-figma-white rounded-xl border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-h-80 overflow-y-auto z-40 py-1"
          role="listbox"
          aria-label="Search results"
        >
          {filteredStores.map((store) => (
            <button
              key={store.id}
              type="button"
              role="option"
              onClick={() => handleStoreClick(store)}
              className="w-full px-3 py-2 text-left font-sans border-b border-black/5 last:border-b-0 hover:bg-figma-green-badge-bg/30 focus:bg-figma-green-badge-bg/30 focus:outline-none focus:ring-0 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="font-semibold text-sm text-figma-black leading-tight">
                {store.name}
              </div>
              <div className="text-xs font-normal text-figma-black/70 line-clamp-1 mt-0.5">
                {store.address}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && filteredStores.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-0.5 pt-2 bg-figma-white rounded-xl border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-3 py-4 text-center font-sans text-sm text-figma-black/70 z-40"
          role="status"
        >
          No locations found
        </div>
      )}

      {/* Search bar — z-50; all Figma styles on input default state, wrapper is layout-only */}
      <div className="relative z-50">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-figma-black/60 pointer-events-none"
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cookie locations..."
          className="w-full h-12 bg-white border border-gray-200 rounded-xl shadow-md pl-12 pr-11 py-3 font-sans text-base font-normal text-gray-900 placeholder:text-gray-500 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
          aria-label="Search locations"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-figma-black/60" />
          </button>
        )}
      </div>
    </div>
  );
}
