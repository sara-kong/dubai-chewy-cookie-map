import type { DiscoveredFrom } from '@/types/store';
import type { StoreCandidate, ParsedStoreCandidate } from '@/types/store-candidate';
import { searchTikTokPlaceholder } from './clients/tiktok-placeholder';
import { searchInstagramPlaceholder } from './clients/instagram-placeholder';
import { parseTikTokPosts, parseInstagramPosts } from './parse';
import { appendCandidates } from './store-candidates';

export type DiscoveryPlatform = 'tiktok' | 'instagram';

export interface DiscoveryInput {
  keywords: string[];
  platform: DiscoveryPlatform;
}

export interface DiscoveryResult {
  candidates: ParsedStoreCandidate[];
  saved: StoreCandidate[];
}

/**
 * Run discovery manually. Does NOT insert into production Store table.
 * Saves only to StoreCandidates table with verified = false, discoveredFrom, discoveredAt.
 */
export async function runDiscovery(input: DiscoveryInput): Promise<DiscoveryResult> {
  const { keywords, platform } = input;

  const rawPosts =
    platform === 'tiktok'
      ? await searchTikTokPlaceholder(keywords)
      : await searchInstagramPlaceholder(keywords);

  const parsed: ParsedStoreCandidate[] =
    platform === 'tiktok' ? parseTikTokPosts(rawPosts) : parseInstagramPosts(rawPosts);

  const discoveredAt = new Date().toISOString();
  const discoveredFrom: DiscoveredFrom = platform;

  const toSave = parsed.map((p) => ({
    name: p.name,
    city: p.city,
    state: p.state,
    sourceHandle: p.sourceHandle,
    postUrl: p.postUrl,
    confidenceScore: p.confidenceScore,
    discoveredFrom,
    discoveredAt,
  }));

  // Hard US-only: appendCandidates only persists candidates with valid US state; others dropped
  const saved = appendCandidates(toSave);

  return {
    candidates: parsed,
    saved,
  };
}
