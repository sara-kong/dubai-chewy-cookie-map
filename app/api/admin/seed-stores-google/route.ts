import { NextResponse } from 'next/server';
import type { Store } from '@/types/store';
import { replaceAllStores } from '@/lib/stores-table';

export const dynamic = 'force-dynamic';

/**
 * 3 verified US stores with predefined lat/lng.
 * No Geocoding API — map uses Maps JavaScript API only with stored coordinates.
 */
const SEED_STORES: Omit<Store, 'id'>[] = [
  {
    name: 'Grace Street Coffee & Desserts',
    address: '17 W 32nd St, New York, NY 10001, USA',
    lat: 40.7484,
    lng: -73.987,
    verified: true,
    verifiedSources: ['TikTok: @cookieenthusiast', 'Instagram: @gracestreet'],
    discoveredFrom: 'manual',
    discoveredAt: new Date('2026-01-25T00:00:00Z'),
  },
  {
    name: 'Bear Donut',
    address: '40 W 31st St, New York, NY 10001, USA',
    lat: 40.7472,
    lng: -73.9882,
    verified: true,
    verifiedSources: ['Instagram: @beardonutinc'],
    discoveredFrom: 'manual',
    discoveredAt: new Date('2026-01-22T00:00:00Z'),
  },
  {
    name: 'Seoul Sweets',
    address: '308 5th Ave, New York, NY 10001, USA',
    lat: 40.7488,
    lng: -73.9854,
    verified: true,
    verifiedSources: ['TikTok: @seoulsweetsnyc', 'Instagram: @seoulsweetsnyc'],
    discoveredFrom: 'manual',
    discoveredAt: new Date('2026-01-20T00:00:00Z'),
  },
];

/**
 * POST: Seed the stores table with 3 verified US stores (predefined lat/lng).
 * No Geocoding API. Map renders via Maps JavaScript API using these stored coordinates.
 */
export async function POST() {
  try {
    const stores: Store[] = SEED_STORES.map((s, i) => ({ ...s, id: String(i + 1) }));
    replaceAllStores(stores);

    return NextResponse.json({
      message: 'Inserted 3 verified US stores (predefined lat/lng). No geocoding used.',
      stores: stores.map((s) => ({ id: s.id, name: s.name, address: s.address, lat: s.lat, lng: s.lng })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Seed failed';
    console.error('Seed stores error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
