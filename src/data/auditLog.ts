/**
 * Audit Log System
 * Tracks data changes and sync events
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'data_sync' | 'provider_added' | 'provider_removed' | 'license_updated' | 'manual_edit';
  description: string;
  details?: string;
  user?: string;
  affectedRecords?: number;
}

// Audit log entries - add new entries at the top when data changes
export const AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'sync-2026-04-17',
    timestamp: '2026-04-17T10:00:00Z',
    action: 'data_sync',
    description: 'Full data sync from CSV export',
    details: 'Updated all provider licensing data from Google Sheets export dated 4/10/2026. Added new providers: Emmanuel Oluwaseyi Sonaike, Naureen Majid Adam, Nicole Tahira Perrotte. Renamed Victor L to Victor C. Fixed Pennsylvania data.',
    user: 'System',
    affectedRecords: 25
  },
  {
    id: 'fix-2026-04-16',
    timestamp: '2026-04-16T15:30:00Z',
    action: 'license_updated',
    description: 'Removed Alexis from Pennsylvania',
    details: 'Corrected data discrepancy - Alexis Foster-Horton was incorrectly listed as licensed in Pennsylvania.',
    user: 'System',
    affectedRecords: 1
  },
  {
    id: 'url-fix-2026-04-15',
    timestamp: '2026-04-15T14:00:00Z',
    action: 'manual_edit',
    description: 'Fixed license cost source URLs',
    details: 'Updated state board URLs to use verified homepage links instead of deep links that were returning 404 errors.',
    user: 'System',
    affectedRecords: 50
  },
  {
    id: 'initial-2026-04-01',
    timestamp: '2026-04-01T09:00:00Z',
    action: 'data_sync',
    description: 'Initial data import',
    details: 'Initial import of provider licensing data from Google Sheets. Includes 24 providers across 32 active operating states.',
    user: 'System',
    affectedRecords: 350
  }
];

export function getAuditLog(): AuditLogEntry[] {
  return AUDIT_LOG.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getRecentAuditEntries(count: number = 5): AuditLogEntry[] {
  return getAuditLog().slice(0, count);
}

export function formatAuditDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getActionLabel(action: AuditLogEntry['action']): string {
  const labels: Record<AuditLogEntry['action'], string> = {
    data_sync: 'Data Sync',
    provider_added: 'Provider Added',
    provider_removed: 'Provider Removed',
    license_updated: 'License Updated',
    manual_edit: 'Manual Edit'
  };
  return labels[action];
}

export function getActionColor(action: AuditLogEntry['action']): string {
  const colors: Record<AuditLogEntry['action'], string> = {
    data_sync: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    provider_added: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    provider_removed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    license_updated: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    manual_edit: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  };
  return colors[action];
}
