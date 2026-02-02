import type { ParsedStoreCandidate } from '@/types/store-candidate';
import type { TikTokPlaceholderPost } from './clients/tiktok-placeholder';
import type { InstagramPlaceholderPost } from './clients/instagram-placeholder';

/**
 * Extract city and state from API location string (e.g. "New York, NY").
 * US-only; no international parsing.
 */
function parseLocation(locationName?: string): { city: string; state: string } {
  if (!locationName || typeof locationName !== 'string') {
    return { city: '', state: '' };
  }
  const parts = locationName.split(',').map((p) => p.trim());
  if (parts.length >= 2) {
    const state = parts[parts.length - 1];
    const city = parts.slice(0, -1).join(', ');
    return { city, state };
  }
  return { city: locationName, state: '' };
}

/**
 * Heuristic: try to pull a store/place name from caption (e.g. "at Grace Street").
 * Placeholder; replace with real NER or rules when wiring real APIs.
 */
function extractStoreNameFromCaption(caption: string): string {
  const atMatch = caption.match(/\b(?:at|from|@)\s+([A-Za-z0-9\s&'-]+?)(?:\s+in\s|\s*[,.]|$)/i);
  if (atMatch) return atMatch[1].trim();
  // Fallback: first sentence or first 30 chars
  const first = caption.split(/[.!?\n]/)[0]?.trim() ?? caption;
  return first.slice(0, 50).trim() || 'Unknown';
}

export function parseTikTokPosts(posts: TikTokPlaceholderPost[]): ParsedStoreCandidate[] {
  return posts.map((post) => {
    const { city, state } = parseLocation(post.locationName);
    const name = extractStoreNameFromCaption(post.caption) || 'Unknown';
    return {
      name,
      city,
      state,
      sourceHandle: post.authorHandle.startsWith('@') ? post.authorHandle : `@${post.authorHandle}`,
      postUrl: post.postUrl,
      confidenceScore: 0.75,
    };
  });
}

export function parseInstagramPosts(posts: InstagramPlaceholderPost[]): ParsedStoreCandidate[] {
  return posts.map((post) => {
    const { city, state } = parseLocation(post.locationName);
    const name = extractStoreNameFromCaption(post.caption) || 'Unknown';
    return {
      name,
      city,
      state,
      sourceHandle: post.username.startsWith('@') ? post.username : `@${post.username}`,
      postUrl: post.permalink,
      confidenceScore: 0.75,
    };
  });
}
