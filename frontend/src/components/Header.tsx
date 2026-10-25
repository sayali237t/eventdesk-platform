import React from 'react';
import { ClipboardList, Database } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  onOpenSubmissions: () => void;
  onNewRequirement: () => void;
  submissionsCount?: number;
  healthStatus?: HealthStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSubmissions,
  onNewRequirement,
  submissionsCount = 0,
  healthStatus,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewRequirement}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                EventDesk
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-normal mt-0.5">
                Event Requirements
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Live Storage Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          {healthStatus && (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-slate-700">
                {healthStatus.connected ? 'MongoDB Connected' : 'Local Memory Store'}
              </span>
            </span>
          )}
        </div>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSubmissions}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0"
            title="View requirements saved to database"
          >
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            <span>Database Records</span>
            {submissionsCount > 0 && (
              <span className="font-mono text-[11px] font-semibold text-blue-700 tabular-nums">
                ({submissionsCount})
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
