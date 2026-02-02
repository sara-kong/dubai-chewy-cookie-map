import { NextResponse } from 'next/server';
import { runDiscovery } from '@/lib/discovery/service';
import type { DiscoveryPlatform } from '@/lib/discovery/service';

export const dynamic = 'force-dynamic';

const PLATFORMS: DiscoveryPlatform[] = ['tiktok', 'instagram'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keywords = Array.isArray(body.keywords) ? body.keywords : [];
    const platform = typeof body.platform === 'string' && PLATFORMS.includes(body.platform as DiscoveryPlatform)
      ? (body.platform as DiscoveryPlatform)
      : null;

    if (keywords.length === 0 || !platform) {
      return NextResponse.json(
        { error: 'Missing or invalid body: keywords (string[]) and platform ("tiktok" | "instagram") required' },
        { status: 400 }
      );
    }

    const result = await runDiscovery({ keywords, platform });

    return NextResponse.json({
      candidates: result.candidates,
      saved: result.saved,
      message: 'Discovery complete. Results saved to StoreCandidates only (verified = false). No production stores modified.',
    });
  } catch (e) {
    console.error('Discovery run error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Discovery failed' },
      { status: 500 }
    );
  }
}
