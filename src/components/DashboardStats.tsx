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
      gradient: 'from-blue-500 to-cyan-500',
      bgClass: 'stat-card-blue',
      iconBg: 'bg-blue-500/20 dark:bg-blue-500/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Expired',
      value: stats.expiredCount,
      subValue: stats.expiredCount > 0 ? 'Needs attention' : 'All clear',
      gradient: 'from-red-500 to-orange-500',
      bgClass: 'stat-card-red',
      iconBg: 'bg-red-500/20 dark:bg-red-500/30',
      iconColor: 'text-red-600 dark:text-red-400',
      valueColor: stats.expiredCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white',
      pulse: stats.expiredCount > 0,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      subValue: 'In progress',
      gradient: 'from-amber-500 to-yellow-500',
      bgClass: 'stat-card-amber',
      iconBg: 'bg-amber-500/20 dark:bg-amber-500/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Annual Cost',
      value: `$${(stats.totalAnnualCost / 1000).toFixed(0)}k`,
      subValue: `${stats.totalProviders} providers, ${stats.totalStates} states`,
      gradient: 'from-green-500 to-emerald-500',
      bgClass: 'stat-card-green',
      iconBg: 'bg-green-500/20 dark:bg-green-500/30',
      iconColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-600 dark:text-green-400',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`
            relative overflow-hidden
            bg-white dark:bg-gray-800 rounded-2xl
            border border-gray-100 dark:border-gray-700/50
            p-6
            card-hover group
            animate-fade-in-up
            ${card.bgClass}
          `}
          style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'backwards' }}
        >
          {/* Decorative gradient accent */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-5 dark:opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`} />

          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                {card.label}
              </p>
              <p className={`text-4xl font-bold ${card.valueColor} tracking-tight`}>
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                {card.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {card.subValue}
              </p>
            </div>
            <div className={`${card.iconBg} ${card.iconColor} p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              {card.icon}
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      ))}
    </div>
  );
}
