import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, PlusCircle, ClipboardList } from 'lucide-react';
import { RequirementFormData } from '../types';
import { formatDateRange } from '../utils/formatters';

interface SuccessViewProps {
  submissionId: string;
  formData: RequirementFormData;
  onNewRequirement: () => void;
  onViewSubmissions: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  submissionId,
  formData,
  onNewRequirement,
  onViewSubmissions,
}) => {
  const [copied, setCopied] = useState(false);

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryName =
    formData.category === 'planner'
      ? 'Event Planner'
      : formData.category === 'performer'
      ? 'Live Performer'
      : 'Technical Crew';

  const dateDisplay = formatDateRange(formData.eventDate, formData.endDate);

  return (
    <div className="step-content py-4 sm:py-6 space-y-6 text-center max-w-lg mx-auto">
      {/* Soft green checkmark icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-8 h-8 stroke-[2]" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Requirement Submitted
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Your event requirement has been successfully saved and categorised under{' '}
          <span className="font-semibold text-slate-700">{categoryName}</span>.
        </p>
      </div>

      {/* Submission Reference Card */}
      <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-left space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/80">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">
            Requirement Reference ID
          </span>
          <button
            type="button"
            onClick={copyIdToClipboard}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-xs sm:text-sm text-slate-800 break-all select-all font-medium">
          {submissionId}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-slate-200/80">
          <div>
            <span className="text-slate-400 block font-normal">Event</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {formData.eventName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-normal">Category</span>
            <span className="font-semibold text-blue-600 mt-0.5 block">
              {categoryName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-normal">Date</span>
            <span className="font-mono font-medium text-slate-800 mt-0.5 block">
              {dateDisplay}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-normal">Location</span>
            <span className="font-medium text-slate-800 mt-0.5 block truncate">
              {formData.location}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewRequirement}
          className="w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer inline-flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start Another Submission</span>
        </button>
        <button
          type="button"
          onClick={onViewSubmissions}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer inline-flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          <ClipboardList className="w-4 h-4" />
          <span>View Database Records</span>
        </button>
      </div>
    </div>
  );
};
