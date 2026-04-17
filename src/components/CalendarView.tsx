import { useMemo, useState } from 'react';
import { getAllRenewals, ProviderRenewal } from '../data/providerLicensing';
import { getLicenseCost } from '../data/licenseCosts';

interface CalendarViewProps {
  onSelectProvider: (provider: string) => void;
}

export default function CalendarView({ onSelectProvider }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renewalsByDate = useMemo(() => {
    const map = new Map<string, ProviderRenewal[]>();
    for (const r of getAllRenewals()) {
      if (r.renewalDate) {
        const key = r.renewalDate.toISOString().split('T')[0];
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(r);
      }
    }
    return map;
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean; renewals: ProviderRenewal[] }[] = [];

    // Fill in days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const key = date.toISOString().split('T')[0];
      days.push({ date, isCurrentMonth: false, renewals: renewalsByDate.get(key) || [] });
    }

    // Fill in days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().split('T')[0];
      days.push({ date, isCurrentMonth: true, renewals: renewalsByDate.get(key) || [] });
    }

    // Fill in days from next month
    const endPadding = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      const key = date.toISOString().split('T')[0];
      days.push({ date, isCurrentMonth: false, renewals: renewalsByDate.get(key) || [] });
    }

    return days;
  }, [currentDate, renewalsByDate]);

  const monthStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let count = 0;
    let cost = 0;

    for (const r of getAllRenewals()) {
      if (r.renewalDate && r.renewalDate.getFullYear() === year && r.renewalDate.getMonth() === month) {
        count++;
        const stateCost = getLicenseCost(r.stateId);
        if (stateCost) {
          cost += r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal;
        }
      }
    }

    return { count, cost };
  }, [currentDate]);

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {monthStats.count} renewals this month - ${monthStats.cost.toLocaleString()} est.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dateKey = day.date.toISOString().split('T')[0];
            const isToday = dateKey === todayKey;
            const hasRenewals = day.renewals.length > 0;

            return (
              <div
                key={idx}
                className={`min-h-[80px] p-1 rounded-lg border ${
                  day.isCurrentMonth
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-xs font-medium mb-1 ${
                  day.isCurrentMonth
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-600'
                } ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {day.date.getDate()}
                </div>

                {hasRenewals && (
                  <div className="space-y-0.5">
                    {day.renewals.slice(0, 2).map((r, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectProvider(r.provider)}
                        className="w-full text-left px-1 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 truncate hover:bg-blue-200 dark:hover:bg-blue-900"
                      >
                        {r.provider}
                      </button>
                    ))}
                    {day.renewals.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                        +{day.renewals.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700" />
            <span>Renewal due</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded ring-2 ring-blue-500" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
