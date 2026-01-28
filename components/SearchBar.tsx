'use client';

import { Store, FrozenStoreList } from '@/types/store';
import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/** Consumes frozen dataset only; no additional locations. */
interface SearchBarProps {
  stores: FrozenStoreList;
  onStoreSelect: (store: Store) => void;
  onClose?: () => void;
}

export default function SearchBar({ stores, onStoreSelect, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cookie locations..."
          className="w-full pl-12 pr-12 py-4 bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && filteredStores.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
          {filteredStores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleStoreClick(store)}
              className="w-full px-6 py-4 text-left hover:bg-amber-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-semibold text-gray-900 mb-1">{store.name}</div>
              <div className="text-sm text-gray-600 line-clamp-1">{store.address}</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && filteredStores.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center text-gray-500 z-50">
          No locations found
        </div>
      )}
    </div>
  );
}
