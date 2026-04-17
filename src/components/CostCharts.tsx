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

  return (
    <div className="space-y-6">
      {/* Top row: Cost by State and Provider Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost by State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost by State (Top 15)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByState} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="state" width={40} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="cost" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost by Provider Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
                >
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#14b8a6" />
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props) => [
                    `$${value.toLocaleString()} (${props.payload.count} providers)`,
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second row: Monthly Forecast and Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Renewal Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Renewal Forecast</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyForecast} margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'cost' ? `$${value.toLocaleString()}` : value,
                    name === 'cost' ? 'Total Cost' : 'Renewals'
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Line type="monotone" dataKey="cost" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Providers by Cost */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Providers by Cost</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProviders} layout="vertical" margin={{ left: 80, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Cost']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="cost" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
