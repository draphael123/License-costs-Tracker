import { useState, useEffect, useRef } from 'react';
import { getAllRenewals, PROVIDERS } from '../data/providerLicensing';
import { ACTIVE_STATES } from '../data/providerLicensing';
import { getStateName } from '../data/licenseCosts';

interface SearchResult {
  type: 'provider' | 'state';
  id: string;
  label: string;
  subtitle?: string;
}

interface SearchBarProps {
  onSelectProvider: (provider: string) => void;
  onSelectState: (stateId: string) => void;
}

export default function SearchBar({ onSelectProvider, onSelectState }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search providers
    const renewals = getAllRenewals();
    const providerNames = [...new Set(renewals.map(r => r.provider))];

    for (const name of providerNames) {
      if (name.toLowerCase().includes(q)) {
        const providerInfo = PROVIDERS.find(p => p.name === name);
        matches.push({
          type: 'provider',
          id: name,
          label: name,
          subtitle: providerInfo ? `${providerInfo.type} - ${providerInfo.services.join(', ')}` : undefined,
        });
      }
    }

    // Search states
    for (const stateId of ACTIVE_STATES) {
      const stateName = getStateName(stateId);
      if (stateName.toLowerCase().includes(q) || stateId.toLowerCase().includes(q)) {
        const stateRenewals = renewals.filter(r => r.stateId === stateId);
        matches.push({
          type: 'state',
          id: stateId,
          label: stateName,
          subtitle: `${stateRenewals.length} providers licensed`,
        });
      }
    }

    setResults(matches.slice(0, 8));
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      selectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  function selectResult(result: SearchResult) {
    if (result.type === 'provider') {
      onSelectProvider(result.id);
    } else {
      onSelectState(result.id);
    }
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search providers or states..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {results.map((result, idx) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => selectResult(result)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 ${
                idx === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                result.type === 'provider'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {result.type === 'provider' ? 'P' : result.id}
              </span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{result.label}</div>
                {result.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
