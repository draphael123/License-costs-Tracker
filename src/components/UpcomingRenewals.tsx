import { useState, useMemo, useEffect } from 'react';
import { getUpcomingRenewals, getPendingRenewals, ProviderRenewal, ACTIVE_STATES } from '../data/providerLicensing';
import { getLicenseCost, getStateName } from '../data/licenseCosts';

type FilterType = 'upcoming' | 'pending';
type TimeRange = 30 | 60 | 90 | 180 | 365;
type SortField = 'provider' | 'state' | 'type' | 'date' | 'cost';
type SortDir = 'asc' | 'desc';

interface UpcomingRenewalsProps {
  initialStateFilter?: string;
  initialProviderFilter?: string;
  onSelectProvider?: (provider: string) => void;
}

function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysUntil(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getUrgencyClass(days: number | null): string {
  if (days === null) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  if (days < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (days <= 14) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (days <= 30) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

function getRenewalCost(renewal: ProviderRenewal): number {
  const stateCost = getLicenseCost(renewal.stateId);
  if (!stateCost) return 0;
  return renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
}

function getRenewalCostInfo(renewal: ProviderRenewal): { cost: number; sourceUrl?: string } {
  const stateCost = getLicenseCost(renewal.stateId);
  if (!stateCost) return { cost: 0 };
  const isMD = renewal.providerType === 'MD';
  return {
    cost: isMD ? stateCost.mdRenewal : stateCost.npRenewal,
    sourceUrl: isMD ? stateCost.mdSourceUrl : stateCost.npSourceUrl,
  };
}

export default function UpcomingRenewals({
  initialStateFilter = 'all',
  initialProviderFilter = 'all',
  onSelectProvider,
}: UpcomingRenewalsProps) {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [stateFilter, setStateFilter] = useState<string>(initialStateFilter);
  const [providerFilter, setProviderFilter] = useState<string>(initialProviderFilter);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => {
    if (initialStateFilter !== 'all') {
      setStateFilter(initialStateFilter);
    }
  }, [initialStateFilter]);

  const renewals = useMemo(() => {
    let data: ProviderRenewal[] = [];
    switch (filter) {
      case 'upcoming':
        data = getUpcomingRenewals(timeRange);
        break;
      case 'pending':
        data = getPendingRenewals();
        break;
    }

    if (stateFilter !== 'all') {
      data = data.filter(r => r.stateId === stateFilter);
    }
    if (providerFilter !== 'all') {
      data = data.filter(r => r.provider === providerFilter);
    }

    // Sort
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'provider':
          cmp = a.provider.localeCompare(b.provider);
          break;
        case 'state':
          cmp = a.state.localeCompare(b.state);
          break;
        case 'type':
          cmp = a.providerType.localeCompare(b.providerType);
          break;
        case 'date':
          if (!a.renewalDate && !b.renewalDate) cmp = 0;
          else if (!a.renewalDate) cmp = 1;
          else if (!b.renewalDate) cmp = -1;
          else cmp = a.renewalDate.getTime() - b.renewalDate.getTime();
          break;
        case 'cost':
          cmp = getRenewalCost(a) - getRenewalCost(b);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [filter, timeRange, stateFilter, providerFilter, sortField, sortDir]);

  const allStates = useMemo(() => {
    return Array.from(ACTIVE_STATES).sort();
  }, []);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    [...getUpcomingRenewals(365), ...getPendingRenewals()]
      .forEach(r => providers.add(r.provider));
    return Array.from(providers).sort();
  }, []);

  const totalCost = useMemo(() => {
    return renewals.reduce((sum, r) => sum + getRenewalCost(r), 0);
  }, [renewals]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDir === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden animate-fade-in">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">License Renewals</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track upcoming and pending renewals</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700/50 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              filter === 'upcoming'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming ({getUpcomingRenewals(timeRange).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending ({getPendingRenewals().length})
          </button>
        </div>

        {filter === 'upcoming' && (
          <div className="flex flex-wrap gap-2">
            {([30, 60, 90, 180, 365] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range === 365 ? '1 year' : `${range} days`}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="all">All States</option>
            {allStates.map(state => (
              <option key={state} value={state}>{getStateName(state)} ({state})</option>
            ))}
          </select>

          <select
            value={providerFilter}
            onChange={e => setProviderFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="all">All Providers</option>
            {allProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>

          {(stateFilter !== 'all' || providerFilter !== 'all') && (
            <button
              onClick={() => { setStateFilter('all'); setProviderFilter('all'); }}
              className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-b border-blue-100 dark:border-blue-900/30">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Showing <strong className="font-semibold">{renewals.length}</strong> renewals
          </span>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm">
            ${totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('provider')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Provider <SortIcon field="provider" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('state')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  State <SortIcon field="state" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('type')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Type <SortIcon field="type" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('date')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Renewal Date <SortIcon field="date" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => toggleSort('cost')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
                >
                  Est. Cost <SortIcon field="cost" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {renewals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No renewals found matching your filters.
                </td>
              </tr>
            ) : (
              renewals.map((renewal, idx) => {
                const days = getDaysUntil(renewal.renewalDate);
                const costInfo = getRenewalCostInfo(renewal);

                return (
                  <tr key={`${renewal.provider}-${renewal.stateId}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {onSelectProvider ? (
                        <button
                          onClick={() => onSelectProvider(renewal.provider)}
                          className="text-left hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{renewal.provider}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{renewal.services.join(', ')}</div>
                        </button>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{renewal.provider}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{renewal.services.join(', ')}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {renewal.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        renewal.providerType === 'MD'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                      }`}>
                        {renewal.providerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {renewal.isPending ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Pending</span>
                      ) : (
                        formatDate(renewal.renewalDate)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renewal.isPending ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          In Progress
                        </span>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getUrgencyClass(days)}`}>
                          {days !== null ? (
                            days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`
                          ) : 'N/A'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      {costInfo.sourceUrl ? (
                        <a
                          href={costInfo.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                          title="View source fee schedule"
                        >
                          ${costInfo.cost.toLocaleString()}
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-900 dark:text-white">${costInfo.cost.toLocaleString()}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
