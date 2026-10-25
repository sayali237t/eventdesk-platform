import React, { useState, useEffect } from 'react';
import { RotateCcw, Wand2 } from 'lucide-react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { EventBasics } from './components/EventBasics';
import { CategoryRequirements } from './components/CategoryRequirements';
import { AdditionalRequirements } from './components/AdditionalRequirements';
import { ReviewSubmission } from './components/ReviewSubmission';
import { SuccessView } from './components/SuccessView';
import { SubmissionsDrawer } from './components/SubmissionsDrawer';
import { EventCategory, FormErrors, HealthStatus, RequirementFormData } from './types';
import { submitRequirement, fetchAllRequirements, fetchHealthStatus } from './lib/api';
import { getSampleFormData, getTodayDateString } from './utils/formatters';

const DRAFT_STORAGE_KEY = 'eventdesk_requirement_draft_v1';

const INITIAL_FORM_DATA: RequirementFormData = {
  eventName: '',
  eventType: '',
  customEventType: '',
  eventDate: '',
  endDate: '',
  location: '',
  venue: '',
  category: '',
  planner: {
    expectedAttendees: '',
    budget: '',
    eventDuration: '',
    servicesRequired: [],
    otherServiceSpecification: '',
    eventTheme: '',
    additionalNotes: '',
  },
  performer: {
    performanceType: '',
    otherPerformanceType: '',
    performanceDuration: '',
    numberOfPerformers: '',
    soundSystemRequired: null,
    equipmentRequirements: '',
    additionalNotes: '',
  },
  crew: {
    crewType: '',
    otherCrewType: '',
    numberOfPeopleRequired: '',
    workingDuration: '',
    equipmentRequired: null,
    specificSkillsRequired: '',
    additionalNotes: '',
  },
};

function hasCategorySpecificData(data: RequirementFormData): boolean {
  const { planner, performer, crew } = data;
  return Boolean(
    planner.expectedAttendees !== '' ||
      planner.budget ||
      planner.eventDuration ||
      (planner.servicesRequired && planner.servicesRequired.length > 0) ||
      planner.eventTheme ||
      planner.additionalNotes ||
      performer.performanceType ||
      performer.performanceDuration ||
      performer.numberOfPerformers !== '' ||
      performer.soundSystemRequired !== null ||
      performer.equipmentRequirements ||
      performer.additionalNotes ||
      crew.crewType ||
      crew.numberOfPeopleRequired !== '' ||
      crew.workingDuration ||
      crew.equipmentRequired !== null ||
      crew.specificSkillsRequired ||
      crew.additionalNotes
  );
}

