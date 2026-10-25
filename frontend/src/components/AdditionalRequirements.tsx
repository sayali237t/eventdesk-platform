import React from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { RequirementFormData } from '../types';

interface AdditionalRequirementsProps {
  formData: RequirementFormData;
  isEditingFromReview?: boolean;
  onPlannerChange: (field: string, value: any) => void;
  onPerformerChange: (field: string, value: any) => void;
  onCrewChange: (field: string, value: any) => void;
  onBack: () => void;
  onContinue: () => void;
}

const PLANNER_SERVICES = [
  'Decoration',
  'Catering',
  'Photography',
  'Entertainment',
  'Venue Arrangement',
  'Other',
];

export const AdditionalRequirements: React.FC<AdditionalRequirementsProps> = ({
  formData,
  isEditingFromReview = false,
  onPlannerChange,
  onPerformerChange,
  onCrewChange,
  onBack,
  onContinue,
}) => {
  const { category } = formData;

  const togglePlannerService = (service: string) => {
    const current = formData.planner.servicesRequired || [];
    if (current.includes(service)) {
      onPlannerChange(
        'servicesRequired',
        current.filter((s) => s !== service)
      );
    } else {
      onPlannerChange('servicesRequired', [...current, service]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const isOtherServiceSelected = (formData.planner.servicesRequired || []).includes('Other');

  return (
    <form onSubmit={handleFormSubmit} noValidate className="step-content space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Step 3: Additional Requirements
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100/90 border border-slate-200/60 px-2.5 py-1 rounded-md">
            All fields optional
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Provide any supplementary preferences or technical specifications. You can leave these blank and proceed directly.
        </p>
      </div>

      {/* PLANNER ADDITIONAL */}
      {category === 'planner' && (
        <div className="space-y-5">
          {/* Services Required Checkboxes */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Services Required
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Select all coordination services you need assistance with:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PLANNER_SERVICES.map((service) => {
                const isChecked = (formData.planner.servicesRequired || []).includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => togglePlannerService(service)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold ring-1 ring-blue-200 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50/60'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className="text-sm">{service}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional "Other" Service Input */}
          {isOtherServiceSelected && (
            <div className="step-content">
              <label
                htmlFor="otherServiceSpecification"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Specify Other Service(s)
              </label>
              <input
                id="otherServiceSpecification"
                type="text"
                placeholder="e.g., Guest Logistics & Transport, Valet Parking, Invitation Design"
                value={formData.planner.otherServiceSpecification || ''}
                onChange={(e) => onPlannerChange('otherServiceSpecification', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          )}

          {/* Event Theme */}
          <div>
            <label htmlFor="eventTheme" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Event Theme or Style
            </label>
            <input
              id="eventTheme"
              type="text"
              placeholder="e.g., Royal Traditional, Cyberpunk Neon, Minimalist Botanical, 90s Retro"
              value={formData.planner.eventTheme || ''}
              onChange={(e) => onPlannerChange('eventTheme', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="plannerNotes" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Additional Notes or Special Instructions
            </label>
            <textarea
              id="plannerNotes"
              rows={3}
              placeholder="Provide any specific preferences, milestones, VIP guests, or venue constraints..."
              value={formData.planner.additionalNotes || ''}
              onChange={(e) => onPlannerChange('additionalNotes', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-y"
            />
          </div>
        </div>
      )}

      {/* PERFORMER ADDITIONAL */}
      {category === 'performer' && (
        <div className="space-y-5">
          {/* Sound System Required (Yes / No) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Sound System Required by Venue?
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Does the venue need to provide the main PA system, speakers, and monitors?
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onPerformerChange(
                    'soundSystemRequired',
                    formData.performer.soundSystemRequired === true ? null : true
                  )
                }
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  formData.performer.soundSystemRequired === true
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700 font-semibold shadow-xs ring-1 ring-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                Yes, sound system required
              </button>
              <button
                type="button"
                onClick={() =>
                  onPerformerChange(
                    'soundSystemRequired',
                    formData.performer.soundSystemRequired === false ? null : false
                  )
                }
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  formData.performer.soundSystemRequired === false
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700 font-semibold shadow-xs ring-1 ring-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                No, performer provides own gear
              </button>
              {formData.performer.soundSystemRequired !== null &&
                formData.performer.soundSystemRequired !== undefined && (
                  <button
                    type="button"
                    onClick={() => onPerformerChange('soundSystemRequired', null)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer underline ml-1"
                  >
                    Clear selection
                  </button>
                )}
            </div>
          </div>

          {/* Equipment Requirements */}
          <div>
            <label
              htmlFor="equipmentRequirements"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Equipment & Technical Rider Details
            </label>
            <textarea
              id="equipmentRequirements"
              rows={3}
              placeholder="e.g., 2 wireless handheld microphones, 1 stage monitor wedge, 2 direct input (DI) boxes, keyboard stand..."
              value={formData.performer.equipmentRequirements || ''}
              onChange={(e) => onPerformerChange('equipmentRequirements', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-y"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="performerNotes" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Additional Notes or Song / Setlist Preferences
            </label>
            <textarea
              id="performerNotes"
              rows={2}
              placeholder="e.g., Acoustic unplugged set, upbeat crowd anthems, or specific language preferences..."
              value={formData.performer.additionalNotes || ''}
              onChange={(e) => onPerformerChange('additionalNotes', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-y"
            />
          </div>
        </div>
      )}

      {/* CREW ADDITIONAL */}
      {category === 'crew' && (
        <div className="space-y-5">
          {/* Equipment Required (Yes / No) */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Should Crew Bring Their Own Equipment?
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Specify whether the technical crew brings their own tools/gear or operates on-site inventory.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onCrewChange(
                    'equipmentRequired',
                    formData.crew.equipmentRequired === true ? null : true
                  )
                }
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  formData.crew.equipmentRequired === true
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700 font-semibold shadow-xs ring-1 ring-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                Yes, crew must supply equipment
              </button>
              <button
                type="button"
                onClick={() =>
                  onCrewChange(
                    'equipmentRequired',
                    formData.crew.equipmentRequired === false ? null : false
                  )
                }
                className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  formData.crew.equipmentRequired === false
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700 font-semibold shadow-xs ring-1 ring-blue-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                No, venue provides equipment
              </button>
              {formData.crew.equipmentRequired !== null &&
                formData.crew.equipmentRequired !== undefined && (
                  <button
                    type="button"
                    onClick={() => onCrewChange('equipmentRequired', null)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer underline ml-1"
                  >
                    Clear selection
                  </button>
                )}
            </div>
          </div>

          {/* Specific Skills Required */}
          <div>
            <label
              htmlFor="specificSkillsRequired"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Specific Skills or Certifications Required
            </label>
            <textarea
              id="specificSkillsRequired"
              rows={3}
              placeholder="e.g., Experience with Yamaha QL5 digital mixer, GrandMA3 lighting board, stage truss rigging certification..."
              value={formData.crew.specificSkillsRequired || ''}
              onChange={(e) => onCrewChange('specificSkillsRequired', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-y"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="crewNotes" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Additional Notes & Logistics
            </label>
            <textarea
              id="crewNotes"
              rows={2}
              placeholder="e.g., Load-in starts 4 hours prior, loading dock access information, meal provisions..."
              value={formData.crew.additionalNotes || ''}
              onChange={(e) => onCrewChange('additionalNotes', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-y"
            />
          </div>
        </div>
      )}

      {/* Navigation action buttons */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          {isEditingFromReview ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Return to Review</span>
            </>
          ) : (
            <>
              <span>Continue to Step 4 (Review)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
