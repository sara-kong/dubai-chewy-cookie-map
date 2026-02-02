import { NextResponse } from 'next/server';
import { verifyStoreCandidate } from '@/lib/admin/verify-store-candidate';

export const dynamic = 'force-dynamic';

/**
 * Admin-only: verify a store candidate and copy into Stores table.
 * TODO: Protect with admin auth; reject non-admin callers.
 *
 * Body: { candidateId: string, address?: string, lat?: number, lng?: number }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidateId = typeof body.candidateId === 'string' ? body.candidateId.trim() : '';

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Missing or invalid body: candidateId (string) required' },
        { status: 400 }
      );
    }

    const options =
      body.address != null || body.lat != null || body.lng != null
        ? {
            address: typeof body.address === 'string' ? body.address : undefined,
            lat: typeof body.lat === 'number' ? body.lat : undefined,
            lng: typeof body.lng === 'number' ? body.lng : undefined,
          }
        : undefined;

    const store = verifyStoreCandidate(candidateId, options);

    return NextResponse.json({
      store,
      message: 'Candidate verified and copied to Stores table. Map will show this store.',
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Verification failed';
    if (message.startsWith('Candidate not found')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    console.error('Verify candidate error:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
