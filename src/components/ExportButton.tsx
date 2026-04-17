import { useState } from 'react';
import { getAllRenewals, getUpcomingRenewals, getExpiredRenewals, getPendingRenewals } from '../data/providerLicensing';
import { getLicenseCost } from '../data/licenseCosts';

type ExportType = 'all' | 'upcoming' | 'expired' | 'pending';

export default function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);

  function exportToCSV(type: ExportType) {
    let renewals;
    let filename;

    switch (type) {
      case 'upcoming':
        renewals = getUpcomingRenewals(90);
        filename = 'upcoming-renewals';
        break;
      case 'expired':
        renewals = getExpiredRenewals();
        filename = 'expired-renewals';
        break;
      case 'pending':
        renewals = getPendingRenewals();
        filename = 'pending-renewals';
        break;
      default:
        renewals = getAllRenewals();
        filename = 'all-renewals';
    }

    const headers = ['Provider', 'State', 'State ID', 'Type', 'Services', 'Renewal Date', 'Status', 'Est. Cost'];

    const rows = renewals.map(r => {
      const stateCost = getLicenseCost(r.stateId);
      const cost = stateCost
        ? (r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal)
        : 0;

      const daysUntil = r.renewalDate
        ? Math.ceil((r.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

      let status = 'Pending';
      if (r.renewalDate) {
        if (daysUntil !== null && daysUntil < 0) {
          status = `${Math.abs(daysUntil)} days overdue`;
        } else if (daysUntil !== null) {
          status = `${daysUntil} days`;
        }
      }

      return [
        r.provider,
        r.state,
        r.stateId,
        r.providerType,
        r.services.join('/'),
        r.renewalDate ? r.renewalDate.toLocaleDateString() : 'Pending',
        status,
        `$${cost}`,
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setIsOpen(false);
  }

  function exportToPDF(type: ExportType) {
    // For PDF, we'll create a printable HTML and use window.print()
    let renewals;
    let title;

    switch (type) {
      case 'upcoming':
        renewals = getUpcomingRenewals(90);
        title = 'Upcoming Renewals (Next 90 Days)';
        break;
      case 'expired':
        renewals = getExpiredRenewals();
        title = 'Expired Renewals';
        break;
      case 'pending':
        renewals = getPendingRenewals();
        title = 'Pending Renewals';
        break;
      default:
        renewals = getAllRenewals();
        title = 'All License Renewals';
    }

    let totalCost = 0;
    const tableRows = renewals.map(r => {
      const stateCost = getLicenseCost(r.stateId);
      const cost = stateCost
        ? (r.providerType === 'MD' ? stateCost.mdRenewal : stateCost.npRenewal)
        : 0;
      totalCost += cost;

      return `
        <tr>
          <td>${r.provider}</td>
          <td>${r.state}</td>
          <td>${r.providerType}</td>
          <td>${r.renewalDate ? r.renewalDate.toLocaleDateString() : 'Pending'}</td>
          <td style="text-align: right">$${cost.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          .subtitle { color: #666; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; font-weight: 600; }
          .total { margin-top: 24px; font-size: 18px; font-weight: 600; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="subtitle">Generated on ${new Date().toLocaleDateString()} - ${renewals.length} renewals</div>
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>State</th>
              <th>Type</th>
              <th>Renewal Date</th>
              <th style="text-align: right">Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="total">Total Estimated Cost: $${totalCost.toLocaleString()}</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }

    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Export as CSV
              </div>
              <button onClick={() => exportToCSV('all')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                All Renewals
              </button>
              <button onClick={() => exportToCSV('upcoming')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Upcoming (90 days)
              </button>
              <button onClick={() => exportToCSV('expired')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Expired
              </button>
              <button onClick={() => exportToCSV('pending')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Pending
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Print / PDF
              </div>
              <button onClick={() => exportToPDF('all')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                All Renewals
              </button>
              <button onClick={() => exportToPDF('upcoming')} className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Upcoming (90 days)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
