import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import DashboardStats from './components/DashboardStats';
import UpcomingRenewals from './components/UpcomingRenewals';
import CostSummary from './components/CostSummary';
import CostCharts from './components/CostCharts';
import CalendarView from './components/CalendarView';
import SearchBar from './components/SearchBar';
import ProviderDetail from './components/ProviderDetail';
import ExportButton from './components/ExportButton';
import AuditLog from './components/AuditLog';
import { getUpcomingRenewals, getAllRenewals } from './data/providerLicensing';
import { getLicenseCost } from './data/licenseCosts';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

type Tab = 'overview' | 'renewals' | 'providers' | 'charts' | 'calendar' | 'audit';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [renewalStateFilter, setRenewalStateFilter] = useState<string>('all');
  const [renewalProviderFilter] = useState<string>('all');
  const { isDark, toggleTheme } = useTheme();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'renewals', label: 'Renewals' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'providers', label: 'By Provider' },
    { id: 'charts', label: 'Charts' },
    { id: 'audit', label: 'Audit Log' },
  ];

  // Data sync information - update this when importing new CSV data
  const DATA_SYNC_DATE = '4/17/2026';
  const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1jJEb7PH14i3Byn5C5n90IFLYVOBXVGwzQrTsOA5Usgs/edit?gid=1028248383#gid=1028248383';

  const lastSynced = new Date(DATA_SYNC_DATE).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function handleSelectProvider(provider: string) {
    setSelectedProvider(provider);
  }

  function handleSelectState(stateId: string) {
    setRenewalStateFilter(stateId);
    setActiveTab('renewals');
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">License Cost Tracker</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Provider Licensing Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block w-64">
                <SearchBar
                  onSelectProvider={handleSelectProvider}
                  onSelectState={handleSelectState}
                />
              </div>

              <ExportButton />

              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="hidden md:block text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Data Synced</div>
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                  title="View source spreadsheet"
                >
                  {lastSynced}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search */}
      <div className="md:hidden px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <SearchBar
          onSelectProvider={handleSelectProvider}
          onSelectState={handleSelectState}
        />
      </div>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Next 30 Days</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming renewals</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('renewals')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <UpcomingQuickView onSelectProvider={handleSelectProvider} />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cost Forecast</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next 6 months</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('charts')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View charts
                  </button>
                </div>
                <div className="p-4">
                  <QuickForecastChart />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'renewals' && (
          <UpcomingRenewals
            initialStateFilter={renewalStateFilter}
            initialProviderFilter={renewalProviderFilter}
            onSelectProvider={handleSelectProvider}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView onSelectProvider={handleSelectProvider} />
        )}

        {activeTab === 'providers' && (
          <CostSummary onSelectProvider={handleSelectProvider} />
        )}

        {activeTab === 'charts' && <CostCharts />}

        {activeTab === 'audit' && <AuditLog />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fountain TRT - Provider Licensing Cost Tracker
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-9 15H6v-3h4.5v3zm0-4.5H6v-3h4.5v3zm0-4.5H6V6h4.5v3zm7.5 9h-6v-3h6v3zm0-4.5h-6v-3h6v3zm0-4.5h-6V6h6v3z"/>
                </svg>
                Source Spreadsheet
              </a>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <span className="text-gray-400 dark:text-gray-500">
                Last synced: {lastSynced}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Provider Detail Modal */}
      {selectedProvider && (
        <ProviderDetail
          providerName={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}

function UpcomingQuickView({ onSelectProvider }: { onSelectProvider: (provider: string) => void }) {
  const upcoming = getUpcomingRenewals(30);

  if (upcoming.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
        No renewals due in the next 30 days
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {upcoming.slice(0, 8).map((renewal, idx) => {
        const stateCost = getLicenseCost(renewal.stateId);
        const isMD = renewal.providerType === 'MD';
        const cost = stateCost
          ? (isMD ? stateCost.mdRenewal : stateCost.npRenewal)
          : 0;
        const sourceUrl = stateCost
          ? (isMD ? stateCost.mdSourceUrl : stateCost.npSourceUrl)
          : undefined;
        const daysUntil = renewal.renewalDate
          ? Math.ceil((renewal.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;

        return (
          <div
            key={idx}
            className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <button
              onClick={() => onSelectProvider(renewal.provider)}
              className="text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{renewal.provider}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{renewal.state}</div>
            </button>
            <div className="text-right">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  title="View source fee schedule"
                  onClick={(e) => e.stopPropagation()}
                >
                  ${cost.toLocaleString()}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="text-sm font-medium text-gray-900 dark:text-white">${cost.toLocaleString()}</div>
              )}
              <div className={`text-xs ${daysUntil && daysUntil <= 14 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {daysUntil !== null ? `${daysUntil} days` : 'N/A'}
              </div>
            </div>
          </div>
        );
      })}
      {upcoming.length > 8 && (
        <div className="px-6 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
          +{upcoming.length - 8} more renewals
        </div>
      )}
    </div>
  );
}

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
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} stroke="#9ca3af" />
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
