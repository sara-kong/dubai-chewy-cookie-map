/**
 * Hard US-only validation. Used at discovery (candidates) and storage (stores).
 * No international locations accepted.
 */

/** Valid US state/territory abbreviations (50 states + DC). Continental + common. */
export const US_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
]);

/**
 * Returns true only if state is a valid US state/DC code (case-insensitive).
 * Used for StoreCandidate (city/state) before saving to StoreCandidates.
 */
export function isCandidateInUS(candidate: { state: string }): boolean {
  const state = candidate.state?.trim().toUpperCase() ?? '';
  if (state.length !== 2) return false;
  return US_STATE_CODES.has(state);
}

/**
 * Throws if state is not a valid US state/DC code.
 */
export function assertCandidateInUS(candidate: { state: string }): void {
  if (!isCandidateInUS(candidate)) {
    throw new Error(`US-only: invalid or non-US state "${candidate.state}". Must be a valid 2-letter US state or DC.`);
  }
}
