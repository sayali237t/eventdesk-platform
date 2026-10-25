import React from 'react';
import {
  Calendar,
  MapPin,
  Building,
  Sparkles,
  Music,
  Wrench,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { EventCategory, EventType, FormErrors, RequirementFormData } from '../types';
import { getTodayDateString } from '../utils/formatters';

interface EventBasicsProps {
  formData: RequirementFormData;
  errors: FormErrors;
  categoryResetNotice?: string | null;
  onDismissCategoryNotice?: () => void;
  isEditingFromReview?: boolean;
  onChange: (field: keyof RequirementFormData, value: any) => void;
  onContinue: () => void;
  onReturnToReview?: () => void;
}

const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Corporate Event',
  'College Event',
  'Concert / Festival',
  'Private Party',
  'Other',
];

const CATEGORIES: {
  id: EventCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'planner',
    title: 'Planner',
    subtitle: 'Event Planning & Coordination',
    description: 'Full or partial coordination, concept themes, vendor management, and timelines.',
    icon: Sparkles,
  },
  {
    id: 'performer',
    title: 'Performer',
    subtitle: 'Live Entertainment & Artists',
    description: 'Vocalists, live bands, DJs, choreographers, dancers, comedians, and hosts.',
    icon: Music,
  },
  {
    id: 'crew',
    title: 'Crew',
    subtitle: 'Technical & On-site Support',
    description: 'Audio & sound engineers, lighting operators, stage setup, and operational helpers.',
    icon: Wrench,
  },
];

export const EventBasics: React.FC<EventBasicsProps> = ({
  formData,
  errors,
  categoryResetNotice,
  onDismissCategoryNotice,
  isEditingFromReview = false,
  onChange,
  onContinue,
  onReturnToReview,
}) => {
  const today = getTodayDateString();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate className="step-content space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 1: Event Basics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us the foundational details of your event and choose the service category.
        </p>
      </div>

      {/* Event Name */}
      <div>
        <label htmlFor="eventName" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Event Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="eventName"
          type="text"
          placeholder="e.g., Annual Tech Summit 2027 or Meera's Wedding"
          value={formData.eventName}
          onChange={(e) => onChange('eventName', e.target.value)}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
            errors.eventName
              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
              : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          }`}
        />
        {errors.eventName && (
          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.eventName}
          </p>
        )}
      </div>

      {/* Event Type & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Event Type <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="eventType"
              value={formData.eventType}
              onChange={(e) => onChange('eventType', e.target.value as EventType)}
              className={`w-full rounded-xl border bg-white px-4 py-3 pr-10 text-sm transition-all duration-200 appearance-none cursor-pointer focus:outline-none ${
                errors.eventType
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              } ${!formData.eventType ? 'text-slate-400' : 'text-slate-800'}`}
            >
              <option value="" disabled>
                Select event type
              </option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type} className="text-slate-800">
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {errors.eventType && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.eventType}
            </p>
          )}
        </div>

        {/* Location / City */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Location / City <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="location"
              type="text"
              placeholder="e.g., Pune, Mumbai, Bangalore"
              value={formData.location}
              onChange={(e) => onChange('location', e.target.value)}
              className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
                errors.location
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              }`}
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
          {errors.location && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Conditional "Other" Event Type Input */}
      {formData.eventType === 'Other' && (
        <div className="step-content">
          <label htmlFor="customEventType" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Specify Event Type <span className="text-rose-500">*</span>
          </label>
          <input
            id="customEventType"
            type="text"
            placeholder="e.g., Charity Gala, Product Launch, Art Exhibition"
            value={formData.customEventType || ''}
            onChange={(e) => onChange('customEventType', e.target.value)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
              errors.customEventType
                ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
            }`}
          />
          {errors.customEventType && (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.customEventType}
            </p>
          )}
        </div>
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Event Date (Start Date) */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Event Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="eventDate"
              type="date"
              min={today}
              value={formData.eventDate}
              onChange={(e) => onChange('eventDate', e.target.value)}
              className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none ${
                errors.eventDate
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              }`}
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
          {errors.eventDate ? (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.eventDate}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Must be today or a future date.
            </p>
          )}
        </div>

        {/* End Date (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="endDate" className="block text-sm font-semibold text-slate-800">
              End Date
            </label>
            <span className="text-xs text-slate-400 font-normal">Optional</span>
          </div>
          <div className="relative">
            <input
              id="endDate"
              type="date"
              min={formData.eventDate || today}
              value={formData.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm transition-all duration-200 focus:outline-none ${
                errors.endDate
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              }`}
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
          {errors.endDate ? (
            <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.endDate}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Only required for multi-day events. Cannot precede the start date.
            </p>
          )}
        </div>
      </div>

      {/* Venue (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="venue" className="block text-sm font-semibold text-slate-800">
            Venue / Hall Details
          </label>
          <span className="text-xs text-slate-400 font-normal">Optional</span>
        </div>
        <div className="relative">
          <input
            id="venue"
            type="text"
            placeholder="e.g., Grand Hyatt Ballroom, College Ground, or To Be Finalized"
            value={formData.venue}
            onChange={(e) => onChange('venue', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Requirement Category Cards */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          Requirement Category <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3.5">
          Choose the primary service you require. Next steps will display questions specifically for this category.
        </p>

        {categoryResetNotice && (
          <div className="mb-3.5 p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-2 text-xs text-blue-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{categoryResetNotice}</span>
            </div>
            {onDismissCategoryNotice && (
              <button
                type="button"
                onClick={onDismissCategoryNotice}
                className="p-1 text-blue-500 hover:text-blue-700 rounded cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5" role="radiogroup" aria-label="Requirement Category">
          {CATEGORIES.map((cat) => {
            const isSelected = formData.category === cat.id;
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onChange('category', cat.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onChange('category', cat.id);
                  }
                }}
                className={`rounded-xl border p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md cursor-pointer text-left relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-100 shadow-md'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{cat.title}</h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{cat.subtitle}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cat.description}</p>
              </div>
            );
          })}
        </div>

        {errors.category && (
          <p className="text-xs text-rose-500 mt-2 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.category}
          </p>
        )}
      </div>

      {/* Navigation action */}
      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
        {isEditingFromReview && onReturnToReview && (
          <button
            type="button"
            onClick={onReturnToReview}
            className="rounded-xl border border-blue-200 bg-blue-50/70 px-5 py-3 font-medium text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100/80 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer inline-flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Return to Review</span>
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer inline-flex items-center gap-2 whitespace-nowrap text-sm"
        >
          <span>Continue to Step 2</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
