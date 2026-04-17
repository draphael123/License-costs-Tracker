import { useState, useMemo } from 'react';
import { getUpcomingRenewals, getExpiredRenewals, getPendingRenewals, ProviderRenewal } from '../data/providerLicensing';
import { getLicenseCost } from '../data/licenseCosts';

type FilterType = 'upcoming' | 'expired' | 'pending';
type TimeRange = 30 | 60 | 90;

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
  if (days === null) return 'bg-gray-100 text-gray-600';
  if (days < 0) return 'bg-red-100 text-red-700';
  if (days <= 14) return 'bg-red-100 text-red-700';
  if (days <= 30) return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
}

function getRenewalCost(renewal: ProviderRenewal): number {
  const stateCost = getLicenseCost(renewal.stateId);
  if (!stateCost) return 0;

  if (renewal.providerType === 'MD') {
    return stateCost.mdRenewal;
  } else {
    return stateCost.npRenewal;
  }
}

export default function UpcomingRenewals() {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');

  const renewals = useMemo(() => {
    let data: ProviderRenewal[] = [];
    switch (filter) {
      case 'upcoming':
        data = getUpcomingRenewals(timeRange);
        break;
      case 'expired':
        data = getExpiredRenewals();
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

    return data;
  }, [filter, timeRange, stateFilter, providerFilter]);

  const allStates = useMemo(() => {
    const states = new Set<string>();
    [...getUpcomingRenewals(90), ...getExpiredRenewals(), ...getPendingRenewals()]
      .forEach(r => states.add(r.stateId));
    return Array.from(states).sort();
  }, []);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    [...getUpcomingRenewals(90), ...getExpiredRenewals(), ...getPendingRenewals()]
      .forEach(r => providers.add(r.provider));
    return Array.from(providers).sort();
  }, []);

  const totalCost = useMemo(() => {
    return renewals.reduce((sum, r) => sum + getRenewalCost(r), 0);
  }, [renewals]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">License Renewals</h2>
        <p className="text-sm text-gray-500 mt-1">Track upcoming, expired, and pending renewals</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Upcoming ({getUpcomingRenewals(timeRange).length})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'expired'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Expired ({getExpiredRenewals().length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({getPendingRenewals().length})
          </button>
        </div>

        {filter === 'upcoming' && (
          <div className="flex gap-2">
            {([30, 60, 90] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {range} days
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All States</option>
            {allStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={providerFilter}
            onChange={e => setProviderFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Providers</option>
            {allProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-800">
            Showing <strong>{renewals.length}</strong> renewals
          </span>
          <span className="text-sm font-semibold text-blue-900">
            Est. Cost: ${totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {renewals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No renewals found matching your filters.
                </td>
              </tr>
            ) : (
              renewals.map((renewal, idx) => {
                const days = getDaysUntil(renewal.renewalDate);
                const cost = getRenewalCost(renewal);

                return (
                  <tr key={`${renewal.provider}-${renewal.stateId}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{renewal.provider}</div>
                      <div className="text-xs text-gray-500">{renewal.services.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renewal.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        renewal.providerType === 'MD' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {renewal.providerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renewal.isPending ? (
                        <span className="text-amber-600 font-medium">Pending</span>
                      ) : (
                        formatDate(renewal.renewalDate)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renewal.isPending ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ${cost.toLocaleString()}
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
