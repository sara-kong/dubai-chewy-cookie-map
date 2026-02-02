import path from 'path';
import fs from 'fs';
import type { StoreCandidate } from '@/types/store-candidate';
import { isCandidateInUS } from '@/lib/validation/us-only';

const CANDIDATES_PATH = path.join(process.cwd(), 'data', 'store-candidates.json');

function ensureDataDir(): void {
  const dir = path.dirname(CANDIDATES_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readCandidates(): StoreCandidate[] {
  ensureDataDir();
  if (!fs.existsSync(CANDIDATES_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(CANDIDATES_PATH, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeCandidates(candidates: StoreCandidate[]): void {
  ensureDataDir();
  fs.writeFileSync(
    CANDIDATES_PATH,
    JSON.stringify(candidates, null, 2),
    'utf-8'
  );
}

/**
 * Append new candidates to the StoreCandidates table. All have verified = false.
 * Hard US-only: only candidates with a valid US state (2-letter code or DC) are saved; others are dropped.
 */
export function appendCandidates(
  candidates: Omit<StoreCandidate, 'id' | 'verified'>[]
): StoreCandidate[] {
  const usOnly = candidates.filter((c) => isCandidateInUS(c));
  if (usOnly.length === 0) return [];

  const existing = readCandidates();
  const maxId = existing.reduce((max, c) => {
    const n = parseInt(c.id, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const newCandidates: StoreCandidate[] = usOnly.map((c, i) => ({
    ...c,
    id: String(maxId + i + 1),
    verified: false as const,
  }));
  const combined = [...existing, ...newCandidates];
  writeCandidates(combined);
  return newCandidates;
}

/** Read all candidates (for API/admin use). */
export function getAllCandidates(): StoreCandidate[] {
  return readCandidates();
}

/** Get one candidate by id. */
export function getCandidateById(id: string): StoreCandidate | undefined {
  return readCandidates().find((c) => c.id === id);
}
