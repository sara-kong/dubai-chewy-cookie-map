/**
 * Sync locations from Google Sheets to public/locations.json
 * Reads credentials from ./google-credentials.json (project root)
 * Run from project root: node sync-sheet.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1yfCnSwytNLRu96YCo0Isl4IBUvrHsZILB9MocM22Pgk';
const RANGE = 'Sheet1!A2:I';

const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
const outputPath = path.join(process.cwd(), 'public', 'locations.json');

function rowToLocation(row, index) {
  const id = row[0] !== undefined && row[0] !== '' ? Number(row[0]) : index + 1;
  const verifiedSourcesRaw = row[6] != null ? String(row[6]) : '';
  const verifiedSources = verifiedSourcesRaw
    ? verifiedSourcesRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const discoveredAtRaw = row[8];
  const discoveredAt = discoveredAtRaw
    ? new Date(discoveredAtRaw).toISOString()
    : new Date().toISOString();

  return {
    id,
    name: String(row[1] ?? ''),
    address: String(row[2] ?? ''),
    lat: parseFloat(row[3]) || 0,
    lng: parseFloat(row[4]) || 0,
    verified: row[5] === 'TRUE' || row[5] === 'true' || row[5] === true,
    verifiedSources,
    discoveredFrom: String(row[7] ?? 'manual'),
    discoveredAt,
  };
}

async function main() {
  try {
    if (!fs.existsSync(credentialsPath)) {
      console.error('Credentials file not found:', credentialsPath);
      process.exit(1);
    }

    console.log('Using credentials from:', credentialsPath);

    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Fetching data from spreadsheet:', SPREADSHEET_ID);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    console.log('Rows read:', rows.length);

    const locations = rows.map((row, index) => rowToLocation(row, index));
    console.log('Locations transformed:', locations.length);

    const publicDir = path.dirname(outputPath);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(locations, null, 2), 'utf8');
    console.log('Saved to:', outputPath);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.code) console.error('Code:', err.code);
    process.exit(1);
  }
}

main();
