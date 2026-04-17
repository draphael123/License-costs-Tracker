/**
 * Provider Licensing Data
 * Contains renewal dates for each provider by state
 * Source: Provider Compliance Dashboard spreadsheet
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
  { name: 'Bill C', services: ['TRT', 'HRT', 'Async'], type: 'MD' },
  { name: 'Terray', services: ['TRT', 'HRT', 'GLP', 'Async'], type: 'NP' },
  { name: 'Summer', services: ['TRT', 'GLP', 'HRT', 'Async'], type: 'NP' },
  { name: 'Victor L', services: ['TRT'], type: 'MD' },
  { name: 'Tim M', services: ['TRT', 'GLP', 'HRT', 'Async'], type: 'MD' },
  { name: 'Bryana', services: ['TRT', 'GLP', 'HRT', 'Async'], type: 'NP' },
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
  { name: 'Ashley Escoe', services: ['TRT', 'HRT', 'Async'], type: 'NP' },
  { name: 'Skye Sauls', services: ['TRT', 'HRT'], type: 'NP' },
  { name: 'Emmanuel Sonaike', services: ['TRT', 'HRT'], type: 'MD' },
];

// Raw licensing data by state and provider
// Format: { [stateName]: { [providerName]: dateString } }
export const RAW_LICENSING_DATA: Record<string, Record<string, string>> = {
  'California': { 'Doron': '1/31/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '06/30/2026', 'Bill C': '4/30/2026', 'Terray': '02/28/2027', 'Summer': '9/30/2026', 'Victor L': '6/30/2026', 'Tim M': '6/30/2026', 'Bryana': '07/31/2027', 'Vivien': '12/31/2027', 'Catherine': '7/31/2026', 'Danielle B': '12/31/2027', 'Rachel Razi': '12/31/2027', 'DeAnna Maher': '09/30/2027', 'Ashley Escoe': '12/31/2027' },
  'New York': { 'Doron': '10/31/2027', 'Tzvi Doron': '11/30/2026', 'Lindsay': '04/30/2026', 'Bill C': '2/29/2028', 'Terray': '01/31/2028', 'Summer': '7/31/2028', 'Victor L': '4/30/2028', 'Bryana': '5/31/2028', 'Bryce': '03/31/2028', 'Megan Ryan-Riffle': '10/31/2028', 'Ashley Grout': '03/31/2028', 'Michele Foster': '09/30/2028', 'DeAnna Maher': '10/31/2027', 'Ashley Escoe': 'pending' },
  'Texas': { 'Doron': '2/28/2028', 'Tzvi Doron': '2/28/2028', 'Lindsay': '05/31/2026', 'Bill C': '3/31/2028', 'Terray': '01/31/2027', 'Summer': 'pending', 'Victor L': '05/31/2026', 'Tim M': '05/31/2026', 'Bryana': '6/30/2027', 'Catherine': '5/31/2027', 'Alexis Foster-Horton': '01/31/2028', 'Megan Ryan-Riffle': '12/31/2026', 'Rachel Razi': '4/30/2027', 'Michele Foster': '08/31/2027', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': 'pending' },
  'Florida': { 'Doron': '1/31/2027', 'Tzvi Doron': '3/31/2026', 'Lindsay': '04/30/2027', 'Bill C': '4/30/2028', 'Terray': '04/30/2027', 'Summer': '4/30/2027', 'Victor L': '7/31/2026', 'Priya': '4/30/2026', 'Liz': '4/30/2027', 'Bryce': '04/30/2027', 'Catherine': '1/31/2027', 'Alexis Foster-Horton': 'pending', 'Megan Ryan-Riffle': '4/30/2027', 'Ashley Grout': '07/31/2026', 'Michele Foster': '04/30/2027', 'DeAnna Maher': '07/31/2026', 'Ashley Escoe': '07/31/2026', 'Skye Sauls': 'pending' },
  'Pennsylvania': { 'Doron': '12/31/2026', 'Tzvi Doron': '10/31/2026', 'Lindsay': '10/31/2027', 'Bill C': '10/31/2027', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': '10/31/2027', 'Catherine': '12/31/2026', 'Danielle B': 'pending', 'Michele Foster': '4/30/2027', 'DeAnna Maher': 'pending' },
  'Illinois': { 'Doron': '7/31/2026', 'Tzvi Doron': '7/31/2026', 'Lindsay': '5/31/2026', 'Bill C': '05/31/2026', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': '05/31/2026', 'Tim M': '05/31/2026', 'Priya': '05/31/2026', 'Ashley Grout': '05/31/2026', 'Michele Foster': '05/31/2026', 'DeAnna Maher': 'pending' },
  'Ohio': { 'Doron': '1/28/2027', 'Tzvi Doron': '4/1/2027', 'Lindsay': '10/31/2027', 'Bill C': '10/31/2027', 'Terray': '10/31/2027', 'Summer': '10/31/2027', 'Victor L': '10/31/2027', 'Priya': '10/31/2027', 'Bryce': '10/31/2027', 'Catherine': '10/31/2027', 'Megan Ryan-Riffle': '10/31/2027', 'Michele Foster': '10/31/2027', 'DeAnna Maher': 'pending' },
  'Georgia': { 'Doron': '11/30/2026', 'Tzvi Doron': '12/31/2023', 'Lindsay': '1/31/2028', 'Terray': '01/31/2027', 'Victor L': '1/31/2025', 'Alexis Foster-Horton': '01/31/2027', 'Michele Foster': '02/28/2026' },
  'North Carolina': { 'Doron': '11/27/2026', 'Tzvi Doron': '12/27/2026', 'Lindsay': '05/31/2026', 'Bill C': '03/31/2027', 'Terray': '01/31/2027', 'Summer': 'pending', 'Victor L': '5/31/2026', 'Liz': '01/31/2027', 'Alexis Foster-Horton': 'pending', 'Megan Ryan-Riffle': 'pending', 'Danielle B': '11/30/2026', 'Michele Foster': 'pending' },
  'Michigan': { 'Doron': '3/18/2027', 'Tzvi Doron': '1/29/2028', 'Lindsay': '03/28/2027', 'Bill C': '09/08/2027', 'Terray': '09/22/2027', 'Summer': 'pending', 'Victor L': '08/10/2026', 'Bryana': '02/21/2027', 'Michele Foster': '01/22/2027', 'DeAnna Maher': 'pending' },
  'New Jersey': { 'Doron': '6/30/2027', 'Tzvi Doron': '6/30/2027', 'Lindsay': '5/31/2026', 'Bill C': '05/31/2026', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': '5/31/2027', 'Ashley Grout': '05/31/2027', 'DeAnna Maher': '5/31/2026', 'Ashley Escoe': 'pending' },
  'Virginia': { 'Doron': '11/30/2026', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2026', 'Bill C': '03/31/2028', 'Terray': '01/31/2027', 'Summer': '08/31/2026', 'Victor L': '05/31/2026', 'Liz': '01/31/2027', 'Catherine': '1/31/2028', 'Alexis Foster-Horton': '05/31/2026', 'Megan Ryan-Riffle': '12/31/2027', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': '04/30/2028' },
  'Washington': { 'Doron': '11/27/2027', 'Tzvi Doron': '12/27/2026', 'Lindsay': '5/12/2026', 'Bill C': '03/27/2027', 'Terray': 'pending', 'Summer': '8/31/2026', 'Victor L': '5/13/2027', 'Ashley Grout': '4/22/2026', 'Danielle B': '11/29/2027' },
  'Arizona': { 'Doron': '11/27/2027', 'Tzvi Doron': '12/31/2023', 'Lindsay': '4/30/2027', 'Bill C': '07/31/2026', 'Terray': 'pending', 'Summer': '4/1/2029', 'Victor L': '4/1/2028', 'Tim M': '05/31/2026', 'Priya': '4/30/2027', 'Catherine': '04/01/2030', 'Alexis Foster-Horton': '04/30/2027', 'Michele Foster': '08/31/2027', 'DeAnna Maher': '4/30/2030' },
  'Massachusetts': { 'Doron': 'pending', 'Lindsay': 'pending', 'Bill C': '3/27/2028', 'Terray': 'pending', 'Summer': 'pending', 'Danielle B': 'pending', 'DeAnna Maher': '11/29/2026', 'Ashley Escoe': 'pending' },
  'Tennessee': { 'Doron': '11/30/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2026', 'Victor L': '5/31/2026', 'DeAnna Maher': '11/30/2027' },
  'Indiana': { 'Doron': '10/31/2027', 'Tzvi Doron': '10/31/2023', 'Lindsay': '4/30/2027', 'Bill C': '7/31/2026', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': '7/31/2026', 'Bryana': '06/30/2027', 'Danielle B': '10/31/2026', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': 'pending' },
  'Missouri': { 'Doron': '1/31/2027', 'Tzvi Doron': '1/31/2024', 'Bill C': '07/31/2026', 'Summer': '9/30/2027', 'Priya': '10/31/2026', 'Alexis Foster-Horton': '01/31/2026', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': 'pending' },
  'Maryland': { 'Doron': '9/30/2027', 'Tzvi Doron': '9/30/2026', 'Lindsay': '05/28/2026', 'Bill C': '03/28/2028', 'Terray': 'pending', 'Summer': 'pending', 'Vivien': '01/28/2027', 'Catherine': '10/28/2026', 'Danielle B': '11/28/2027' },
  'Wisconsin': { 'Doron': '10/31/2027', 'Tzvi Doron': '10/31/2027', 'Lindsay': '9/30/2026', 'Bill C': '9/30/2026', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': '9/30/2026', 'Priya': '09/30/2026', 'Danielle B': 'pending', 'Ashley Escoe': 'pending' },
  'Colorado': { 'Doron': '4/30/2027', 'Tzvi Doron': '4/30/2027', 'Lindsay': '09/30/2026', 'Bill C': '09/30/2026', 'Terray': 'pending', 'Summer': '09/30/2027', 'Victor L': '9/30/2026', 'Tim M': '09/30/2027', 'Priya': '09/30/2027', 'Ashley Grout': '09/30/2027', 'Danielle B': '09/30/2026', 'Michele Foster': '09/30/2027', 'DeAnna Maher': '09/30/2027' },
  'Minnesota': { 'Doron': 'pending', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2026', 'Bill C': '03/31/2028', 'Terray': 'pending', 'Summer': 'pending', 'Victor L': 'pending', 'Catherine': 'pending', 'Danielle B': '04/30/2027', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': 'pending' },
  'South Carolina': { 'Doron': '6/30/2027', 'Tzvi Doron': '6/30/2023', 'Lindsay': '04/30/2028' },
  'Alabama': { 'Doron': '12/31/2026', 'Tzvi Doron': '12/31/2023', 'Victor L': '12/4/2024', 'Ashley Escoe': 'pending' },
  'Louisiana': { 'Tzvi Doron': '12/31/2023', 'Bryana': '01/31/2024', 'DeAnna Maher': '01/31/2027', 'Ashley Escoe': 'pending' },
  'Kentucky': { 'Doron': '3/1/2027', 'Tzvi Doron': '2/29/2024', 'Lindsay': '10/31/2026', 'Summer': '10/31/2026', 'Victor L': '10/31/2025', 'Bryce': '02/28/2027', 'Megan Ryan-Riffle': '10/31/2026', 'Michele Foster': '10/31/2026' },
  'Oregon': { 'Doron': 'pending', 'Lindsay': '05/12/2026', 'Bill C': '03/26/2028', 'Summer': '8/31/2026', 'Victor L': '05/12/2028', 'Tim M': '05/24/2026', 'Ashley Grout': '02/04/2028', 'Danielle B': '11/29/2027', 'Ashley Escoe': 'pending' },
  'Oklahoma': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2023', 'Bill C': '03/31/2026', 'DeAnna Maher': '11/30/2026', 'Ashley Escoe': 'pending' },
  'Connecticut': { 'Doron': '11/30/2026', 'Tzvi Doron': '12/31/2023', 'Summer': '5/31/2026', 'DeAnna Maher': '11/30/2026' },
  'Utah': { 'Doron': '1/31/2028', 'Tzvi Doron': '5/31/2024', 'Lindsay': '01/31/2028', 'Bill C': '01/31/2028', 'Terray': '01/31/2028', 'DeAnna Maher': '01/31/2028', 'Ashley Escoe': 'pending' },
  'Iowa': { 'Doron': 'pending', 'Tzvi Doron': '12/01/2026', 'Lindsay': '04/30/2027', 'Bill C': '07/31/2026', 'Victor L': '7/31/2026', 'Tim M': '05/31/2026', 'Bryana': '6/30/2027', 'Vivien': '01/28/2027', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': 'pending' },
  'Arkansas': { 'Doron': '11/30/2026', 'Tzvi Doron': '12/31/2026', 'Bryana': '6/30/2027', 'DeAnna Maher': '11/30/2027' },
  'Mississippi': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2023' },
  'Kansas': { 'Doron': 'pending', 'Tzvi Doron': '10/31/2023', 'Lindsay': '05/31/2026', 'Bill C': '3/31/2026', 'Catherine': '01/31/2028', 'DeAnna Maher': '11/30/2027' },
  'New Mexico': { 'Doron': 'pending', 'Tzvi Doron': '07/01/2028', 'Lindsay': '07/31/2028', 'Bill C': '07/31/2026', 'Summer': '09/30/2027', 'Victor L': '05/31/2026', 'Tim M': '05/31/2026', 'Bryana': '06/30/2027', 'DeAnna Maher': '11/30/2027', 'Ashley Escoe': '07/31/2026' },
  'Nebraska': { 'Doron': '10/1/2026', 'Tzvi Doron': '10/1/2026', 'Lindsay': '10/31/2026', 'Bill C': '10/31/2026', 'Tim M': '10/31/2026', 'Bryana': '10/31/2026', 'DeAnna Maher': '10/31/2026', 'Ashley Escoe': 'pending' },
  'Idaho': { 'Doron': '6/30/2027', 'Tzvi Doron': '6/30/2023', 'Lindsay': '08/31/2027', 'Bill C': '08/31/2027', 'Summer': '08/31/2027', 'Bryana': '8/31/2027', 'Priya': '8/31/2027', 'DeAnna Maher': '8/31/2027' },
  'West Virginia': { 'Tzvi Doron': '06/30/2023', 'Bill C': '06/30/2027', 'Victor L': 'pending', 'DeAnna Maher': '6/30/2027', 'Ashley Escoe': 'pending' },
  'Hawaii': { 'Tzvi Doron': '06/30/2024', 'DeAnna Maher': '06/30/2027' },
  'Nevada': { 'Doron': 'pending', 'Tzvi Doron': '12/31/2023', 'Lindsay': '05/12/2027', 'Bill C': '03/27/2028', 'Summer': '08/31/2027', 'Vivien': '01/07/2027', 'DeAnna Maher': '11/29/2026', 'Ashley Escoe': '4/7/2026' },
  'New Hampshire': { 'Doron': '12/13/2027', 'Tzvi Doron': '06/30/2023', 'Lindsay': '07/31/2026', 'Bill C': '3/30/2027', 'DeAnna Maher': '11/30/2026', 'Ashley Escoe': 'pending' },
  'Maine': { 'Doron': '11/30/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/12/2027', 'Bill C': '03/27/2027', 'Victor L': '05/13/2027', 'Ashley Grout': '04/22/2027', 'Danielle B': '11/29/2026', 'Michele Foster': 'pending' },
  'Montana': { 'Doron': '03/31/2027', 'Tzvi Doron': '03/31/2028', 'Lindsay': '12/31/2026', 'Bill C': '12/31/2026', 'Summer': '12/31/2026', 'Victor L': '12/31/2026', 'Megan Ryan-Riffle': '12/31/2026', 'Danielle B': '12/31/2026' },
  'Rhode Island': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2024', 'Megan Ryan-Riffle': 'pending', 'DeAnna Maher': '03/01/2026' },
  'Delaware': { 'Tzvi Doron': '03/31/2027', 'DeAnna Maher': '9/30/2027' },
  'South Dakota': { 'Doron': 'pending', 'Tzvi Doron': '03/01/2027', 'Bill C': '03/27/2027', 'Megan Ryan-Riffle': 'pending', 'DeAnna Maher': '11/29/2026', 'Ashley Escoe': 'pending' },
  'North Dakota': { 'Tzvi Doron': '12/27/2023', 'Lindsay': '12/31/2026', 'Bill C': '12/31/2026', 'Tim M': '12/31/2026', 'Priya': '12/31/2026' },
  'Alaska': { 'Tzvi Doron': '12/31/2026', 'DeAnna Maher': '11/30/2026' },
  'DC': { 'Tzvi Doron': '12/31/2026', 'Liz': '12/31/2027', 'DeAnna Maher': '6/30/2026' },
  'Vermont': { 'Doron': 'pending', 'Tzvi Doron': '09/30/2026', 'Lindsay': '3/31/2027', 'Bill C': '03/31/2027', 'Tim M': '03/31/2027', 'Ashley Escoe': '3/31/2027' },
  'Wyoming': { 'Tzvi Doron': '06/30/2023', 'Lindsay': '12/31/2026', 'Ashley Escoe': '12/31/2026' },
};

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase() === 'pending' || dateStr.includes('pending')) {
    return null;
  }

  // Handle various date formats
  const cleaned = dateStr.replace(/\s+/g, '').trim();

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
