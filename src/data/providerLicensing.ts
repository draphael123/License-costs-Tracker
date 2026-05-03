/**
 * Provider Licensing Data
 * Contains renewal dates for each provider by state
 * Source: Provider Compliance Dashboard spreadsheet
 * Last Updated: 5/3/2026
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
  'Alabama': { 'Doron': '12/31/2026', 'Terray': 'pending', 'Victor C': 'pending', 'Ashley Escoe': '12/31/2026' },
  'Alaska': { 'Tzvi Doron': '12/31/2026', 'Priya': '11/30/2026' },
  'Arizona': { 'Doron': '11/27/2027', 'Lindsay': '4/30/2027', 'Bill C': '04/01/2030', 'Terray': '4/1/2029', 'Summer': '4/1/2028', 'Victor C': '04/01/2030', 'Priya': '4/30/2030', 'Vivien': '4/30/2027', 'Megan Ryan-Riffle': '04/01/2030', 'Danielle B': '04/30/2027', 'DeAnna Maher': '08/31/2027' },
  'Arkansas': { 'Doron': '11/30/26', 'Tzvi Doron': '12/31/26', 'Lindsay': 'pending', 'Tim M': '6/30/2027', 'Priya': '11/30/2027' },
  'California': { 'Doron': '1/31/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '06/30/2026', 'Bill C': '4/30/2028', 'Terray': '9/30/2026', 'Summer': '6/30/2026', 'Victor C': '6/30/2028', 'Tim M': '07/31/2027', 'Priya': '12/31/2027', 'Liz': '12/31/2027', 'Alexis Foster-Horton': '7/31/2026', 'Rachel Razi': '12/31/2027', 'DeAnna Maher': '09/30/2027' },
  'Colorado': { 'Doron': '4/30/2027', 'Tzvi Doron': '4/30/2027', 'Lindsay': '09/30/2026', 'Bill C': '09/30/2026', 'Terray': '09/30/2027', 'Summer': '9/30/2026', 'Victor C': '09/30/2027', 'Bryana': '09/30/2026', 'Priya': '09/30/2027', 'Liz': '09/30/2027', 'DeAnna Maher': '09/30/2027' },
  'Connecticut': { 'Doron': '11/30/2026', 'Lindsay': 'pending', 'Bill C': '03/31/2027', 'Summer': '5/31/2027', 'Victor C': '05/31/2027', 'Priya': '11/30/2026' },
  'DC': { 'Tzvi Doron': '12/31/2026', 'Priya': '6/30/2026', 'Catherine': '12/31/2027' },
  'Delaware': { 'Tzvi Doron': '03/31/2027', 'Lindsay': '09/30/2027 Pending Doron\'s license', 'Bill C': '09/30/2027 Pending Doron\'s License', 'Terray': '09/30/2027 Pending Doron\'s License', 'Victor C': '09/30/202 Pending Doron\'s License', 'Priya': '9/30/2027' },
  'Florida': { 'Doron': '1/31/2027', 'Tzvi Doron': '3/31/2028', 'Lindsay': '04/30/2027', 'Bill C': '4/30/2028', 'Terray': '4/30/2027', 'Summer': '7/31/2028', 'Priya': '07/31/2026', 'Vivien': '4/30/2028', 'Bryce': '4/30/2027', 'Catherine': '04/30/2027', 'Alexis Foster-Horton': '1/31/2027', 'Megan Ryan-Riffle': '04/30/2027', 'Danielle B': '4/30/2027', 'DeAnna Maher': '04/30/2027' },
  'Georgia': { 'Doron': '11/30/2026', 'Lindsay': '1/31/2028', 'Danielle B': '01/31/2027', 'Emmanuel Oluwaseyi Sonaike': '5/31/2028' },
  'Hawaii': { 'Lindsay': '06/30/27', 'Bill C': '06/30/2027 Pending PA', 'Terray': '06/30/2027', 'Priya': '06/30/2027', 'Rachel Razi': '06/30/2027' },
  'Idaho': { 'Doron': '6/30/2027', 'Lindsay': '08/31/2027', 'Bill C': '08/31/2027', 'Terray': '08/31/2027', 'Tim M': '8/31/2027', 'Priya': '8/31/2027, NO CSR+ PMP', 'Vivien': '8/31/27' },
  'Illinois': { 'Doron': '7/31/2026', 'Tzvi Doron': '7/31/2026', 'Lindsay': '5/31/2028', 'Bill C': '05/31/2028', 'Terray': 'pending', 'Summer': '05/31/2028', 'Victor C': '05/31/2028', 'Bryana': '05/31/2028', 'Priya': '05/31/2026', 'Vivien': '05/31/2028' },
  'Indiana': { 'Doron': '10/31/2027', 'Lindsay': '4/30/2027', 'Bill C': '7/31/2028', 'Terray': '09/30/2027', 'Summer': '7/31/2026', 'Tim M': '06/30/2027', 'Bryana': '10/31/2026', 'Priya': '11/30/2027', 'Ashley Escoe': '10/31/2027' },
  'Iowa': { 'Doron': 'pending', 'Tzvi Doron': '12/01/2026', 'Lindsay': '04/30/2027', 'Bill C': '07/31/2026', 'Summer': '7/31/2026', 'Victor C': '05/31/2028', 'Tim M': '6/30/2027', 'Priya': '11/30/2027', 'Bryce': '01/28/2027', 'Danielle B': '04/30/2027 pending PMP', 'Emmanuel Oluwaseyi Sonaike': '05/01/2028' },
  'Kansas': { 'Doron': 'pending', 'Lindsay': '05/31/2028', 'Priya': '11/30/2027', 'Megan Ryan-Riffle': '01/31/2028' },
  'Kentucky': { 'Doron': '3/1/2027', 'Lindsay': '10/31/2026', 'Terray': '10/31/2026', 'Bryana': '10/31/2026', 'Priya': '10/31/2026', 'Alexis Foster-Horton': '02/28/2027' },
  'Louisiana': { 'Doron': 'pending', 'Priya': '01/31/2027' },
  'Maine': { 'Doron': '11/30/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/12/2027', 'Bill C': '03/27/2027', 'Summer': '05/13/2027', 'Victor C': '05/24/2027', 'Priya': '11/29/2026', 'Michele Foster': '04/22/2027' },
  'Maryland': { 'Doron': '9/30/2027', 'Tzvi Doron': '9/30/2026', 'Lindsay': '05/28/2028', 'Bill C': '03/28/2028', 'Terray': 'pending', 'Victor C': '5/28/2028 Pending DEA', 'Priya': '11/28/2027, No CSR', 'Bryce': '01/28/2027', 'Ashley Grout': '5/28/2028' },
  'Massachusetts': { 'Doron': 'pending', 'Lindsay': 'pending', 'Bill C': '3/27/2028', 'Terray': 'pending', 'Victor C': 'Pending NP conditional licensure issued', 'Priya': '11/29/2026', 'Rachel Razi': '11/21/2026' },
  'Michigan': { 'Doron': '3/18/2027', 'Tzvi Doron': '1/29/2028', 'Lindsay': '03/28/2027', 'Bill C': '09/08/2027', 'Terray': 'pending', 'Summer': '08/10/2026', 'Tim M': '02/21/2027', 'Priya': '01/22/2027', 'Catherine': '02/17/2028' },
  'Minnesota': { 'Doron': 'pending', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2028', 'Bill C': '03/31/2028', 'Terray': 'pending', 'Summer': 'pending', 'Priya': '11/30/2027', 'Megan Ryan-Riffle': 'RN Active, pending NP', 'Michele Foster': '04/30/2027' },
  'Mississippi': { 'Doron': 'pending' },
  'Missouri': { 'Doron': '1/31/2027', 'Bill C': '07/31/2026', 'Terray': '9/30/2027', 'Priya': '11/30/2027', 'Vivien': '10/31/2026', 'Ashley Escoe': '1/31/2027' },
  'Montana': { 'Doron': '03/31/2027', 'Tzvi Doron': '03/31/2028', 'Lindsay': '12/31/2026', 'Bill C': '12/31/2026', 'Terray': '12/31/2026', 'Summer': '12/31/2026', 'Priya': '12/31/2026', 'Michele Foster': '12/31/2026' },
  'Nebraska': { 'Doron': '10/1/2026', 'Tzvi Doron': '10/1/2026', 'Lindsay': '10/31/2026', 'Bill C': '10/31/2026', 'Victor C': '10/31/2026', 'Tim M': '10/31/2026', 'Priya': '10/31/2026' },
  'Nevada': { 'Doron': 'pending', 'Lindsay': '05/12/2027', 'Bill C': '03/27/2028', 'Terray': '08/31/2027', 'Priya': '11/29/2026', 'Bryce': '01/07/2027' },
  'New Hampshire': { 'Doron': '12/13/2027', 'Lindsay': '07/31/2026', 'Bill C': '3/30/2027', 'Priya': '11/30/2026' },
  'New Jersey': { 'Doron': '6/30/2027', 'Tzvi Doron': '6/30/2027', 'Lindsay': '5/31/2028', 'Bill C': '05/31/2028', 'Terray': 'pending', 'Summer': '5/31/2027', 'Bryana': 'pending', 'Priya': '5/31/2026' },
  'New Mexico': { 'Doron': 'pending', 'Tzvi Doron': '07/01/2028 Needs DEA', 'Lindsay': '07/31/2028 Needs DEA', 'Bill C': '07/31/2026 Needs DEA', 'Terray': '09/30/2027 Needs DEA', 'Summer': '07/31/2026', 'Victor C': '05/31/2028', 'Tim M': '06/30/2027 Needs DEA', 'Priya': '11/30/2027, No DEA+ PMP', 'Michele Foster': '04/20/2027 Pending CSR+DEA+PMP' },
  'New York': { 'Doron': '10/31/2027', 'Tzvi Doron': '11/30/2026', 'Lindsay': '04/30/2029', 'Bill C': '2/29/2028', 'Terray': '7/31/2028', 'Summer': '4/30/2028', 'Victor C': '2/28/2029', 'Tim M': '5/31/2028', 'Bryana': '03/31/2028', 'Priya': '10/31/2027', 'Catherine': '03/31/2028', 'Danielle B': '10/31/2028', 'DeAnna Maher': '09/30/2028' },
  'North Carolina': { 'Doron': '11/27/2026', 'Tzvi Doron': '12/27/2026', 'Lindsay': '05/31/2027', 'Bill C': '03/31/2027', 'Terray': '08/31/2026 Pending PMP', 'Summer': '5/31/2027', 'Victor C': '05/31/2027', 'Bryana': '09/30/2026', 'Priya': '11/30/2026', 'Bryce': '01/31/2027', 'Michele Foster': '04/30/2027', 'Emmanuel Oluwaseyi Sonaike': '05/01/2027' },
  'North Dakota': { 'Lindsay': '12/31/2026', 'Bill C': '12/31/2026', 'Victor C': '12/31/2026', 'Liz': '12/31/2026' },
  'Ohio': { 'Doron': '1/28/2027', 'Tzvi Doron': '4/1/2027', 'Lindsay': '10/31/2027', 'Bill C': '10/31/2027', 'Terray': '10/31/27', 'Summer': '10/31/2027', 'Bryana': '10/31/2027', 'Priya': '10/31/2027', 'Vivien': '10/31/2027', 'Catherine': '10/31/2027', 'Megan Ryan-Riffle': '10/31/2027' },
  'Oklahoma': { 'Doron': 'pending', 'Lindsay': '05/31/2028', 'Bill C': '03/31/2028', 'Priya': '11/30/2026' },
  'Oregon': { 'Doron': 'pending', 'Lindsay': '05/12/2028', 'Bill C': '03/26/2028', 'Terray': '8/31/2026', 'Summer': '05/12/2028', 'Victor C': '05/24/2028', 'Priya': '11/29/2027', 'Michele Foster': '02/04/2028' },
  'Pennsylvania': { 'Doron': '12/31/2026', 'Tzvi Doron': '10/31/2026', 'Lindsay': '10/31/2027', 'Bill C': '10/31/2027', 'Terray': 'pending', 'Summer': '10/31/2027', 'Priya': '4/30/2027', 'Alexis Foster-Horton': '12/31/2026', 'Ashley Grout': '04/30/2028', 'Rachel Razi': 'pending', 'Ashley Escoe': '12/31/2026' },
  'Rhode Island': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2026', 'Lindsay': '03/31/2028', 'Bryana': '03/01/2028', 'Priya': '03/01/2028', 'Danielle B': '03/01/2028' },
  'South Carolina': { 'Doron': '6/30/27', 'Lindsay': '04/30/2028', 'Emmanuel Oluwaseyi Sonaike': '6/30/2027' },
  'South Dakota': { 'Doron': 'pending', 'Tzvi Doron': '03/01/2027', 'Lindsay': '05/12/2027', 'Bill C': '03/27/2027', 'Priya': '11/29/2026', 'Rachel Razi': '11/21/2027' },
  'Tennessee': { 'Doron': '11/30/2027', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2028', 'Summer': '5/31/2028', 'Priya': '11/30/2027,no CSR + CPA', 'Alexis Foster-Horton': '8/30/2028' },
  'Texas': { 'Doron': '2/28/2028', 'Tzvi Doron': '2/28/2028', 'Lindsay': '05/31/2028', 'Bill C': '3/31/2028', 'Terray': 'pending', 'Summer': '05/31/2028', 'Victor C': '05/31/2028', 'Tim M': '6/30/2027', 'Priya': '11/30/2027', 'Alexis Foster-Horton': '5/31/2027', 'Megan Ryan-Riffle': '01/31/2028', 'Danielle B': '12/31/2026', 'Michele Foster': '4/30/2027', 'DeAnna Maher': '08/31/2027', 'Ashley Escoe': '05/31/2027', 'Emmanuel Oluwaseyi Sonaike': '08/31/2026' },
  'Utah': { 'Doron': '1/31/28', 'Lindsay': '01/31/2028', 'Bill C': '01/31/2028', 'Terray': '01/31/2028', 'Priya': '01/31/2028' },
  'Vermont': { 'Doron': 'pending', 'Tzvi Doron': '09/30/2026', 'Lindsay': '3/31/2027', 'Bill C': '03/31/2027', 'Victor C': '03/31/2027', 'Priya': '3/31/2027' },
  'Virginia': { 'Doron': '11/30/2026', 'Tzvi Doron': '12/31/2026', 'Lindsay': '05/31/2028', 'Bill C': '03/31/2028', 'Terray': '08/31/2026', 'Summer': '05/31/2028', 'Priya': '11/30/2027', 'Bryce': '01/31/2027', 'Megan Ryan-Riffle': '1/31/2028', 'Ashley Grout': '05/31/2026' },
  'Washington': { 'Doron': '11/27/2027', 'Tzvi Doron': '12/27/2026', 'Lindsay': '5/12/2028', 'Bill C': '03/27/2027', 'Terray': '8/31/2026', 'Summer': '5/13/2027', 'Bryana': '09/05/2026', 'Priya': '11/29/2027', 'Michele Foster': '4/22/2028', 'Emmanuel Oluwaseyi Sonaike': '05/20/2027' },
  'West Virginia': { 'Doron': 'pending', 'Tzvi Doron': '06/30/2027', 'Lindsay': '06/30/2027 Pending DEA', 'Bill C': '06/30/2027, pending PA', 'Summer': 'pending', 'Priya': '6/30/2027, NO RX AUTH', 'Michele Foster': '06/30/2027 Pending PA→ CSE → DEA → PMP' },
  'Wisconsin': { 'Doron': '10/31/2027', 'Tzvi Doron': '10/31/2027', 'Lindsay': '9/30/2026', 'Bill C': '9/30/2026', 'Terray': 'pending', 'Summer': '9/30/2026', 'Vivien': '09/30/2026', 'Michele Foster': '09/30/2026', 'Ashley Escoe': '10/31/2027' },
  'Wyoming': { 'Lindsay': '12/31/2026', 'Terray': '12/31/2026', 'Priya': '12/31/2026', 'Michele Foster': '12/31/2026' },
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
