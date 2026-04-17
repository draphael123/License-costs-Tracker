import { useState } from 'react';
import {
  getAuditLog,
  formatAuditDate,
  getActionLabel,
  getActionColor,
  AuditLogEntry
} from '../data/auditLog';

export default function AuditLog() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const entries = getAuditLog();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track data changes and sync history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {entries.length} entries
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {entries.map((entry) => (
          <AuditLogItem
            key={entry.id}
            entry={entry}
            isExpanded={expandedId === entry.id}
            onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface AuditLogItemProps {
  entry: AuditLogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

function AuditLogItem({ entry, isExpanded, onToggle }: AuditLogItemProps) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Timeline dot */}
        <div className="flex-shrink-0 mt-1">
          <div className={`w-3 h-3 rounded-full ${
            entry.action === 'data_sync' ? 'bg-blue-500' :
            entry.action === 'provider_added' ? 'bg-green-500' :
            entry.action === 'provider_removed' ? 'bg-red-500' :
            entry.action === 'license_updated' ? 'bg-amber-500' :
            'bg-purple-500'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getActionColor(entry.action)}`}>
              {getActionLabel(entry.action)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatAuditDate(entry.timestamp)}
            </span>
            {entry.user && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                by {entry.user}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {entry.description}
          </p>

          {entry.affectedRecords !== undefined && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {entry.affectedRecords} record{entry.affectedRecords !== 1 ? 's' : ''} affected
            </p>
          )}

          {/* Expanded details */}
          {isExpanded && entry.details && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {entry.details}
              </p>
            </div>
          )}
        </div>

        {/* Expand icon */}
        {entry.details && (
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for dashboard overview
export function AuditLogCompact() {
  const entries = getAuditLog().slice(0, 3);

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
            entry.action === 'data_sync' ? 'bg-blue-500' :
            entry.action === 'provider_added' ? 'bg-green-500' :
            entry.action === 'provider_removed' ? 'bg-red-500' :
            entry.action === 'license_updated' ? 'bg-amber-500' :
            'bg-purple-500'
          }`} />
          <div className="min-w-0">
            <p className="text-sm text-gray-900 dark:text-white truncate">
              {entry.description}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatAuditDate(entry.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
