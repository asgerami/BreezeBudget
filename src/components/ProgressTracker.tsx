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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
        <div className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isClickable = onStepClick && (step.status === 'completed' || step.status === 'current');
          
          return (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-200 ${
                isClickable 
                  ? 'cursor-pointer hover:bg-gray-50' 
                  : ''
              } ${
                step.status === 'current' 
                  ? 'bg-blue-50 border border-blue-200' 
                  : ''
              }`}
              onClick={isClickable ? () => onStepClick(index) : undefined}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'completed' && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {step.status === 'current' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                )}
                {step.status === 'upcoming' && (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  step.status === 'completed' 
                    ? 'text-green-700' 
                    : step.status === 'current'
                    ? 'text-blue-700'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-xs mt-1 ${
                  step.status === 'completed' 
                    ? 'text-green-600' 
                    : step.status === 'current'
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
              
              {step.status === 'current' && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Auto-save indicator */}
      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        Auto-saved • Last updated just now
      </div>
    </div>
  );
};

export default ProgressTracker;