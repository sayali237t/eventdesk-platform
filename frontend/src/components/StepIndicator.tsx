import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  maxAccessibleStep?: number;
}

const STEPS = [
  { step: 1, label: 'Event Basics', description: 'Name, date & category' },
  { step: 2, label: 'Category Details', description: 'Specific service questions' },
  { step: 3, label: 'Additional Needs', description: 'Preferences & notes' },
  { step: 4, label: 'Review & Submit', description: 'Verify & save' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep = 1,
}) => {
  return (
    <div className="w-full py-2 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div
          className="absolute top-[18px] left-8 right-8 h-[2.5px] bg-slate-200/80 -z-0 hidden sm:block"
          aria-hidden="true"
        />

        {/* Active progress track line */}
        <div
          className="absolute top-[18px] left-8 h-[2.5px] bg-blue-600 -z-0 transition-all duration-300 ease-out hidden sm:block"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
          aria-hidden="true"
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isClickable = onStepClick && s.step <= maxAccessibleStep;

          return (
            <div
              key={s.step}
              className={`flex flex-col items-center flex-1 relative z-10 ${
                isClickable ? 'cursor-pointer group' : 'cursor-default'
              }`}
              onClick={() => {
                if (isClickable) onStepClick(s.step);
              }}
            >
              <div
                className={`transition-all duration-300 ${
                  isCurrent
                    ? 'flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 font-semibold text-sm'
                    : isCompleted
                    ? 'flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm font-semibold text-sm'
                    : 'flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-slate-400 group-hover:border-slate-300 font-medium text-sm'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.step}
              </div>

              <div className="mt-2.5 text-center">
                <p
                  className={`text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'text-blue-600 font-semibold'
                      : isCompleted
                      ? 'text-slate-800 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </p>
                <p className="hidden md:block text-[11px] text-slate-400 mt-0.5">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
