/**
 * Sync Licensing Data Script
 *
 * This script fetches licensing data from Google Sheets and updates the local data file.
 *
 * Usage:
 *   node scripts/sync-data.cjs
 *
 * Or with a local CSV file:
 *   node scripts/sync-data.cjs --file path/to/file.csv
 *
 * Environment Variables:
 *   GOOGLE_SHEET_CSV_URL - URL to the published CSV (File > Share > Publish to web > CSV)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Provider header mapping (column index to provider name)
const PROVIDER_COLUMNS = {
  2: 'Doron',
  3: 'Tzvi Doron',
  4: 'Lindsay',
  5: 'Bill C',
  6: 'Terray',
  7: 'Summer',
  8: 'Victor C',
  9: 'Tim M',
  10: 'Bryana',
  11: 'Priya',
  12: 'Vivien',
  13: 'Liz',
  14: 'Bryce',
  15: 'Catherine',
  16: 'Alexis Foster-Horton',
  17: 'Megan Ryan-Riffle',
  18: 'Ashley Grout',
  19: 'Danielle B',
  20: 'Rachel Razi',
  21: 'Michele Foster',
  22: 'DeAnna Maher',
  23: 'Ashley Escoe',
  24: 'Emmanuel Oluwaseyi Sonaike',
  25: 'Naureen Majid Adam',
  26: 'Nicole Tahira Perrotte'
};

// Valid state names to look for in column B (index 1)
const VALID_STATES = new Set([
  'California', 'New York', 'Texas', 'Florida', 'Pennsylvania',
  'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan',
  'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts',
  'Tennessee', 'Indiana', 'Missouri', 'Maryland', 'Wisconsin',
  'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana',
  'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Puerto Rico',
  'Utah', 'Iowa', 'Arkansas', 'Mississippi', 'Kansas',
  'New Mexico', 'Nebraska', 'Idaho', 'West Virginia', 'Hawaii',
  'Nevada', 'New Hampshire', 'Maine', 'Montana', 'Rhode Island',
  'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'DC', 'Vermont', 'Wyoming'
]);

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fetchURL(response.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Properly parse CSV handling multiline cells in quotes
function parseCSVToRows(csvContent) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.length > 1) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
    } else if (char !== '\r') {
      currentCell += char;
    }
  }

  // Handle last row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.length > 1) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function isExpiredDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('pending')) return false;
  const cleaned = dateStr.replace(/[^0-9/]/g, '').trim();
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    let [month, day, year] = parts.map(p => parseInt(p, 10));
    if (year < 100) year += 2000;
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date < new Date();
    }
  }
  return false;
}

function extractLicensingData(rows, filterExpired = false) {
  const licensingData = {};
  const seenStates = new Set();

  for (const row of rows) {
    // State name is in column 1 (index 1)
    const stateName = row[1];

    if (!stateName || !VALID_STATES.has(stateName)) {
      continue;
    }

    // Skip duplicate state rows - use the first occurrence only
    // This prevents later sections in the CSV (e.g., metadata tables) from overwriting licensing data
    if (seenStates.has(stateName)) {
      continue;
    }

    const stateData = {};

    for (const [colIndex, providerName] of Object.entries(PROVIDER_COLUMNS)) {
      const value = row[parseInt(colIndex)] || '';

      // Skip empty values
      if (!value || value === '') continue;

      // Clean up the value (collapse whitespace)
      let cleanValue = value.replace(/\s+/g, ' ').trim();

      // Skip values that look like metadata or status columns
      if (cleanValue.match(/^(TRUE|FALSE|#REF!|Open|Closed|Promoting|Pending Expansion)$/i)) continue;

      // Skip expired dates if filtering is enabled
      if (filterExpired && isExpiredDate(cleanValue)) continue;

      stateData[providerName] = cleanValue;
    }

    if (Object.keys(stateData).length > 0) {
      licensingData[stateName] = stateData;
      seenStates.add(stateName);
    }
  }

  return licensingData;
}

function generateDataFile(licensingData) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  let output = `/**
 * Provider Licensing Data
 * Contains renewal dates for each provider by state
 * Source: Provider Compliance Dashboard spreadsheet
 * Last Updated: ${today}
 */

import { STATE_NAME_TO_ID } from './licenseCosts';

// States where we currently operate - update this list as needed
export const ACTIVE_STATES = new Set([
  'AZ', 'CA', 'CO', 'FL', 'ID', 'IL', 'IN', 'IA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MT', 'NE', 'NV', 'NJ', 'NM', 'NY', 'NC',
  'ND', 'OH', 'OR', 'PA', 'SD', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WI', 'WY'
]);

export interface ProviderInfo {
  name: string;
  services: string[]; // TRT, HRT, GLP, Async
  type: 'MD' | 'NP'; // Provider type for cost calculation
}

export interface ProviderRenewal {
  provider: string;
  state: string;
  stateId: string;
  renewalDate: Date | null;
  dateString: string;
  isPending: boolean;
  services: string[];
  providerType: 'MD' | 'NP';
}

