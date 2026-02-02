import type { DiscoveredFrom } from './store';

/**
 * Store candidate — discovery pipeline output.
 * Stored in StoreCandidates table only. Never auto-inserted into production Store table.
 * All entries have verified = false until manually verified.
 */
export interface StoreCandidate {
  id: string;
  name: string;
  city: string;
  state: string;
  sourceHandle: string;
  postUrl: string;
  confidenceScore: number;
  verified: false;
  discoveredFrom: DiscoveredFrom;
  discoveredAt: string; // ISO 8601
}

/** Parsed candidate shape returned by discovery (before persistence). */
export interface ParsedStoreCandidate {
  name: string;
  city: string;
  state: string;
  sourceHandle: string;
  postUrl: string;
  confidenceScore: number;
}
