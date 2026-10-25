import React from 'react';
import {
  AlertCircle,
  Users,
  ArrowLeft,
  ArrowRight,
  Clock,
  DollarSign,
  Music,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { FormErrors, RequirementFormData } from '../types';

interface CategoryRequirementsProps {
  formData: RequirementFormData;
  errors: FormErrors;
  isEditingFromReview?: boolean;
  onPlannerChange: (field: string, value: any) => void;
  onPerformerChange: (field: string, value: any) => void;
  onCrewChange: (field: string, value: any) => void;
  onBack: () => void;
  onContinue: () => void;
  onReturnToReview?: () => void;
}

const BUDGET_OPTIONS = [
  'Under ₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹5,00,000',
  'Above ₹5,00,000',
  'Not decided',
];

const PLANNER_DURATION_OPTIONS = [
  'Half day (up to 4 hours)',
  'Full day (4–8 hours)',
  'Multi-day',
  'Not decided yet',
];

const PERFORMANCE_TYPES = [
  'Singer / Vocalist',
  'Band / Musician',
  'DJ',
  'Dancer',
  'Comedian',
  'Other',
];

const PERFORMANCE_DURATIONS = [
  'Under 30 minutes',
  '30–60 minutes',
  '1–2 hours',
  'More than 2 hours',
];

const CREW_TYPES = [
  'Sound / Audio',
  'Lighting',
  'Stage Setup',
  'Photography / Videography',
  'Event Helpers',
  'Other',
];

const CREW_WORK_DURATIONS = [
  'Under 4 hours',
  '4–8 hours',
  '8–12 hours',
  'Full day / Multiple days',
];

export const CategoryRequirements: React.FC<CategoryRequirementsProps> = ({
  formData,
  errors,
  isEditingFromReview = false,
  onPlannerChange,
  onPerformerChange,
  onCrewChange,
  onBack,
  onContinue,
  onReturnToReview,
}) => {
  const { category } = formData;

  const categoryName =
    category === 'planner'
      ? 'Event Planner'
      : category === 'performer'
      ? 'Live Performer'
      : 'Technical Crew';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate className="step-content space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {categoryName} Specifications
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Step 2: Category Requirements
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure the essential parameters tailored for your {categoryName.toLowerCase()} requirements.
        </p>
      </div>

      {/* PLANNER FIELDS */}
      {category === 'planner' && (
        <div className="space-y-5">
          {/* Expected Attendees */}
          <div>
            <label htmlFor="expectedAttendees" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Expected Attendees <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="expectedAttendees"
                type="number"
                min="1"
                placeholder="e.g., 250"
                value={formData.planner.expectedAttendees}
                onChange={(e) =>
                  onPlannerChange(
                    'expectedAttendees',
                    e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10))
                  )
                }
                className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm font-mono tabular-nums transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
                  errors.expectedAttendees
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
              />
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            {errors.expectedAttendees ? (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.expectedAttendees}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Approximate guest count helps the planner evaluate seating, venue size, and catering.
              </p>
            )}
          </div>

          {/* Event Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Event Budget <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="budget"
                value={formData.planner.budget}
                onChange={(e) => onPlannerChange('budget', e.target.value)}
                className={`w-full rounded-xl border bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer focus:outline-none ${
                  errors.budget
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                } ${!formData.planner.budget ? 'text-slate-400' : 'text-slate-800'}`}
              >
                <option value="" disabled>
                  Select estimated budget range
                </option>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="text-slate-800">
                    {opt}
                  </option>
                ))}
              </select>
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.budget && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Event Duration (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="plannerDuration" className="block text-sm font-semibold text-slate-800">
                Event Duration
              </label>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <select
                id="plannerDuration"
                value={formData.planner.eventDuration || ''}
                onChange={(e) => onPlannerChange('eventDuration', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Select expected duration (optional)</option>
                {PLANNER_DURATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERFORMER FIELDS */}
      {category === 'performer' && (
        <div className="space-y-5">
          {/* Performance Type */}
          <div>
            <label htmlFor="performanceType" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Performance Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="performanceType"
                value={formData.performer.performanceType}
                onChange={(e) => onPerformerChange('performanceType', e.target.value)}
                className={`w-full rounded-xl border bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer focus:outline-none ${
                  errors.performanceType
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                } ${!formData.performer.performanceType ? 'text-slate-400' : 'text-slate-800'}`}
              >
                <option value="" disabled>
                  Select artist or act type
                </option>
                {PERFORMANCE_TYPES.map((type) => (
                  <option key={type} value={type} className="text-slate-800">
                    {type}
                  </option>
                ))}
              </select>
              <Music className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.performanceType && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.performanceType}
              </p>
            )}
          </div>

          {/* Conditional "Other" Performance Type */}
          {formData.performer.performanceType === 'Other' && (
            <div className="step-content">
              <label
                htmlFor="otherPerformanceType"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Specify Performance Type <span className="text-rose-500">*</span>
              </label>
              <input
                id="otherPerformanceType"
                type="text"
                placeholder="e.g., Magician / Illusionist, Instrumental Soloist, Anchor / Emcee"
                value={formData.performer.otherPerformanceType || ''}
                onChange={(e) => onPerformerChange('otherPerformanceType', e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
                  errors.otherPerformanceType
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
              />
              {errors.otherPerformanceType && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.otherPerformanceType}
                </p>
              )}
            </div>
          )}

          {/* Performance Duration */}
          <div>
            <label htmlFor="performanceDuration" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Performance Duration <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="performanceDuration"
                value={formData.performer.performanceDuration}
                onChange={(e) => onPerformerChange('performanceDuration', e.target.value)}
                className={`w-full rounded-xl border bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer focus:outline-none ${
                  errors.performanceDuration
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                } ${!formData.performer.performanceDuration ? 'text-slate-400' : 'text-slate-800'}`}
              >
                <option value="" disabled>
                  Select performance length
                </option>
                {PERFORMANCE_DURATIONS.map((dur) => (
                  <option key={dur} value={dur} className="text-slate-800">
                    {dur}
                  </option>
                ))}
              </select>
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.performanceDuration && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.performanceDuration}
              </p>
            )}
          </div>

          {/* Number of Performers (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="numberOfPerformers" className="block text-sm font-semibold text-slate-800">
                Number of Performers
              </label>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <input
                id="numberOfPerformers"
                type="number"
                min="1"
                placeholder="e.g., 4"
                value={formData.performer.numberOfPerformers}
                onChange={(e) =>
                  onPerformerChange(
                    'numberOfPerformers',
                    e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10))
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-mono tabular-nums transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            {errors.numberOfPerformers && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.numberOfPerformers}
              </p>
            )}
          </div>
        </div>
      )}

      {/* CREW FIELDS */}
      {category === 'crew' && (
        <div className="space-y-5">
          {/* Crew Type */}
          <div>
            <label htmlFor="crewType" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Crew Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="crewType"
                value={formData.crew.crewType}
                onChange={(e) => onCrewChange('crewType', e.target.value)}
                className={`w-full rounded-xl border bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer focus:outline-none ${
                  errors.crewType
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                } ${!formData.crew.crewType ? 'text-slate-400' : 'text-slate-800'}`}
              >
                <option value="" disabled>
                  Select crew discipline
                </option>
                {CREW_TYPES.map((type) => (
                  <option key={type} value={type} className="text-slate-800">
                    {type}
                  </option>
                ))}
              </select>
              <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.crewType && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.crewType}
              </p>
            )}
          </div>

          {/* Conditional "Other" Crew Type */}
          {formData.crew.crewType === 'Other' && (
            <div className="step-content">
              <label htmlFor="otherCrewType" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Specify Crew Discipline <span className="text-rose-500">*</span>
              </label>
              <input
                id="otherCrewType"
                type="text"
                placeholder="e.g., Live Stream Broadcast Operators, Pyrotechnics & SFX, Security & Crowd Control"
                value={formData.crew.otherCrewType || ''}
                onChange={(e) => onCrewChange('otherCrewType', e.target.value)}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none ${
                  errors.otherCrewType
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
              />
              {errors.otherCrewType && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.otherCrewType}
                </p>
              )}
            </div>
          )}

          {/* Number of People Required (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="numberOfPeopleRequired" className="block text-sm font-semibold text-slate-800">
                Number of People Required
              </label>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <input
                id="numberOfPeopleRequired"
                type="number"
                min="1"
                placeholder="e.g., 6"
                value={formData.crew.numberOfPeopleRequired}
                onChange={(e) =>
                  onCrewChange(
                    'numberOfPeopleRequired',
                    e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10))
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm font-mono tabular-nums transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
            {errors.numberOfPeopleRequired && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.numberOfPeopleRequired}
              </p>
            )}
          </div>

          {/* Working Duration (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="workingDuration" className="block text-sm font-semibold text-slate-800">
                Working Shift Duration
              </label>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </div>
            <div className="relative">
              <select
                id="workingDuration"
                value={formData.crew.workingDuration || ''}
                onChange={(e) => onCrewChange('workingDuration', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 py-3 text-sm transition-all duration-200 appearance-none cursor-pointer hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Select expected shift duration</option>
                {CREW_WORK_DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex flex-wrap items-center gap-3">
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
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer inline-flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <span>Continue to Step 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