// Provider info - mapping provider names to their services and type
export const PROVIDERS: ProviderInfo[] = [
  { name: 'Doron', services: ['TRT', 'GLP'], type: 'MD' },
  { name: 'Tzvi Doron', services: ['TRT', 'HRT', 'GLP'], type: 'MD' },
  { name: 'Lindsay', services: ['TRT', 'GLP', 'HRT'], type: 'NP' },
  { name: 'Bill C', services: ['TRT', 'HRT'], type: 'MD' },
  { name: 'Terray', services: ['TRT', 'HRT', 'GLP'], type: 'NP' },
  { name: 'Summer', services: ['TRT', 'GLP', 'HRT'], type: 'NP' },
  { name: 'Victor C', services: ['TRT'], type: 'MD' },
  { name: 'Tim M', services: ['TRT', 'GLP', 'HRT'], type: 'MD' },
  { name: 'Bryana', services: ['TRT', 'GLP', 'HRT'], type: 'NP' },
  { name: 'Priya', services: ['TRT', 'GLP', 'HRT'], type: 'NP' },
  { name: 'Vivien', services: ['HRT', 'TRT'], type: 'NP' },
  { name: 'Liz', services: ['HRT', 'TRT'], type: 'NP' },
  { name: 'Bryce', services: ['TRT', 'HRT'], type: 'MD' },
  { name: 'Catherine', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Alexis Foster-Horton', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Megan Ryan-Riffle', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Ashley Grout', services: ['HRT', 'TRT'], type: 'NP' },
  { name: 'Danielle B', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Rachel Razi', services: ['HRT', 'TRT'], type: 'NP' },
  { name: 'Michele Foster', services: ['HRT', 'TRT'], type: 'NP' },
  { name: 'DeAnna Maher', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Ashley Escoe', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Emmanuel Oluwaseyi Sonaike', services: ['TRT'], type: 'MD' },
  { name: 'Naureen Majid Adam', services: ['TRT'], type: 'NP' },
  { name: 'Nicole Tahira Perrotte', services: ['TRT'], type: 'NP' },
];

// Raw licensing data by state and provider
// Format: { [stateName]: { [providerName]: dateString } }
export const RAW_LICENSING_DATA: Record<string, Record<string, string>> = {
`;

  // Sort states alphabetically for consistency
  const stateNames = Object.keys(licensingData).sort();

  for (const stateName of stateNames) {
    const providers = licensingData[stateName];
    const entries = Object.entries(providers)
      .map(([name, date]) => `'${name}': '${date.replace(/'/g, "\\'")}'`)
      .join(', ');

    output += `  '${stateName}': { ${entries} },\n`;
  }

  output += `};

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase() === 'pending' || dateStr.includes('pending')) {
    return null;
  }

  // Handle various date formats
  const cleaned = dateStr.replace(/\\s+/g, '').trim();

  // Try parsing MM/DD/YYYY or M/D/YYYY
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    let [month, day, year] = parts.map(p => parseInt(p, 10));

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback to Date.parse
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getProviderInfo(name: string): ProviderInfo | undefined {
  return PROVIDERS.find(p => p.name === name);
}

export function getAllRenewals(): ProviderRenewal[] {
  const renewals: ProviderRenewal[] = [];

  for (const [stateName, providers] of Object.entries(RAW_LICENSING_DATA)) {
    const stateId = STATE_NAME_TO_ID[stateName] || stateName;

    // Only include states we operate in
    if (!ACTIVE_STATES.has(stateId)) continue;

    for (const [providerName, dateString] of Object.entries(providers)) {
      const providerInfo = getProviderInfo(providerName);
      const date = parseDate(dateString);
      const isPending = dateString.toLowerCase().includes('pending');

      renewals.push({
        provider: providerName,
        state: stateName,
        stateId,
        renewalDate: date,
        dateString,
        isPending,
        services: providerInfo?.services || [],
        providerType: providerInfo?.type || 'NP',
      });
    }
  }

  return renewals;
}

export function getUpcomingRenewals(days: number = 30): ProviderRenewal[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return getAllRenewals()
    .filter(r => r.renewalDate && r.renewalDate >= now && r.renewalDate <= cutoff)
    .sort((a, b) => (a.renewalDate?.getTime() || 0) - (b.renewalDate?.getTime() || 0));
}

export function getPendingRenewals(): ProviderRenewal[] {
  return getAllRenewals()
    .filter(r => r.isPending)
    .sort((a, b) => a.state.localeCompare(b.state) || a.provider.localeCompare(b.provider));
}

export function getRenewalsByProvider(): Record<string, ProviderRenewal[]> {
  const byProvider: Record<string, ProviderRenewal[]> = {};

  for (const renewal of getAllRenewals()) {
    if (!byProvider[renewal.provider]) {
      byProvider[renewal.provider] = [];
    }
    byProvider[renewal.provider].push(renewal);
  }

  return byProvider;
}

export function getRenewalsByState(): Record<string, ProviderRenewal[]> {
  const byState: Record<string, ProviderRenewal[]> = {};

  for (const renewal of getAllRenewals()) {
    if (!byState[renewal.state]) {
      byState[renewal.state] = [];
    }
    byState[renewal.state].push(renewal);
  }

  return byState;
}
`;

  return output;
}

