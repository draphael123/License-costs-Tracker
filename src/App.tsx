import { useState, lazy, Suspense, useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import DashboardStats from './components/DashboardStats';
import UpcomingRenewals from './components/UpcomingRenewals';
import SearchBar from './components/SearchBar';
import ProviderDetail from './components/ProviderDetail';
import ExportButton from './components/ExportButton';

// Lazy load heavier components for code splitting
const CostSummary = lazy(() => import('./components/CostSummary'));
const CostCharts = lazy(() => import('./components/CostCharts'));
const CalendarView = lazy(() => import('./components/CalendarView'));
const AuditLog = lazy(() => import('./components/AuditLog'));

import { getUpcomingRenewals, getAllRenewals } from './data/providerLicensing';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}
import { getLicenseCost } from './data/licenseCosts';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

type Tab = 'overview' | 'renewals' | 'providers' | 'charts' | 'calendar' | 'audit';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [renewalStateFilter, setRenewalStateFilter] = useState<string>('all');
  const [renewalProviderFilter] = useState<string>('all');
  const { isDark, toggleTheme } = useTheme();

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'renewals',
      label: 'Renewals',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'providers',
      label: 'By Provider',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'charts',
      label: 'Charts',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeButton = tabsRef.current[activeIndex];
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab]);

  // Data sync information - update this when importing new CSV data
  const DATA_SYNC_DATE = '4/26/2026';
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
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">License Cost Tracker</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Fountain TRT</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block w-64">
                <SearchBar
                  onSelectProvider={handleSelectProvider}
                  onSelectState={handleSelectState}
                />
              </div>

              <ExportButton />

              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
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

              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                  title="View source spreadsheet"
                >
                  Synced {lastSynced}
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Tab Navigation - Desktop */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex">
            {/* Animated indicator */}
            <div
              className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out rounded-full"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                ref={el => { tabsRef.current[idx] = el; }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-pb">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[10px] mt-1 font-medium truncate w-full text-center">
                {tab.label.replace('By ', '').replace(' Log', '')}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Renewals Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover group">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Next 30 Days
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Upcoming renewals</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('renewals')}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <UpcomingQuickView onSelectProvider={handleSelectProvider} />
                </div>
              </div>

              {/* Cost Forecast Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden card-hover group">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Cost Forecast
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Next 6 months</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('charts')}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    View charts
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
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
          <Suspense fallback={<LoadingSpinner />}>
            <CalendarView onSelectProvider={handleSelectProvider} />
          </Suspense>
        )}

        {activeTab === 'providers' && (
          <Suspense fallback={<LoadingSpinner />}>
            <CostSummary onSelectProvider={handleSelectProvider} />
          </Suspense>
        )}

        {activeTab === 'charts' && (
          <Suspense fallback={<LoadingSpinner />}>
            <CostCharts />
          </Suspense>
        )}

        {activeTab === 'audit' && (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditLog />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Fountain TRT</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Provider Licensing Cost Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-9 15H6v-3h4.5v3zm0-4.5H6v-3h4.5v3zm0-4.5H6V6h4.5v3zm7.5 9h-6v-3h6v3zm0-4.5h-6v-3h6v3zm0-4.5h-6V6h6v3z"/>
                </svg>
                Source Spreadsheet
              </a>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Synced {lastSynced}</span>
              </div>
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
      <div className="px-6 py-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">All clear!</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No renewals due in the next 30 days</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
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

        const urgencyClass = daysUntil !== null && daysUntil <= 7
          ? 'bg-red-50 dark:bg-red-900/10'
          : daysUntil !== null && daysUntil <= 14
            ? 'bg-amber-50 dark:bg-amber-900/10'
            : '';

        return (
          <div
            key={idx}
            className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group ${urgencyClass}`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <button
              onClick={() => onSelectProvider(renewal.provider)}
              className="text-left flex-1 min-w-0"
            >
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {renewal.provider}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                <span>{renewal.state}</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                  isMD
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                }`}>
                  {renewal.providerType}
                </span>
              </div>
            </button>
            <div className="text-right ml-4">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="View source fee schedule"
                  onClick={(e) => e.stopPropagation()}
                >
                  ${cost.toLocaleString()}
                  <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <div className="text-sm font-semibold text-gray-900 dark:text-white">${cost.toLocaleString()}</div>
              )}
              <div className={`text-xs font-medium mt-0.5 ${
                daysUntil !== null && daysUntil <= 7
                  ? 'text-red-600 dark:text-red-400'
                  : daysUntil !== null && daysUntil <= 14
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {daysUntil !== null ? `${daysUntil} days` : 'N/A'}
              </div>
            </div>
          </div>
        );
      })}
      {upcoming.length > 8 && (
        <div className="px-6 py-4 text-center bg-gray-50 dark:bg-gray-700/30">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            +{upcoming.length - 8} more renewals
          </span>
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
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            stroke="transparent"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="transparent"
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Estimated Cost']}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              fontSize: '13px',
              padding: '12px 16px',
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Bar
            dataKey="cost"
            fill="url(#costGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
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
