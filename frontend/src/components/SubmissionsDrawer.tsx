import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Calendar, MapPin, Database, ChevronRight, Server, PlusCircle } from 'lucide-react';
import { fetchAllRequirements, fetchHealthStatus, seedSampleDatabaseRecords } from '../lib/api';
import { EventCategory, HealthStatus, SubmittedRequirement } from '../types';
import { formatDateRange } from '../utils/formatters';

interface SubmissionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRequirement?: (req: SubmittedRequirement) => void;
}

type CategoryFilter = 'all' | EventCategory;

const FILTER_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'planner', label: 'Planner' },
  { id: 'performer', label: 'Performer' },
  { id: 'crew', label: 'Crew' },
];

export const SubmissionsDrawer: React.FC<SubmissionsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [allSubmissions, setAllSubmissions] = useState<SubmittedRequirement[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SubmittedRequirement | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [records, healthData] = await Promise.all([
        fetchAllRequirements(),
        fetchHealthStatus().catch(() => null),
      ]);
      setAllSubmissions(records);
      if (healthData) setHealth(healthData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requirements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedSamples = async () => {
    setIsSeeding(true);
    setError(null);
    try {
      const records = await seedSampleDatabaseRecords();
      setAllSubmissions(records);
      const healthData = await fetchHealthStatus().catch(() => null);
      if (healthData) setHealth(healthData);
    } catch (err: any) {
      setError(err.message || 'Failed to seed sample records');
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const counts = {
    all: allSubmissions.length,
    planner: allSubmissions.filter((r) => r.category === 'planner').length,
    performer: allSubmissions.filter((r) => r.category === 'performer').length,
    crew: allSubmissions.filter((r) => r.category === 'crew').length,
  };

  const filteredSubmissions =
    activeFilter === 'all'
      ? allSubmissions
      : allSubmissions.filter((r) => r.category === activeFilter);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Database Requirements ({allSubmissions.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Refresh database records"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Database Connection Status & Category Filter Bar */}
          {!selectedItem && (
            <div className="px-6 py-3 bg-white border-b border-slate-200 space-y-3">
              {health && (
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-700">Storage Engine:</span>
                    <span className="font-mono text-slate-800">
                      {health.connected ? 'MongoDB Atlas (Connected)' : 'In-Memory Store (Active)'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    GET /api/requirements
                  </span>
                </div>
              )}

              {/* Interactive Category Filter Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                {FILTER_TABS.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  const count = counts[tab.id];
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      >
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading && allSubmissions.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Fetching submitted records from database...
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
                {error}
              </div>
            )}

            {!isLoading && filteredSubmissions.length === 0 && !error && !selectedItem && (
              <div className="py-12 text-center text-slate-400 text-sm">
                No requirements found in the{' '}
                <span className="font-semibold text-slate-600 capitalize">{activeFilter}</span>{' '}
                category.
              </div>
            )}

            {selectedItem ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer mb-2"
                >
                  ← Back to categorised list
                </button>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ID: {selectedItem._id}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(selectedItem.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{selectedItem.eventName}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1.5">
                    <span className="font-semibold text-blue-600 capitalize">
                      Category: {selectedItem.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {selectedItem.eventType === 'Other' && selectedItem.customEventType
                        ? `Other (${selectedItem.customEventType})`
                        : selectedItem.eventType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateRange(selectedItem.eventDate, selectedItem.endDate)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedItem.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Category Requirements ({selectedItem.category})
                  </h4>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {JSON.stringify(selectedItem.requirements, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Full Document (MongoDB Record)
                  </h4>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {JSON.stringify(selectedItem, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer bg-white group text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1 text-xs">
                          <span className="font-bold uppercase tracking-wider text-blue-600">
                            {item.category}
                          </span>
                          <span className="text-slate-300" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-slate-500">
                            {item.eventType === 'Other' && item.customEventType
                              ? `Other (${item.customEventType})`
                              : item.eventType}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.eventName}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateRange(item.eventDate, item.endDate)}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono truncate max-w-[220px]">ID: {item._id}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
