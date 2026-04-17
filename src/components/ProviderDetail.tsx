import { useMemo } from 'react';
import { getAllRenewals, PROVIDERS } from '../data/providerLicensing';
import { getLicenseCost, DEA_COSTS } from '../data/licenseCosts';

interface ProviderDetailProps {
  providerName: string;
  onClose: () => void;
}

function formatDate(date: Date | null): string {
  if (!date) return 'Pending';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysUntil(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatusColor(days: number | null): string {
  if (days === null) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  if (days < 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (days <= 30) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (days <= 60) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

export default function ProviderDetail({ providerName, onClose }: ProviderDetailProps) {
  const providerInfo = PROVIDERS.find(p => p.name === providerName);

  const renewals = useMemo(() => {
    return getAllRenewals()
      .filter(r => r.provider === providerName)
      .sort((a, b) => {
        if (!a.renewalDate && !b.renewalDate) return a.state.localeCompare(b.state);
        if (!a.renewalDate) return 1;
        if (!b.renewalDate) return -1;
        return a.renewalDate.getTime() - b.renewalDate.getTime();
      });
  }, [providerName]);

  const stats = useMemo(() => {
    let totalCost = 0;
    let annualCost = 0;
    let upcomingCount = 0;
    let expiredCount = 0;
    let pendingCount = 0;

    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const r of renewals) {
      const stateCost = getLicenseCost(r.stateId);
      if (stateCost) {
        const cost = r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
        const years = r.providerType === 'MD' ? stateCost.mdRenewalYears : stateCost.npRenewalYears;
        totalCost += cost;
        annualCost += Math.round(cost / years);
      }

      if (r.isPending) {
        pendingCount++;
      } else if (r.renewalDate && r.renewalDate < now) {
        expiredCount++;
      } else if (r.renewalDate && r.renewalDate <= thirtyDays) {
        upcomingCount++;
      }
    }

    // Add DEA
    annualCost += DEA_COSTS.annualEquivalent;

    return { totalCost, annualCost, upcomingCount, expiredCount, pendingCount };
  }, [renewals]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{providerName}</h2>
              {providerInfo && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    providerInfo.type === 'MD'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                      : 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                  }`}>
                    {providerInfo.type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {providerInfo.services.join(' / ')}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">States Licensed</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{renewals.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Annual Cost</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.annualCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Due in 30 Days</div>
              <div className={`text-2xl font-bold ${stats.upcomingCount > 0 ? 'text-amber-600' : 'text-gray-900 dark:text-white'}`}>
                {stats.upcomingCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Expired</div>
              <div className={`text-2xl font-bold ${stats.expiredCount > 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                {stats.expiredCount}
              </div>
            </div>
          </div>

          {/* License Table */}
          <div className="overflow-y-auto max-h-[50vh]">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Renewal Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {renewals.map((renewal, idx) => {
                  const days = getDaysUntil(renewal.renewalDate);
                  const stateCost = getLicenseCost(renewal.stateId);
                  const isMD = renewal.providerType === 'MD';
                  const cost = stateCost
                    ? (isMD ? stateCost.mdRenewal : stateCost.npRenewal)
                    : 0;
                  const sourceUrl = stateCost
                    ? (isMD ? stateCost.mdSourceUrl : stateCost.npSourceUrl)
                    : undefined;

                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{renewal.state}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{renewal.stateId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(renewal.renewalDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(days)}`}>
                          {days === null
                            ? 'Pending'
                            : days < 0
                              ? `${Math.abs(days)}d overdue`
                              : `${days}d`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {sourceUrl ? (
                          <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                            title="View source fee schedule"
                          >
                            ${cost.toLocaleString()}
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-900 dark:text-white">${cost.toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Total renewal costs: <strong className="text-gray-900 dark:text-white">${stats.totalCost.toLocaleString()}</strong>
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                + DEA: <strong className="text-gray-900 dark:text-white">${DEA_COSTS.renewalFee}/3yr</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
