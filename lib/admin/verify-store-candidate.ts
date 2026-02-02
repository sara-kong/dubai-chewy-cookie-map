import type { Store } from '@/types/store';
import { getCandidateById } from '@/lib/discovery/store-candidates';
import { appendStore } from '@/lib/stores-table';
import { US_BOUNDS } from '@/types/store';

const DEFAULT_LAT = (US_BOUNDS.latMin + US_BOUNDS.latMax) / 2;
const DEFAULT_LNG = (US_BOUNDS.lngMin + US_BOUNDS.lngMax) / 2;

export interface VerifyStoreCandidateOptions {
  address?: string;
  lat?: number;
  lng?: number;
}

/**
 * Admin-only: verify a store candidate and copy it into the Stores table.
 * Sets verified = true. Preserves verifiedSources (from candidate) and discoveredFrom.
 * Does not modify the StoreCandidates table (candidate remains; no delete).
 */
export function verifyStoreCandidate(
  candidateId: string,
  options?: VerifyStoreCandidateOptions
): Store {
  const candidate = getCandidateById(candidateId);
  if (!candidate) {
    throw new Error(`Candidate not found: ${candidateId}`);
  }

  const address =
    options?.address?.trim() ||
    (candidate.city && candidate.state
      ? `${candidate.city}, ${candidate.state}, USA`
      : 'Address to be confirmed');

  const lat = options?.lat ?? DEFAULT_LAT;
  const lng = options?.lng ?? DEFAULT_LNG;

  const verifiedSources = [`${candidate.discoveredFrom}: ${candidate.sourceHandle}`];

  const store: Omit<Store, 'id'> = {
    name: candidate.name,
    address,
    lat,
    lng,
    verified: true,
    verifiedSources,
    discoveredFrom: candidate.discoveredFrom,
    discoveredAt: new Date(candidate.discoveredAt),
    originalPostUrl: candidate.postUrl,
    confidenceScore: candidate.confidenceScore,
  };

  return appendStore(store);
}
