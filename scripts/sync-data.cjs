/**
 * Sync Licensing Data Script
 *
 * This script fetches licensing data from Google Sheets and updates the local data file.
 *
 * Usage:
 *   node scripts/sync-data.js
 *
 * Or with a local CSV file:
 *   node scripts/sync-data.js --file path/to/file.csv
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

// State rows in the CSV (row number to state name)
const STATE_ROWS = {
  11: 'California',
  12: 'New York',
  13: 'Texas',
  14: 'Florida',
  15: 'Pennsylvania',
  16: 'Illinois',
  17: 'Ohio',
  18: 'Georgia',
  19: 'North Carolina',
  20: 'Michigan',
  21: 'New Jersey',
  22: 'Virginia',
  23: 'Washington',
  24: 'Arizona',
  25: 'Massachusetts',
  26: 'Tennessee',
  27: 'Indiana',
  28: 'Missouri',
  29: 'Maryland',
  30: 'Wisconsin',
  31: 'Colorado',
  32: 'Minnesota',
  33: 'South Carolina',
  34: 'Alabama',
  35: 'Louisiana',
  36: 'Kentucky',
  37: 'Oregon',
  38: 'Oklahoma',
  39: 'Connecticut',
  40: 'Utah',
  41: 'Iowa',
  42: 'Arkansas',
  43: 'Mississippi',
  44: 'Kansas',
  45: 'New Mexico',
  46: 'Nebraska',
  47: 'Idaho',
  48: 'West Virginia',
  49: 'Hawaii',
  50: 'Nevada',
  51: 'New Hampshire',
  52: 'Maine',
  53: 'Montana',
  54: 'Rhode Island',
  55: 'Delaware',
  56: 'South Dakota',
  57: 'North Dakota',
  58: 'Alaska',
  59: 'DC',
  60: 'Vermont',
  61: 'Wyoming'
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
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

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').map(line => line.replace(/\r/g, ''));
  const licensingData = {};

  for (let rowNum = 11; rowNum <= 70; rowNum++) {
    if (!STATE_ROWS[rowNum]) continue;

    const lineIndex = rowNum - 1;
    if (lineIndex >= lines.length) continue;

    const cells = parseCSVLine(lines[lineIndex]);
    const stateName = STATE_ROWS[rowNum];
    const stateData = {};

    for (const [colIndex, providerName] of Object.entries(PROVIDER_COLUMNS)) {
      const value = cells[parseInt(colIndex)] || '';

      // Skip empty values
      if (!value || value === '') continue;

      // Clean up the value (remove extra whitespace, newlines)
      const cleanValue = value.replace(/\s+/g, ' ').trim();

      // Skip values that look like metadata
      if (cleanValue.match(/^(TRUE|FALSE|#REF!|Open|Closed|Promoting|Pending Expansion)$/i)) continue;

      stateData[providerName] = cleanValue;
    }

    if (Object.keys(stateData).length > 0) {
      licensingData[stateName] = stateData;
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

  const stateNames = Object.keys(licensingData).sort();

  for (const stateName of stateNames) {
    const providers = licensingData[stateName];
    const entries = Object.entries(providers)
      .map(([name, date]) => `'${name}': '${date}'`)
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

export function getExpiredRenewals(): ProviderRenewal[] {
  const now = new Date();

  return getAllRenewals()
    .filter(r => r.renewalDate && r.renewalDate < now)
    .sort((a, b) => (b.renewalDate?.getTime() || 0) - (a.renewalDate?.getTime() || 0));
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
  const licensingData = parseCSV(csvContent);

  console.log(`Found ${Object.keys(licensingData).length} states with licensing data`);

  console.log('Generating data file...');
  const outputContent = generateDataFile(licensingData);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'providerLicensing.ts');
  fs.writeFileSync(outputPath, outputContent, 'utf-8');

  console.log(`Successfully updated ${outputPath}`);
  console.log('Done!');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
