import React from 'react';
import {
  ArrowLeft,
  Edit2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Sparkles,
  Music,
  Wrench,
  FileText,
} from 'lucide-react';
import { RequirementFormData } from '../types';
import { formatDateRange } from '../utils/formatters';

interface ReviewSubmissionProps {
  formData: RequirementFormData;
  isSubmitting: boolean;
  submitError: string | null;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const ReviewSubmission: React.FC<ReviewSubmissionProps> = ({
  formData,
  isSubmitting,
  submitError,
  onEditStep,
  onSubmit,
  onBack,
}) => {
  const { category } = formData;

  const categoryName =
    category === 'planner'
      ? 'Event Planner'
      : category === 'performer'
      ? 'Live Performer'
      : 'Technical Crew';

  const CategoryIcon =
    category === 'planner' ? Sparkles : category === 'performer' ? Music : Wrench;

  const dateDisplay = formatDateRange(formData.eventDate, formData.endDate);

  const eventTypeDisplay =
    formData.eventType === 'Other' && formData.customEventType?.trim()
      ? `Other (${formData.customEventType.trim()})`
      : formData.eventType;

  const performanceTypeDisplay =
    formData.performer.performanceType === 'Other' &&
    formData.performer.otherPerformanceType?.trim()
      ? `Other (${formData.performer.otherPerformanceType.trim()})`
      : formData.performer.performanceType;

  const crewTypeDisplay =
    formData.crew.crewType === 'Other' && formData.crew.otherCrewType?.trim()
      ? `Other (${formData.crew.otherCrewType.trim()})`
      : formData.crew.crewType;

  return (
    <div className="step-content space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Step 4: Review & Submit
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review all information carefully before submitting. Use the Edit buttons to make corrections if needed.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Submission failed</p>
            <p className="mt-0.5 text-rose-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Section 1: Event Basics */}
      <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs transition-colors hover:border-slate-300">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Event Basics
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <span className="block text-xs font-medium text-slate-400">Event Name</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {formData.eventName}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-400">Event Type</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {eventTypeDisplay}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-400">Date / Schedule</span>
            <span className="font-mono text-slate-800 tabular-nums mt-0.5 block">
              {dateDisplay}
            </span>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-400">Location & Venue</span>
            <span className="text-slate-800 mt-0.5 block">
              {formData.location}
              {formData.venue ? ` · ${formData.venue}` : ''}
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Requirement Category:</span>
            <span className="text-xs font-semibold text-blue-700">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Category Requirements */}
      <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs transition-colors hover:border-slate-300">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <CategoryIcon className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. {categoryName} Requirements
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          {category === 'planner' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">Expected Attendees</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5 block">
                  {formData.planner.expectedAttendees} guests
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400">Event Budget</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {formData.planner.budget}
                </span>
              </div>
              {formData.planner.eventDuration && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Event Duration</span>
                  <span className="text-slate-800 mt-0.5 block">
                    {formData.planner.eventDuration}
                  </span>
                </div>
              )}
            </>
          )}

          {category === 'performer' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">Performance Type</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {performanceTypeDisplay}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400">Performance Duration</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {formData.performer.performanceDuration}
                </span>
              </div>
              {formData.performer.numberOfPerformers ? (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Number of Performers</span>
                  <span className="font-mono text-slate-800 tabular-nums mt-0.5 block">
                    {formData.performer.numberOfPerformers} artist(s)
                  </span>
                </div>
              ) : null}
            </>
          )}

          {category === 'crew' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">Crew Type</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {crewTypeDisplay}
                </span>
              </div>
              {formData.crew.numberOfPeopleRequired ? (
                <div>
                  <span className="block text-xs font-medium text-slate-400">People Required</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5 block">
                    {formData.crew.numberOfPeopleRequired} person(s)
                  </span>
                </div>
              ) : null}
              {formData.crew.workingDuration && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Working Duration</span>
                  <span className="text-slate-800 mt-0.5 block">
                    {formData.crew.workingDuration}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Section 3: Additional Requirements */}
      <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs transition-colors hover:border-slate-300">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Additional Requirements
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-sm">
          {category === 'planner' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">Services Required</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {formData.planner.servicesRequired &&
                  formData.planner.servicesRequired.length > 0 ? (
                    <span className="text-slate-800 font-medium">
                      {formData.planner.servicesRequired
                        .map((s) =>
                          s === 'Other' && formData.planner.otherServiceSpecification?.trim()
                            ? `Other (${formData.planner.otherServiceSpecification.trim()})`
                            : s
                        )
                        .join(' · ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">None selected</span>
                  )}
                </div>
              </div>

              {formData.planner.eventTheme && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Event Theme</span>
                  <p className="text-slate-800 mt-0.5">{formData.planner.eventTheme}</p>
                </div>
              )}

              {formData.planner.additionalNotes && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Additional Notes</span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    {formData.planner.additionalNotes}
                  </p>
                </div>
              )}

              {!formData.planner.eventTheme &&
                !formData.planner.additionalNotes &&
                (!formData.planner.servicesRequired ||
                  formData.planner.servicesRequired.length === 0) && (
                  <p className="text-slate-400 italic text-xs">No additional preferences provided.</p>
                )}
            </>
          )}

          {category === 'performer' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">
                  Sound System Provided by Venue
                </span>
                <span className="text-slate-800 mt-0.5 block">
                  {formData.performer.soundSystemRequired === true
                    ? 'Yes (Venue must provide sound system)'
                    : formData.performer.soundSystemRequired === false
                    ? 'No (Performer brings sound equipment)'
                    : 'Not specified'}
                </span>
              </div>

              {formData.performer.equipmentRequirements && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    Equipment & Technical Rider
                  </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    {formData.performer.equipmentRequirements}
                  </p>
                </div>
              )}

              {formData.performer.additionalNotes && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Additional Notes</span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    {formData.performer.additionalNotes}
                  </p>
                </div>
              )}

              {formData.performer.soundSystemRequired === null &&
                !formData.performer.equipmentRequirements &&
                !formData.performer.additionalNotes && (
                  <p className="text-slate-400 italic text-xs">No additional requirements specified.</p>
                )}
            </>
          )}

          {category === 'crew' && (
            <>
              <div>
                <span className="block text-xs font-medium text-slate-400">
                  Crew Supplies Equipment
                </span>
                <span className="text-slate-800 mt-0.5 block">
                  {formData.crew.equipmentRequired === true
                    ? 'Yes (Crew must supply their own gear)'
                    : formData.crew.equipmentRequired === false
                    ? 'No (Operating venue gear)'
                    : 'Not specified'}
                </span>
              </div>

              {formData.crew.specificSkillsRequired && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    Specific Skills / Certifications
                  </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    {formData.crew.specificSkillsRequired}
                  </p>
                </div>
              )}

              {formData.crew.additionalNotes && (
                <div>
                  <span className="block text-xs font-medium text-slate-400">Additional Notes</span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                    {formData.crew.additionalNotes}
                  </p>
                </div>
              )}

              {formData.crew.equipmentRequired === null &&
                !formData.crew.specificSkillsRequired &&
                !formData.crew.additionalNotes && (
                  <p className="text-slate-400 italic text-xs">No additional requirements specified.</p>
                )}
            </>
          )}
        </div>
      </div>

      {/* Navigation action buttons */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-7 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 disabled:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Requirement...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Submit Requirement</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
