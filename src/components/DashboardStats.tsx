import { useMemo } from 'react';
import { getAllRenewals, getUpcomingRenewals, getExpiredRenewals, getPendingRenewals } from '../data/providerLicensing';
import { getLicenseCost, DEA_COSTS } from '../data/licenseCosts';

export default function DashboardStats() {
  const stats = useMemo(() => {
    const all = getAllRenewals();
    const upcoming30 = getUpcomingRenewals(30);
    const expired = getExpiredRenewals();
    const pending = getPendingRenewals();

    // Calculate total cost for upcoming renewals
    let upcomingCost = 0;
    for (const r of upcoming30) {
      const stateCost = getLicenseCost(r.stateId);
      if (stateCost) {
        upcomingCost += r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
      }
    }

    // Calculate total annual cost
    let totalAnnualCost = 0;
    const uniqueProviders = new Set<string>();
    for (const r of all) {
      uniqueProviders.add(r.provider);
      const stateCost = getLicenseCost(r.stateId);
      if (stateCost) {
        const renewalCost = r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
        const renewalYears = r.providerType === 'MD' ? stateCost.mdRenewalYears : stateCost.npRenewalYears;
        totalAnnualCost += Math.round(renewalCost / renewalYears);
      }
    }
    // Add DEA costs
    totalAnnualCost += uniqueProviders.size * DEA_COSTS.annualEquivalent;

    // Count unique states
    const uniqueStates = new Set(all.map(r => r.stateId));

    return {
      totalProviders: uniqueProviders.size,
      totalStates: uniqueStates.size,
      totalLicenses: all.length,
      upcoming30Count: upcoming30.length,
      upcomingCost,
      expiredCount: expired.length,
      pendingCount: pending.length,
      totalAnnualCost,
    };
  }, []);

  const cards = [
    {
      label: 'Due in 30 Days',
      value: stats.upcoming30Count,
      subValue: `$${stats.upcomingCost.toLocaleString()} est.`,
      color: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Expired',
      value: stats.expiredCount,
      subValue: 'Needs attention',
      color: 'bg-red-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      subValue: 'In progress',
      color: 'bg-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Annual Cost',
      value: `$${(stats.totalAnnualCost / 1000).toFixed(0)}k`,
      subValue: `${stats.totalProviders} providers, ${stats.totalStates} states`,
      color: 'bg-green-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.subValue}</p>
            </div>
            <div className={`${card.color} text-white p-3 rounded-lg`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
