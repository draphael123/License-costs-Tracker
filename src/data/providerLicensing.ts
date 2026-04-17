/**
 * Provider Licensing Data
 * Contains renewal dates for each provider by state
 * Source: Provider Compliance Dashboard spreadsheet
 * Last Updated: 4/17/2026
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
  'Alabama': { 'Doron': '12/31/2026', 'Tim M': '12/31/2027', 'Bryana': '12/31/2027' },
  'Alaska': { 'Tim M': '11/30/2024', 'Bryana': '11/30/2024' },
  'Arizona': { 'Doron': '11/30/2026', 'Lindsay': '4/1/2030', 'Terray': '4/1/2027', 'Ashley Escoe': '04/01/2029' },
  'Arkansas': { 'Doron': '11/30/26' },
  'California': { 'Doron': '1/31/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '10/31/2027', 'Bill C': '10/31/2027', 'Terray': '11/30/2026', 'Summer': '10/31/2027', 'Victor C': '03/31/2027', 'Tim M': '3/31/2027', 'Bryana': 'pending', 'Ashley Escoe': '03/31/2027' },
  'Colorado': { 'Doron': '4/30/2027', 'Ashley Escoe': '09/30/2027' },
  'Connecticut': { 'Doron': '11/30/2026', 'Tim M': '2/28/2025', 'Ashley Escoe': '02/28/2027' },
  'DC': { 'Tim M': '6/30/2026' },
  'Delaware': { 'Doron': 'pending', 'Ashley Escoe': '09/30/2023' },
  'Florida': { 'Doron': '1/31/2027', 'Tzvi Doron': '04/30/2026', 'Ashley Escoe': '04/30/2026' },
  'Georgia': { 'Doron': '11/30/2026', 'Victor C': '3/31/2027', 'Tim M': '1/31/2019' },
  'Hawaii': { 'Tim M': '6/30/2025' },
  'Idaho': { 'Doron': '6/30/2027', 'Ashley Escoe': '08/31/2027' },
  'Illinois': { 'Doron': '7/31/2026', 'Tzvi Doron': '5/31/2028', 'Lindsay': '05/31/2028', 'Bill C': '5/31/2028', 'Terray': '05/31/2028', 'Ashley Escoe': '05/31/2026' },
  'Indiana': { 'Doron': '10/31/2027', 'Ashley Escoe': '10/31/2021' },
  'Iowa': { 'Doron': 'pending' },
  'Kansas': { 'Doron': 'pending' },
  'Kentucky': { 'Doron': '3/1/2027', 'Ashley Escoe': '10/31/2021' },
  'Louisiana': { 'Doron': 'pending', 'Tzvi Doron': '12/31/2023', 'Bryana': '01/31/2024', 'Ashley Escoe': '01/31/2027' },
  'Maine': { 'Doron': '11/30/2027', 'Bill C': '11/30/2027' },
  'Maryland': { 'Doron': '9/30/2027', 'Ashley Escoe': '02/28/2023' },
  'Massachusetts': { 'Doron': 'pending', 'Bill C': '6/23/2026', 'Tim M': '2/14/2028', 'Ashley Escoe': '02/21/2026' },
  'Michigan': { 'Doron': '3/18/2027', 'Tzvi Doron': '11/20/2026', 'Lindsay': '10/16/2027', 'Bill C': '8/7/2027', 'Ashley Escoe': '02/17/2028' },
  'Minnesota': { 'Doron': 'pending', 'Tzvi Doron': '11/30/2026', 'Lindsay': 'pending', 'Bill C': '09/30/2026', 'Ashley Escoe': '02/28/2027' },
  'Mississippi': { 'Doron': 'pending' },
  'Missouri': { 'Doron': '1/31/2027' },
  'Montana': { 'Doron': '03/31/2027', 'Ashley Escoe': '12/31/2022' },
  'Nebraska': { 'Doron': '10/1/2026', 'Ashley Escoe': '10/31/2026' },
  'Nevada': { 'Doron': 'pending', 'Lindsay': '09/17/2027', 'Bill C': '9/11/2027', 'Tim M': '2/14/2025', 'Ashley Escoe': '02/21/2026' },
  'New Hampshire': { 'Doron': '12/13/2027' },
  'New Jersey': { 'Doron': '6/30/2027', 'Ashley Escoe': '05/31/2026' },
  'New Mexico': { 'Doron': 'pending' },
  'New York': { 'Doron': '10/31/2027', 'Tzvi Doron': '08/31/2028', 'Lindsay': '10/31/2028', 'Bill C': '09/30/2028', 'Terray': '09/30/2028', 'Victor C': '09/30/2028', 'Tim M': '7/31/2026', 'Ashley Escoe': '01/31/2028' },
  'North Carolina': { 'Doron': '11/27/2026', 'Ashley Escoe': '02/28/2027' },
  'North Dakota': { 'Tzvi Doron': '12/27/2023', 'Lindsay': '12/31/2026', 'Bill C': '12/31/2026', 'Tim M': '12/31/2026', 'Vivien': '12/31/2026' },
  'Ohio': { 'Doron': '1/28/2027', 'Bill C': '10/31/2027', 'Ashley Escoe': '10/31/2027' },
  'Oklahoma': { 'Doron': 'pending' },
  'Oregon': { 'Doron': 'pending', 'Tzvi Doron': '11/11/2026', 'Lindsay': '09/17/2026', 'Bill C': '09/11/2026', 'Tim M': '2/13/2028', 'Ashley Escoe': '02/21/2027' },
  'Pennsylvania': { 'Doron': '12/31/2026', 'Summer': '10/31/2026', 'Ashley Escoe': '10/31/2026' },
  'Rhode Island': { 'Doron': 'pending', 'Ashley Escoe': '03/01/2024' },
  'South Carolina': { 'Doron': '6/30/27' },
  'South Dakota': { 'Doron': 'pending' },
  'Tennessee': { 'Doron': '11/30/2027', 'Summer': '9/30/2026', 'Ashley Escoe': '02/28/2023' },
  'Texas': { 'Doron': '2/28/2028', 'Ashley Escoe': '02/28/2027' },
  'Utah': { 'Doron': '1/31/28' },
  'Vermont': { 'Doron': 'pending' },
  'Virginia': { 'Doron': '11/30/2026', 'Ashley Escoe': '02/28/2027' },
  'Washington': { 'Doron': '11/27/2027', 'Ashley Escoe': '02/21/2026' },
  'West Virginia': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2027', 'Lindsay': '06/30/2027 Pending PA', 'Bill C': '06/30/2027, pending PA', 'Victor C': 'pending', 'Michele Foster': '06/30/2027 Pending PA→ CSE → DEA → PMP', 'Ashley Escoe': '6/30/2027, NO RX AUTH' },
  'Wisconsin': { 'Doron': '10/31/2027', 'Ashley Escoe': '02/28/2026' },
  'Wyoming': { 'Tim M': '9/30/2020' },
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
