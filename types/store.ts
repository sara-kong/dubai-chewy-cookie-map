/**
 * App data scope is FROZEN: only the verified seed stores in `@/data/stores` exist.
 * Do not add, infer, or fetch additional locations. Do not modify store fields or values.
 * Map, search, and UI must consume the frozen dataset only.
 */

/**
 * U.S.-only, verified store that sells the Dubai Chocolate Chewy Cookie (the product, not the city).
 * - address must include U.S. state abbreviation (e.g. "City, ST 12345, USA")
 * - lat/lng must be valid U.S. coordinates (continental U.S. bounds)
 * - verifiedSources must be non-empty; only verified stores should appear in the app.
 */
export interface Store {
  id: string;
  name: string;
  /** Full address including U.S. state abbreviation (e.g. "123 Main St, Austin, TX 78701, USA") */
  address: string;
  /** Latitude: U.S. bounds ~24.5–49.5 */
  lat: number;
  /** Longitude: U.S. bounds ~-125 to -66 */
  lng: number;
  discoveredAt: Date;
  /** Sources that verified this store sells the Dubai Chocolate Chewy Cookie. Required; no unverified stores. */
  verifiedSources: string[];
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

/** Returns true only if the store has at least one verification source. Only verified stores should be displayed. */
export function isStoreVerified(store: { verifiedSources: string[] }): boolean {
  return Array.isArray(store.verifiedSources) && store.verifiedSources.length > 0;
}

export function isStoreNew(store: Store): boolean {
  const daysSinceDiscovery = (Date.now() - store.discoveredAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceDiscovery < 7;
}

/** Type for the frozen store list. Map, search, and UI consume this only; no other sources. */
export type FrozenStoreList = readonly Store[];
