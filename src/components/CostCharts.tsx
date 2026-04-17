import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { getAllRenewals, getRenewalsByState } from '../data/providerLicensing';
import { getLicenseCost, DEA_COSTS } from '../data/licenseCosts';

export default function CostCharts() {
  // Cost by state chart data
  const costByState = useMemo(() => {
    const byState = getRenewalsByState();
    const stateData: { state: string; cost: number; providers: number }[] = [];

    for (const [stateName, renewals] of Object.entries(byState)) {
      let totalCost = 0;
      const stateId = renewals[0]?.stateId;
      const stateCost = stateId ? getLicenseCost(stateId) : null;

      for (const renewal of renewals) {
        if (!stateCost) continue;
        const cost = renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
        totalCost += cost;
      }

      if (totalCost > 0) {
        stateData.push({
          state: stateId || stateName.slice(0, 2),
          cost: totalCost,
          providers: renewals.length,
        });
      }
    }

    return stateData.sort((a, b) => b.cost - a.cost).slice(0, 15);
  }, []);

  // Provider type distribution
  const providerTypeData = useMemo(() => {
    let mdCost = 0;
    let npCost = 0;
    let mdCount = 0;
    let npCount = 0;

    const renewals = getAllRenewals();
    const seen = new Set<string>();

    for (const renewal of renewals) {
      const stateCost = getLicenseCost(renewal.stateId);
      if (!stateCost) continue;

      const cost = renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;

      if (renewal.providerType === 'MD') {
        mdCost += cost;
        if (!seen.has(renewal.provider)) {
          mdCount++;
          seen.add(renewal.provider);
        }
      } else {
        npCost += cost;
        if (!seen.has(renewal.provider)) {
          npCount++;
          seen.add(renewal.provider);
        }
      }
    }

    return [
      { name: 'MD', value: mdCost, count: mdCount },
      { name: 'NP', value: npCost, count: npCount },
    ];
  }, []);

  // Monthly renewal forecast
  const monthlyForecast = useMemo(() => {
    const renewals = getAllRenewals().filter(r => r.renewalDate);
    const monthly: Record<string, { month: string; cost: number; count: number }> = {};

    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), 1);

    for (const renewal of renewals) {
      if (!renewal.renewalDate || renewal.renewalDate > nextYear) continue;

      const monthKey = renewal.renewalDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const stateCost = getLicenseCost(renewal.stateId);
      if (!stateCost) continue;

      const cost = renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;

      if (!monthly[monthKey]) {
        monthly[monthKey] = { month: monthKey, cost: 0, count: 0 };
      }
      monthly[monthKey].cost += cost;
      monthly[monthKey].count++;
    }

    // Sort by date
    return Object.values(monthly).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Top providers by cost
  const topProviders = useMemo(() => {
    const providerCosts: Record<string, number> = {};

    for (const renewal of getAllRenewals()) {
      const stateCost = getLicenseCost(renewal.stateId);
      if (!stateCost) continue;

      const cost = renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
      providerCosts[renewal.provider] = (providerCosts[renewal.provider] || 0) + cost;
    }

    // Add DEA cost per provider
    for (const provider of Object.keys(providerCosts)) {
      providerCosts[provider] += DEA_COSTS.renewalFee;
    }

    return Object.entries(providerCosts)
      .map(([name, cost]) => ({ name, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, []);

  const tooltipStyle = {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    fontSize: '13px',
    padding: '12px 16px',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top row: Cost by State and Provider Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by State */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost by State</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top 15 states by renewal cost</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByState} layout="vertical" margin={{ left: 40, right: 20 }}>
                <defs>
                  <linearGradient id="stateGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={40}
                  tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="cost" fill="url(#stateGradient)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cost by Provider Type</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">MD vs NP distribution</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="mdGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="npGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
                <Pie
                  data={providerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                >
                  <Cell fill="url(#mdGradient)" stroke="transparent" />
                  <Cell fill="url(#npGradient)" stroke="transparent" />
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props) => [
                    `$${value.toLocaleString()} (${props.payload.count} providers)`,
                    name
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row: Monthly Forecast and Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Renewal Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Forecast</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Renewal costs over time</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyForecast} margin={{ left: 10, right: 20, top: 10 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'cost' ? `$${value.toLocaleString()}` : value,
                    name === 'cost' ? 'Total Cost' : 'Renewals'
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 3, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Providers by Cost */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Providers</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Highest licensing costs</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProviders} layout="vertical" margin={{ left: 80, right: 20 }}>
                <defs>
                  <linearGradient id="providerGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Cost']}
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                />
                <Bar dataKey="cost" fill="url(#providerGradient)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
