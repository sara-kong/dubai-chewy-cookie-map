import { NextResponse } from 'next/server';
import { getVerifiedStores } from '@/lib/stores-table';

export const dynamic = 'force-dynamic';

/**
 * Returns only verified stores (for map and search).
 * Frontend map should ONLY use this list.
 */
export async function GET() {
  try {
    const stores = getVerifiedStores();
    const serialized = stores.map((s) => ({
      ...s,
      discoveredAt: typeof s.discoveredAt === 'string' ? s.discoveredAt : s.discoveredAt.toISOString(),
    }));
    return NextResponse.json({ stores: serialized });
  } catch (e) {
    console.error('GET /api/stores error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load stores' },
      { status: 500 }
    );
  }
}
