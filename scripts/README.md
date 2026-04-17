# Data Sync Scripts

## Automated Google Sheets Sync

This project supports automated syncing of licensing data from Google Sheets.

### Setup Instructions

#### 1. Publish Google Sheet as CSV

1. Open your Google Sheet: [Provider Licensing Sheet](https://docs.google.com/spreadsheets/d/1jJEb7PH14i3Byn5C5n90IFLYVOBXVGwzQrTsOA5Usgs/edit)
2. Go to **File > Share > Publish to web**
3. Select the "Providers (Master)" sheet
4. Choose **Comma-separated values (.csv)** format
5. Click **Publish**
6. Copy the generated URL

#### 2. Add GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables > Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_SHEET_CSV_URL`
5. Value: Paste the CSV URL from step 1

#### 3. Enable GitHub Actions

The workflow will automatically:
- Run every Sunday at 6 AM UTC (1 AM EST)
- Fetch the latest data from Google Sheets
- Create a Pull Request if there are changes

You can also manually trigger the sync:
1. Go to **Actions** tab in GitHub
2. Select "Sync Licensing Data"
3. Click **Run workflow**

### Manual Sync

To manually sync data locally:

```bash
# Using a local CSV file
node scripts/sync-data.js --file "path/to/your/file.csv"

# Using environment variable
GOOGLE_SHEET_CSV_URL="your-csv-url" node scripts/sync-data.js
```

### Updating the Data Sync Date

After syncing, remember to update the `DATA_SYNC_DATE` in `src/App.tsx`:

```typescript
const DATA_SYNC_DATE = '4/17/2026'; // Update to current date
```

And add an entry to `src/data/auditLog.ts`:

```typescript
{
  id: 'sync-2026-04-17',
  timestamp: '2026-04-17T10:00:00Z',
  action: 'data_sync',
  description: 'Weekly data sync from Google Sheets',
  details: 'Automated sync via GitHub Actions',
  user: 'System',
  affectedRecords: 25
}
```