// Known providers list for validation
const KNOWN_PROVIDERS = new Set(Object.values(PROVIDER_COLUMNS));

function parseValidationDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase() === 'pending' || dateStr.includes('pending')) {
    return null;
  }
  const cleaned = dateStr.replace(/\s+/g, '').trim();
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    let [month, day, year] = parts.map(p => parseInt(p, 10));
    if (year < 100) year += 2000;
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) return date;
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function validateLicensingData(licensingData) {
  const warnings = [];
  const now = new Date();
  let expiredCount = 0;
  let unparsableCount = 0;
  const unknownProviders = new Set();

  for (const [state, providers] of Object.entries(licensingData)) {
    for (const [provider, dateStr] of Object.entries(providers)) {
      // Check for unknown providers
      if (!KNOWN_PROVIDERS.has(provider)) {
        unknownProviders.add(provider);
      }

      // Skip pending
      if (dateStr.toLowerCase().includes('pending')) continue;

      const date = parseValidationDate(dateStr);

      if (!date) {
        unparsableCount++;
        warnings.push(`  - ${state} / ${provider}: Unparsable date "${dateStr}"`);
      } else if (date < now) {
        expiredCount++;
        const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        warnings.push(`  - ${state} / ${provider}: Expired ${daysAgo} days ago (${dateStr})`);
      }
    }
  }

  return { warnings, expiredCount, unparsableCount, unknownProviders: Array.from(unknownProviders) };
}

function updateAppSyncDate() {
  const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
  const today = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  try {
    let appContent = fs.readFileSync(appPath, 'utf-8');

    // Update DATA_SYNC_DATE
    const syncDateRegex = /const DATA_SYNC_DATE = '[^']+';/;
    if (syncDateRegex.test(appContent)) {
      appContent = appContent.replace(syncDateRegex, `const DATA_SYNC_DATE = '${today}';`);
      fs.writeFileSync(appPath, appContent, 'utf-8');
      console.log(`Updated DATA_SYNC_DATE in App.tsx to ${today}`);
      return true;
    } else {
      console.warn('Warning: Could not find DATA_SYNC_DATE in App.tsx');
      return false;
    }
  } catch (error) {
    console.error('Error updating App.tsx:', error.message);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  let csvContent;

  // Check for local file argument
  const fileArgIndex = args.indexOf('--file');
  if (fileArgIndex !== -1 && args[fileArgIndex + 1]) {
    const filePath = args[fileArgIndex + 1];
    console.log(`Reading from local file: ${filePath}`);
    csvContent = fs.readFileSync(filePath, 'utf-8');
  } else if (process.env.GOOGLE_SHEET_CSV_URL) {
    console.log('Fetching from Google Sheets...');
    csvContent = await fetchURL(process.env.GOOGLE_SHEET_CSV_URL);
  } else {
    console.error('Error: No data source provided.');
    console.error('Either set GOOGLE_SHEET_CSV_URL environment variable');
    console.error('or use --file path/to/file.csv');
    process.exit(1);
  }

  console.log('Parsing CSV data...');
  const rows = parseCSVToRows(csvContent);
  console.log(`Parsed ${rows.length} rows from CSV`);

  console.log('Extracting licensing data by state name (filtering expired licenses)...');
  const licensingData = extractLicensingData(rows, true);
  console.log(`Found ${Object.keys(licensingData).length} states with licensing data`);
  console.log('States:', Object.keys(licensingData).sort().join(', '));

  // Validate the data
  console.log('\nValidating data...');
  const { warnings, expiredCount, unparsableCount, unknownProviders } = validateLicensingData(licensingData);

  if (unknownProviders.length > 0) {
    console.warn(`\nWarning: Found ${unknownProviders.length} unknown provider(s) not in PROVIDERS list:`);
    unknownProviders.forEach(p => console.warn(`  - ${p}`));
  }

  if (expiredCount > 0 || unparsableCount > 0) {
    console.warn(`\nData Quality Report:`);
    console.warn(`  Expired licenses: ${expiredCount}`);
    console.warn(`  Unparsable dates: ${unparsableCount}`);
    if (warnings.length <= 20) {
      console.warn('\nDetails:');
      warnings.forEach(w => console.warn(w));
    } else {
      console.warn(`\nShowing first 20 of ${warnings.length} issues:`);
      warnings.slice(0, 20).forEach(w => console.warn(w));
    }
  } else {
    console.log('All dates valid and current!');
  }

  console.log('\nGenerating data file...');
  const outputContent = generateDataFile(licensingData);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'providerLicensing.ts');
  fs.writeFileSync(outputPath, outputContent, 'utf-8');
  console.log(`Successfully updated ${outputPath}`);

  // Auto-update the sync date in App.tsx
  console.log('\nUpdating sync date in App.tsx...');
  updateAppSyncDate();

  console.log('\nDone!');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
