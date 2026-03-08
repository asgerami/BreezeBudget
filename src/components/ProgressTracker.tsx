import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  steps, 
  currentStep, 
  onStepClick 
}) => {
  return (
    <div className="bg-surface-elevated rounded-xl border border-stone-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">Your progress</h3>
        <div className="text-sm text-[var(--color-ink-muted)]">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isClickable = onStepClick && (step.status === 'completed' || step.status === 'current');
          return (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${
                isClickable ? 'cursor-pointer hover:bg-surface-muted' : ''
              } ${step.status === 'current' ? 'bg-accent-muted border border-stone-200' : ''}`}
              onClick={isClickable ? () => onStepClick(index) : undefined}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'completed' && <CheckCircle className="w-6 h-6 text-accent" aria-hidden />}
                {step.status === 'current' && (
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" aria-hidden />
                  </div>
                )}
                {step.status === 'upcoming' && <Circle className="w-6 h-6 text-stone-300" aria-hidden />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  step.status === 'completed' ? 'text-accent' : step.status === 'current' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-muted)]'
                }`}>
                  {step.title}
                </h4>
                <p className="text-xs mt-1 text-[var(--color-ink-muted)]">{step.description}</p>
              </div>
              {step.status === 'current' && (
                <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full animate-pulse" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-[var(--color-ink-muted)] mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-1.5">
          <div
            className="bg-accent h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center text-xs text-[var(--color-ink-muted)]">
        <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" aria-hidden />
        Auto-saved • Last updated just now
      </div>
    </div>
  );
};

export default ProgressTracker;