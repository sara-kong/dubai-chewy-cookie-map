import { Store, isStoreInUS, isStoreVerified, FrozenStoreList } from '@/types/store';

/**
 * FROZEN APP DATA SCOPE
 * --------------------
 * - Use ONLY the verified seed stores defined below.
 * - Do NOT add, infer, or fetch additional locations.
 * - Do NOT modify store data fields or values.
 * - All map, search, and UI components MUST consume this frozen dataset (export `stores` only).
 */

const SEED_STORES: readonly Store[] = [
  {
    id: '1',
    name: 'Grace Street Coffee & Desserts',
    address: '17 W 32nd St, New York, NY 10001, USA',
    lat: 40.7484,
    lng: -73.9870,
    discoveredAt: new Date('2026-01-25T00:00:00Z'),
    verifiedSources: ['TikTok: @cookieenthusiast', 'Instagram: @gracestreet'],
  },
  {
    id: '2',
    name: 'Bear Donut',
    address: '40 W 31st St, New York, NY 10001, USA',
    lat: 40.7472,
    lng: -73.9882,
    discoveredAt: new Date('2026-01-22T00:00:00Z'),
    verifiedSources: ['Instagram: @beardonutinc'],
  },
  {
    id: '3',
    name: 'Seoul Sweets',
    address: '308 5th Ave, New York, NY 10001, USA',
    lat: 40.7488,
    lng: -73.9854,
    discoveredAt: new Date('2026-01-20T00:00:00Z'),
    verifiedSources: ['TikTok: @seoulsweetsnyc', 'Instagram: @seoulsweetsnyc'],
  },
];

const filtered = SEED_STORES.filter(
  (s): s is Store => isStoreInUS(s) && isStoreVerified(s)
);

/** Frozen dataset: the only source of locations for map, search, and UI. Read-only. */
export const stores: FrozenStoreList = Object.freeze([...filtered]) as FrozenStoreList;