export default function App() {
  const [formData, setFormData] = useState<RequirementFormData>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.formData) {
          return { ...INITIAL_FORM_DATA, ...parsed.formData };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentStep === 'number') {
          return Math.min(Math.max(parsed.currentStep, 1), 4);
        }
      }
    } catch {
      // Ignore
    }
    return 1;
  });

  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.maxAccessibleStep === 'number') {
          return Math.min(Math.max(parsed.maxAccessibleStep, 1), 4);
        }
      }
    } catch {
      // Ignore
    }
    return 1;
  });

  const [isEditingFromReview, setIsEditingFromReview] = useState<boolean>(false);
  const [categoryResetNotice, setCategoryResetNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  // Load initial count of submissions and database health status
  useEffect(() => {
    fetchAllRequirements()
      .then((records) => setTotalSubmissions(records.length))
      .catch(() => {});
    fetchHealthStatus()
      .then((status) => setHealthStatus(status))
      .catch(() => {});
  }, []);

  // Persist draft to localStorage while filling the form
  useEffect(() => {
    if (submittedId) return;
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          formData,
          currentStep,
          maxAccessibleStep,
        })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [formData, currentStep, maxAccessibleStep, submittedId]);

  const isFormDirty = Boolean(
    formData.eventName ||
      formData.eventType ||
      formData.eventDate ||
      formData.location ||
      formData.venue ||
      formData.category
  );

  // Update top-level event basics
  const handleEventBasicsChange = (field: keyof RequirementFormData, value: any) => {
    setFormData((prev) => {
      // If changing category, reset category specific fields so stale data isn't submitted
      if (field === 'category' && value !== prev.category) {
        if (prev.category && hasCategorySpecificData(prev)) {
          const label =
            value === 'planner' ? 'Planner' : value === 'performer' ? 'Performer' : 'Crew';
          setCategoryResetNotice(
            `Category switched to ${label}. Previous category-specific fields were reset.`
          );
        } else {
          setCategoryResetNotice(null);
        }
        setMaxAccessibleStep(1);
        setIsEditingFromReview(false);
        return {
          ...prev,
          category: value,
          planner: { ...INITIAL_FORM_DATA.planner },
          performer: { ...INITIAL_FORM_DATA.performer },
          crew: { ...INITIAL_FORM_DATA.crew },
        };
      }

      // If eventDate moves past existing endDate, automatically clear endDate
      if (field === 'eventDate') {
        const shouldClearEndDate = prev.endDate && value && value > prev.endDate;
        return {
          ...prev,
          eventDate: value,
          endDate: shouldClearEndDate ? '' : prev.endDate,
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });

    // Clear field-specific error
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Update category-specific fields
  const handlePlannerChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      planner: {
        ...prev.planner,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handlePerformerChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      performer: {
        ...prev.performer,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleCrewChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      crew: {
        ...prev.crew,
        [field]: value,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    const today = getTodayDateString();

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required.';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type.';
    } else if (formData.eventType === 'Other' && !formData.customEventType?.trim()) {
      newErrors.customEventType = 'Please specify the custom event type.';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required.';
    } else if (formData.eventDate < today) {
      newErrors.eventDate = 'Event start date cannot be in the past.';
    }

    if (formData.endDate && formData.eventDate) {
      if (formData.endDate < formData.eventDate) {
        newErrors.endDate = 'End date cannot precede the event start date.';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location / City is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Please choose a requirement category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    const { category } = formData;

    if (category === 'planner') {
      if (
        formData.planner.expectedAttendees === '' ||
        isNaN(Number(formData.planner.expectedAttendees)) ||
        Number(formData.planner.expectedAttendees) < 1
      ) {
        newErrors.expectedAttendees = 'Please enter a valid number of expected attendees.';
      }
      if (!formData.planner.budget) {
        newErrors.budget = 'Please select an estimated budget range.';
      }
    } else if (category === 'performer') {
      if (!formData.performer.performanceType) {
        newErrors.performanceType = 'Please select the performance type.';
      } else if (
        formData.performer.performanceType === 'Other' &&
        !formData.performer.otherPerformanceType?.trim()
      ) {
        newErrors.otherPerformanceType = 'Please specify the performance type.';
      }
      if (!formData.performer.performanceDuration) {
        newErrors.performanceDuration = 'Please select the expected performance duration.';
      }
      if (
        formData.performer.numberOfPerformers !== '' &&
        formData.performer.numberOfPerformers !== undefined &&
        (isNaN(Number(formData.performer.numberOfPerformers)) ||
          Number(formData.performer.numberOfPerformers) < 1)
      ) {
        newErrors.numberOfPerformers = 'Please enter a valid number of performers.';
      }
    } else if (category === 'crew') {
      if (!formData.crew.crewType) {
        newErrors.crewType = 'Please select the required crew discipline.';
      } else if (
        formData.crew.crewType === 'Other' &&
        !formData.crew.otherCrewType?.trim()
      ) {
        newErrors.otherCrewType = 'Please specify the crew discipline.';
      }
      if (
        formData.crew.numberOfPeopleRequired !== '' &&
        formData.crew.numberOfPeopleRequired !== undefined &&
        (isNaN(Number(formData.crew.numberOfPeopleRequired)) ||
          Number(formData.crew.numberOfPeopleRequired) < 1)
      ) {
        newErrors.numberOfPeopleRequired = 'Please enter a valid number of people required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleStep1Continue = () => {
    if (validateStep1()) {
      setCategoryResetNotice(null);
      setCurrentStep(2);
      setMaxAccessibleStep((prev) => Math.max(prev, 2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStep2Continue = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      setMaxAccessibleStep((prev) => Math.max(prev, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStep3Continue = () => {
    setIsEditingFromReview(false);
    setCurrentStep(4);
    setMaxAccessibleStep((prev) => Math.max(prev, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToReview = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (!validateStep1() || !validateStep2()) return;

    setCategoryResetNotice(null);
    setIsEditingFromReview(false);
    setCurrentStep(4);
    setMaxAccessibleStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStepFromReview = (step: number) => {
    setErrors({});
    setIsEditingFromReview(true);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStep = (step: number) => {
    // Prevent jumping ahead to Step 3 or 4 if preceding required steps are invalid
    if (step > currentStep) {
      if (step >= 2 && !validateStep1()) return;
      if (step >= 3 && !validateStep2()) return;
    } else {
      setErrors({});
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick-fill sample preset for video walkthrough / testing
  const handleAutofillSample = (category: EventCategory) => {
    const sample = getSampleFormData(category);
    setFormData(sample);
    setErrors({});
    setCategoryResetNotice(null);
    setSubmitError(null);
    setSubmittedId(null);
    setMaxAccessibleStep(4);
  };

  // Submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitRequirement(formData);
      if (response.success && response.data?.id) {
        setSubmittedId(response.data.id);
        setTotalSubmissions((prev) => prev + 1);
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // Ignore
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(response.message || 'Unable to submit your requirement. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Unable to submit your requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to submit another requirement
  const handleNewRequirement = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setIsEditingFromReview(false);
    setCategoryResetNotice(null);
    setErrors({});
    setSubmittedId(null);
    setSubmitError(null);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60 flex flex-col text-[#0F172A]">
      {/* Top Navigation */}
      <Header
        onOpenSubmissions={() => setIsDrawerOpen(true)}
        onNewRequirement={handleNewRequirement}
        submissionsCount={totalSubmissions}
        healthStatus={healthStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header Title & Description */}
          {!submittedId && (
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Tell us about your event
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-lg mx-auto">
                Submit your event requirements for planners, performers, or crew in four simple steps.
              </p>

              {/* Quick Demo Autofill & Reset Toolbar */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl p-1 shadow-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 font-medium">
                    <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Autofill Sample:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAutofillSample('planner')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      formData.category === 'planner' && formData.eventName.includes('Rohan')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Planner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutofillSample('performer')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      formData.category === 'performer' && formData.eventName.includes('Horizon')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Performer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutofillSample('crew')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      formData.category === 'crew' && formData.eventName.includes('CloudScale')
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Crew
                  </button>
                </div>

                {isFormDirty && (
                  <button
                    type="button"
                    onClick={handleNewRequirement}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Clear all form fields and reset draft"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Form</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form / Success Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/50 p-6 md:p-8">
            {submittedId ? (
              <SuccessView
                submissionId={submittedId}
                formData={formData}
                onNewRequirement={handleNewRequirement}
                onViewSubmissions={() => setIsDrawerOpen(true)}
              />
            ) : (
              <>
                {/* 4-Step Progress Indicator */}
                <StepIndicator
                  currentStep={currentStep}
                  totalSteps={4}
                  onStepClick={handleBackToStep}
                  maxAccessibleStep={maxAccessibleStep}
                />

                {/* Step Views */}
                {currentStep === 1 && (
                  <EventBasics
                    formData={formData}
                    errors={errors}
                    categoryResetNotice={categoryResetNotice}
                    onDismissCategoryNotice={() => setCategoryResetNotice(null)}
                    isEditingFromReview={isEditingFromReview}
                    onChange={handleEventBasicsChange}
                    onContinue={handleStep1Continue}
                    onReturnToReview={handleReturnToReview}
                  />
                )}

                {currentStep === 2 && (
                  <CategoryRequirements
                    formData={formData}
                    errors={errors}
                    isEditingFromReview={isEditingFromReview}
                    onPlannerChange={handlePlannerChange}
                    onPerformerChange={handlePerformerChange}
                    onCrewChange={handleCrewChange}
                    onBack={() => handleBackToStep(1)}
                    onContinue={handleStep2Continue}
                    onReturnToReview={handleReturnToReview}
                  />
                )}

                {currentStep === 3 && (
                  <AdditionalRequirements
                    formData={formData}
                    isEditingFromReview={isEditingFromReview}
                    onPlannerChange={handlePlannerChange}
                    onPerformerChange={handlePerformerChange}
                    onCrewChange={handleCrewChange}
                    onBack={() => handleBackToStep(2)}
                    onContinue={handleStep3Continue}
                  />
                )}

                {currentStep === 4 && (
                  <ReviewSubmission
                    formData={formData}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onEditStep={handleEditStepFromReview}
                    onSubmit={handleSubmit}
                    onBack={() => handleBackToStep(3)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Database Submissions Drawer */}
      <SubmissionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Clean, restrained footer */}
      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-500 bg-white/70 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} EventDesk. Event Requirement Submission Platform.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Draft Auto-Saved</span>
            <span aria-hidden="true">·</span>
            <span>REST API</span>
            <span aria-hidden="true">·</span>
            <span>MongoDB Data Store</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
