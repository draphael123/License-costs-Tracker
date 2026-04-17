import { useState } from 'react';
import DashboardStats from './components/DashboardStats';
import UpcomingRenewals from './components/UpcomingRenewals';
import CostSummary from './components/CostSummary';
import CostCharts from './components/CostCharts';

type Tab = 'overview' | 'renewals' | 'providers' | 'charts';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'renewals', label: 'Renewals' },
    { id: 'providers', label: 'By Provider' },
    { id: 'charts', label: 'Charts' },
  ];

  // Get last updated date (current date for now)
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">License Cost Tracker</h1>
                <p className="text-xs text-gray-500">Provider Licensing Dashboard</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-gray-900">{lastUpdated}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick view of upcoming renewals */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Next 30 Days</h2>
                    <p className="text-sm text-gray-500">Upcoming renewals</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('renewals')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all →
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <UpcomingQuickView />
                </div>
              </div>

              {/* Monthly cost preview chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Cost Forecast</h2>
                    <p className="text-sm text-gray-500">Next 12 months</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('charts')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View charts →
                  </button>
                </div>
                <div className="p-4">
                  <QuickForecastChart />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'renewals' && <UpcomingRenewals />}
        {activeTab === 'providers' && <CostSummary />}
        {activeTab === 'charts' && <CostCharts />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Fountain Vitality - Provider Licensing Cost Tracker
            </p>
            <p className="text-sm text-gray-400">
              Data updates weekly from Provider Compliance Dashboard
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Quick view component for overview tab
import { getUpcomingRenewals } from './data/providerLicensing';
import { getLicenseCost } from './data/licenseCosts';

function UpcomingQuickView() {
  const upcoming = getUpcomingRenewals(30);

  if (upcoming.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No renewals due in the next 30 days
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {upcoming.slice(0, 8).map((renewal, idx) => {
        const stateCost = getLicenseCost(renewal.stateId);
        const cost = stateCost
          ? (renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal)
          : 0;
        const daysUntil = renewal.renewalDate
          ? Math.ceil((renewal.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;

        return (
          <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
            <div>
              <div className="font-medium text-gray-900">{renewal.provider}</div>
              <div className="text-sm text-gray-500">{renewal.state}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">${cost.toLocaleString()}</div>
              <div className={`text-xs ${daysUntil && daysUntil <= 14 ? 'text-red-600' : 'text-gray-500'}`}>
                {daysUntil !== null ? `${daysUntil} days` : 'N/A'}
              </div>
            </div>
          </div>
        );
      })}
      {upcoming.length > 8 && (
        <div className="px-6 py-3 text-center text-sm text-gray-500">
          +{upcoming.length - 8} more renewals
        </div>
      )}
    </div>
  );
}

// Quick forecast chart for overview tab
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getAllRenewals } from './data/providerLicensing';

function QuickForecastChart() {
  const monthlyData = (() => {
    const renewals = getAllRenewals().filter(r => r.renewalDate);
    const monthly: Record<string, number> = {};

    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short' });
      monthly[key] = 0;
    }

    for (const renewal of renewals) {
      if (!renewal.renewalDate) continue;
      const key = renewal.renewalDate.toLocaleDateString('en-US', { month: 'short' });
      if (!(key in monthly)) continue;

      const stateCost = getLicenseCost(renewal.stateId);
      if (stateCost) {
        const cost = renewal.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
        monthly[key] += cost;
      }
    }

    return Object.entries(monthly).map(([month, cost]) => ({ month, cost }));
  })();

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          />
          <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
