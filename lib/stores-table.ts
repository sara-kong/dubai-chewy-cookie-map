import path from 'path';
import fs from 'fs';
import type { Store } from '@/types/store';
import { isStoreInUS, isStoreVerified } from '@/types/store';

const STORES_PATH = path.join(process.cwd(), 'data', 'stores.json');

/** Persisted shape: discoveredAt as ISO string. */
interface StoreRecord {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  verified: boolean;
  verifiedSources: string[];
  discoveredFrom: Store['discoveredFrom'];
  discoveredAt: string;
  originalPostUrl?: string;
  confidenceScore?: number;
}

function recordToStore(r: StoreRecord): Store {
  return {
    ...r,
    discoveredAt: new Date(r.discoveredAt),
  };
}

function storeToRecord(s: Store): StoreRecord {
  return {
    ...s,
    discoveredAt: typeof s.discoveredAt === 'string' ? s.discoveredAt : s.discoveredAt.toISOString(),
  };
}

function ensureDataDir(): void {
  const dir = path.dirname(STORES_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readRecords(): StoreRecord[] {
  ensureDataDir();
  if (!fs.existsSync(STORES_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(STORES_PATH, 'utf-8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeRecords(records: StoreRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(STORES_PATH, JSON.stringify(records, null, 2), 'utf-8');
}

/** All stores in the table. */
export function getStores(): Store[] {
  return readRecords().map(recordToStore);
}

/** Only verified, US stores — for map and search. Frontend should ONLY use this. */
export function getVerifiedStores(): Store[] {
  const stores = getStores();
  return stores.filter((s) => isStoreVerified(s) && isStoreInUS(s));
}

/**
 * Replace entire stores table (e.g. seed from Google Maps API only).
 * Validates each store is within US bounds before writing.
 */
export function replaceAllStores(stores: Store[]): void {
  for (const s of stores) {
    if (!isStoreInUS(s)) {
      throw new Error(
        `US-only: store "${s.name}" (lat=${s.lat}, lng=${s.lng}) is outside continental US bounds.`
      );
    }
  }
  const records = stores.map((s, i) =>
    storeToRecord({ ...s, id: s.id || String(i + 1) })
  );
  writeRecords(records);
}

/**
 * Append a store (e.g. after verification). Assigns id if missing.
 * Hard US-only: throws if (lat, lng) is outside continental US bounds.
 */
export function appendStore(store: Omit<Store, 'id'> & { id?: string }): Store {
  if (!isStoreInUS(store)) {
    throw new Error(
      `US-only: store (lat=${store.lat}, lng=${store.lng}) is outside continental US bounds.`
    );
  }
  const records = readRecords();
  const maxId = records.reduce((max, r) => {
    const n = parseInt(r.id, 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const id = store.id ?? String(maxId + 1);
  const full: Store = { ...store, id };
  const record = storeToRecord(full);
  writeRecords([...records, record]);
  return full;
}
