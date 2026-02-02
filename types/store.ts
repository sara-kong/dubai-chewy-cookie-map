/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STORE SCHEMA — FROZEN
 * ═══════════════════════════════════════════════════════════════════════════════
 * Do NOT add, remove, or rename fields. Do NOT change types.
 * This schema is final and must not be modified further.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** Source of discovery. Do not extend. */
export type DiscoveredFrom = 'tiktok' | 'instagram' | 'manual';

/**
 * Store — FROZEN schema.
 * U.S. locations only. discoveredAt serializes as ISO 8601.
 */
export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** Whether the store has been manually verified for the map. */
  verified: boolean;
  /** Sources that verified this store (e.g. "TikTok: @handle", "Instagram: @handle"). */
  verifiedSources: string[];
  /** How the store was discovered. */
  discoveredFrom: DiscoveredFrom;
  /** When the store was discovered. Use ISO date string in API/DB; Date in runtime. */
  discoveredAt: Date;
  /** Optional link to the original post (TikTok/Instagram). */
  originalPostUrl?: string;
  /** Optional extraction confidence 0–1. Only for unverified candidates. */
  confidenceScore?: number;
}

/** Continental U.S. bounds for validation. No international locations. */
export const US_BOUNDS = {
  latMin: 24.5,
  latMax: 49.5,
  lngMin: -125,
  lngMax: -66,
} as const;

/** Returns true only if (lat, lng) falls within the continental United States. */
export function isStoreInUS(store: { lat: number; lng: number }): boolean {
  const { latMin, latMax, lngMin, lngMax } = US_BOUNDS;
  return store.lat >= latMin && store.lat <= latMax && store.lng >= lngMin && store.lng <= lngMax;
}

/** Returns true only if the store is verified (safe to show on map). */
export function isStoreVerified(store: { verified: boolean }): boolean {
  return store.verified === true;
}

export function isStoreNew(store: Store): boolean {
  const d =
    store.discoveredAt instanceof Date
      ? store.discoveredAt
      : new Date((store.discoveredAt as unknown) as string);
  const t = d.getTime();
  if (Number.isNaN(t)) return false;
  const daysSinceDiscovery = (Date.now() - t) / (1000 * 60 * 60 * 24);
  return daysSinceDiscovery >= 0 && daysSinceDiscovery < 7;
}

/** Type for the frozen store list. Map, search, and UI consume this only. */
export type FrozenStoreList = readonly Store[];
