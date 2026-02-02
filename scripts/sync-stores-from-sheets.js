/**
 * Sync stores from Google Sheets to data/stores.ts
 * Requires: GOOGLE_APPLICATION_CREDENTIALS pointing to a service account JSON key
 * Run: node scripts/sync-stores-from-sheets.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1yfCnSwytNLRu96YCo0Isl4IBUvrHsZILB9MocM22Pgk';
const DATA_STORES_PATH = path.join(__dirname, '..', 'data', 'stores.ts');

function rowToStore(row, index) {
  return {
    id: String(row[0] ?? index + 1),
    name: String(row[1] ?? ''),
    address: String(row[2] ?? ''),
    lat: parseFloat(row[3]) || 0,
    lng: parseFloat(row[4]) || 0,
    verified: row[5] === 'TRUE',
    verifiedSources: (row[6] || '').split(', ').map((s) => s.trim()).filter(Boolean),
    discoveredFrom: String(row[7] ?? 'manual'),
    discoveredAt: row[8] ? new Date(row[8]) : new Date(),
  };
}

function escapeForTs(str) {
  if (str == null) return "''";
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

function formatStoreForTs(store) {
  const dateStr = store.discoveredAt instanceof Date
    ? store.discoveredAt.toISOString()
    : new Date(store.discoveredAt).toISOString();
  return `  {
    id: ${escapeForTs(store.id)},
    name: ${escapeForTs(store.name)},
    address: ${escapeForTs(store.address)},
    lat: ${store.lat},
    lng: ${store.lng},
    verified: ${store.verified},
    verifiedSources: [${store.verifiedSources.map((s) => escapeForTs(s)).join(', ')}],
    discoveredFrom: ${escapeForTs(store.discoveredFrom)},
    discoveredAt: new Date(${escapeForTs(dateStr)}),
  }`;
}

function buildStoresTsContent(stores) {
  const storesBlock = stores.map((s, i) => formatStoreForTs(s)).join(',\n');
  return `import { Store, isStoreInUS, isStoreVerified, FrozenStoreList } from '@/types/store';

/**
 * FROZEN APP DATA SCOPE
 * --------------------
 * - Use ONLY the verified seed stores defined below.
 * - Do NOT add, infer, or fetch additional locations.
 * - Do NOT modify store data fields or values.
 * - All map, search, and UI components MUST consume this frozen dataset (export \`stores\` only).
 */

const SEED_STORES: readonly Store[] = [
${storesBlock}
];

const filtered = SEED_STORES.filter(
  (s): s is Store => isStoreInUS(s) && isStoreVerified(s)
);

/** Frozen dataset: the only source of locations for map, search, and UI. Read-only. */
export const stores: FrozenStoreList = Object.freeze([...filtered]) as FrozenStoreList;
`;
}

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is required.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Reading rows from Google Sheets...');
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A2:I', // Row 2 onward, columns A–I (skip header)
  });

  const rows = response.data.values || [];
  console.log(`Rows read: ${rows.length}`);

  const stores = rows.map((row, index) => rowToStore(row, index));
  console.log(`Stores transformed: ${stores.length}`);

  const content = buildStoresTsContent(stores);
  fs.writeFileSync(DATA_STORES_PATH, content, 'utf8');
  console.log(`File written: ${DATA_STORES_PATH}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
