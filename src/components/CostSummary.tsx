import { useMemo } from 'react';
import { getRenewalsByProvider, PROVIDERS } from '../data/providerLicensing';
import { getLicenseCost, DEA_COSTS } from '../data/licenseCosts';

interface ProviderCostSummary {
  provider: string;
  type: 'MD' | 'NP';
  services: string[];
  stateCount: number;
  totalAnnualCost: number;
  upcomingCost: number; // Cost for renewals in next 12 months
  states: { stateId: string; stateName: string; cost: number; renewalDate: Date | null }[];
}

interface CostSummaryProps {
  onSelectProvider?: (provider: string) => void;
}

export default function CostSummary({ onSelectProvider }: CostSummaryProps) {
  const providerCosts = useMemo<ProviderCostSummary[]>(() => {
    const byProvider = getRenewalsByProvider();
    const summaries: ProviderCostSummary[] = [];

    for (const [providerName, renewals] of Object.entries(byProvider)) {
      const providerInfo = PROVIDERS.find(p => p.name === providerName);
      if (!providerInfo) continue;

      const states: ProviderCostSummary['states'] = [];
      let totalAnnualCost = 0;

      for (const renewal of renewals) {
        const stateCost = getLicenseCost(renewal.stateId);
        if (!stateCost) continue;

        const cost = renewal.providerType === 'MD'
          ? Math.round(stateCost.mdRenewal / stateCost.mdRenewalYears)
          : Math.round(stateCost.npRenewal / stateCost.npRenewalYears);

        totalAnnualCost += cost;
        states.push({
          stateId: renewal.stateId,
          stateName: renewal.state,
          cost: renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal,
          renewalDate: renewal.renewalDate,
        });
      }

      // Add DEA cost (annualized)
      totalAnnualCost += DEA_COSTS.annualEquivalent;

      summaries.push({
        provider: providerName,
        type: providerInfo.type,
        services: providerInfo.services,
        stateCount: states.length,
        totalAnnualCost,
        upcomingCost: 0, // Calculate separately
        states: states.sort((a, b) => a.stateName.localeCompare(b.stateName)),
      });
    }

    return summaries.sort((a, b) => b.totalAnnualCost - a.totalAnnualCost);
  }, []);

  const totalAnnualCost = useMemo(() => {
    return providerCosts.reduce((sum, p) => sum + p.totalAnnualCost, 0);
  }, [providerCosts]);

  const mdCount = providerCosts.filter(p => p.type === 'MD').length;
  const npCount = providerCosts.filter(p => p.type === 'NP').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cost by Provider</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Annual licensing costs breakdown</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Annual Cost</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${totalAnnualCost.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Active Providers</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{providerCosts.length}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{mdCount} MD, {npCount} NP</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Cost per Provider</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${Math.round(totalAnnualCost / providerCosts.length).toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">DEA Annual (per provider)</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${DEA_COSTS.annualEquivalent}
          </div>
        </div>
      </div>

      {/* Provider Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Services</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">States</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Annual Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {providerCosts.map((provider) => (
              <tr key={provider.provider} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {onSelectProvider ? (
                    <button
                      onClick={() => onSelectProvider(provider.provider)}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {provider.provider}
                    </button>
                  ) : (
                    <div className="font-medium text-gray-900 dark:text-white">{provider.provider}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    provider.type === 'MD'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                  }`}>
                    {provider.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {provider.services.map(service => (
                      <span
                        key={service}
                        className={`px-1.5 py-0.5 text-xs rounded ${
                          service === 'TRT' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' :
                          service === 'HRT' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                          service === 'GLP' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white">
                  {provider.stateCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">${provider.totalAnnualCost.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">incl. DEA</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
