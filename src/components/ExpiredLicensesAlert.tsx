import { useState, useMemo } from 'react';
import { getExpiredRenewals } from '../data/providerLicensing';

interface Props {
  onSelectProvider: (provider: string) => void;
}

export default function ExpiredLicensesAlert({ onSelectProvider }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const expired = useMemo(() => getExpiredRenewals(), []);

  if (expired.length === 0) return null;

  const criticalCount = expired.filter(e => {
    if (!e.renewalDate) return false;
    const daysExpired = Math.floor((Date.now() - e.renewalDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysExpired > 90;
  }).length;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            {expired.length} Expired License{expired.length !== 1 ? 's' : ''} Detected
            {criticalCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                {criticalCount} critical (90+ days)
              </span>
            )}
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            These licenses have passed their renewal date and require immediate attention.
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 flex items-center gap-1"
          >
            {isExpanded ? 'Hide details' : 'Show details'}
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {expired.map((renewal, idx) => {
                const daysExpired = renewal.renewalDate
                  ? Math.floor((Date.now() - renewal.renewalDate.getTime()) / (1000 * 60 * 60 * 24))
                  : 0;
                const isCritical = daysExpired > 90;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isCritical
                        ? 'bg-red-100 dark:bg-red-900/40'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <button
                      onClick={() => onSelectProvider(renewal.provider)}
                      className="text-left flex-1"
                    >
                      <span className="font-medium text-red-900 dark:text-red-100 hover:underline">
                        {renewal.provider}
                      </span>
                      <span className="text-red-700 dark:text-red-300 mx-2">-</span>
                      <span className="text-red-700 dark:text-red-300">{renewal.state}</span>
                    </button>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isCritical ? 'text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'}`}>
                        {daysExpired} days ago
                      </div>
                      <div className="text-xs text-red-500 dark:text-red-400">
                        {renewal.dateString}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
