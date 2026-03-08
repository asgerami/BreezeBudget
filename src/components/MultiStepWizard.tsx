import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, Thermometer, Zap, Shield, Clock, CheckCircle } from 'lucide-react';
import ProgressTracker from './ProgressTracker';
import ColorLegend from './ColorLegend';
import { CalculationInputs, ACUnit } from '../types';
import { acUnits } from '../data/acUnits';
import { validateZipCode } from '../utils/api';

interface MultiStepWizardProps {
  inputs: CalculationInputs;
  onInputChange: (inputs: CalculationInputs) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

const MultiStepWizard: React.FC<MultiStepWizardProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  isCalculating
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [zipError, setZipError] = useState('');

  const steps = [
    { id: 'location', title: 'Location', icon: MapPin },
    { id: 'home', title: 'Home Details', icon: Home },
    { id: 'preferences', title: 'Preferences', icon: Thermometer },
    { id: 'unit', title: 'AC Unit Selection', icon: Zap },
    { id: 'review', title: 'Review & Calculate', icon: CheckCircle }
  ];

  const progressSteps = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: getStepDescription(index),
    status: index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming'
  }));

  function getStepDescription(stepIndex: number): string {
    const descriptions = [
      'Enter your ZIP code for weather data',
      'Provide home size and insulation details',
      'Set temperature and usage preferences',
      'Choose from popular AC unit brands',
      'Review settings and get results'
    ];
    return descriptions[stepIndex] || '';
  }

  const handleZipChange = (value: string) => {
    onInputChange({ ...inputs, zipCode: value });

    if (value && !validateZipCode(value)) {
      setZipError('Please enter a valid 5-digit ZIP code');
    } else {
      setZipError('');
    }
  };

  const handleUnitSelection = (unitId: string) => {
    const unit = acUnits.find(u => u.id === unitId);
    onInputChange({
      ...inputs,
      selectedUnit: unit || null,
      seer2Rating: unit ? unit.seer2 : inputs.seer2Rating
    });
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0: return !!inputs.zipCode && !zipError;
      case 1: return inputs.squareFootage > 0;
      case 2: return inputs.thermostatTemp >= 65 && inputs.thermostatTemp <= 85;
      case 3: return inputs.selectedUnit !== null;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-14 h-14 text-accent mx-auto mb-4" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-2">Where is your home located?</h2>
              <p className="text-[var(--color-ink-muted)]">We'll use this for weather data and electricity rates.</p>
            </div>
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                ZIP code
              </label>
              <input
                type="text"
                value={inputs.zipCode}
                onChange={(e) => handleZipChange(e.target.value)}
                className={`w-full p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${zipError ? 'border-red-500' : 'border-stone-300'
                  }`}
                placeholder="e.g. 90210"
                maxLength={5}
              />
              {zipError && (
                <p className="text-red-500 text-sm mt-2">{zipError}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Home className="w-14 h-14 text-accent mx-auto mb-4" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-2">Tell us about your home</h2>
              <p className="text-[var(--color-ink-muted)]">These details help us size and cost your AC.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                  Square footage
                </label>
                <input
                  type="number"
                  value={inputs.squareFootage}
                  onChange={(e) => onInputChange({ ...inputs, squareFootage: Number(e.target.value) })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g. 2000"
                  min="500"
                  max="10000"
                />
                <p className="text-[var(--color-ink-muted)] text-sm mt-1">500 – 10,000 sq ft</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" aria-hidden />
                  Insulation quality
                </label>
                <select
                  value={inputs.insulationQuality}
                  onChange={(e) => onInputChange({ ...inputs, insulationQuality: e.target.value as any })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="poor">Poor - Old/minimal insulation</option>
                  <option value="average">Average - Standard insulation</option>
                  <option value="good">Good - Above average insulation</option>
                  <option value="excellent">Excellent - High-performance insulation</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Thermometer className="w-14 h-14 text-accent mx-auto mb-4" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-2">Comfort preferences</h2>
              <p className="text-[var(--color-ink-muted)]">Set temperature and usage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2">
                  Desired temperature (°F)
                </label>
                <input
                  type="number"
                  value={inputs.thermostatTemp}
                  onChange={(e) => onInputChange({ ...inputs, thermostatTemp: Number(e.target.value) })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g. 75"
                  min="65"
                  max="85"
                />
                <p className="text-[var(--color-ink-muted)] text-sm mt-1">65 – 85°F</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-ink)] mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" aria-hidden />
                  Operating hours per day
                </label>
                <input
                  type="number"
                  value={inputs.operatingHours}
                  onChange={(e) => onInputChange({ ...inputs, operatingHours: Number(e.target.value) })}
                  className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g. 8"
                  min="1"
                  max="24"
                />
                <p className="text-[var(--color-ink-muted)] text-sm mt-1">1 – 24 hours</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-14 h-14 text-accent mx-auto mb-4" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-2">Choose your AC unit</h2>
              <p className="text-[var(--color-ink-muted)]">Select a brand and model to compare.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {acUnits.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => handleUnitSelection(unit.id)}
                  className={`p-4 border rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${inputs.selectedUnit?.id === unit.id
                      ? 'border-accent bg-accent-muted ring-1 ring-accent'
                      : 'border-stone-200 hover:border-stone-300 bg-surface-elevated'
                    }`}
                >
                  <h3 className="font-display font-semibold text-[var(--color-ink)]">{unit.brand}</h3>
                  <p className="text-sm text-[var(--color-ink-muted)]">{unit.model}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-accent">SEER2: {unit.seer2}</span>
                    <span className="text-sm text-[var(--color-ink-muted)]">${unit.estimatedPrice.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" aria-hidden />
              <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-2">Review your configuration</h2>
              <p className="text-[var(--color-ink-muted)]">Check settings, then run the calculation.</p>
            </div>
            <div className="max-w-2xl mx-auto bg-surface-muted border border-stone-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-display font-semibold text-[var(--color-ink)] mb-2 text-sm">Location & home</h3>
                  <p className="text-sm text-[var(--color-ink-muted)]">ZIP: {inputs.zipCode}</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">{inputs.squareFootage.toLocaleString()} sq ft</p>
                  <p className="text-sm text-[var(--color-ink-muted)] capitalize">Insulation: {inputs.insulationQuality}</p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--color-ink)] mb-2 text-sm">Preferences</h3>
                  <p className="text-sm text-[var(--color-ink-muted)]">{inputs.thermostatTemp}°F</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">{inputs.operatingHours} hrs/day</p>
                </div>
                {inputs.selectedUnit && (
                  <div className="md:col-span-2">
                    <h3 className="font-display font-semibold text-[var(--color-ink)] mb-2 text-sm">Selected unit</h3>
                    <div className="bg-surface-elevated border border-stone-200 rounded-lg p-4">
                      <p className="font-medium text-[var(--color-ink)]">{inputs.selectedUnit.brand} {inputs.selectedUnit.model}</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-accent font-medium">SEER2: {inputs.selectedUnit.seer2}</span>
                        <span className="text-[var(--color-ink-muted)]">${inputs.selectedUnit.estimatedPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={onCalculate}
                disabled={isCalculating}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 mx-auto focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${!isCalculating
                    ? 'bg-accent hover:bg-accent-hover'
                    : 'bg-stone-400 cursor-not-allowed'
                  }`}
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Calculating…
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" aria-hidden />
                    Calculate costs
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-elevated border border-stone-200 rounded-xl p-6 mb-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                      ? 'bg-accent text-white'
                      : isActive
                        ? 'bg-accent text-white'
                        : 'bg-surface-muted text-[var(--color-ink-muted)] border border-stone-200'
                    }`}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-accent font-medium' : 'text-[var(--color-ink-muted)]'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-stone-200 rounded-full h-1.5">
          <div
            className="bg-accent h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>

        {/* Sidebar - single neutral style, no rainbow */}
        <div className="space-y-4">
          {currentStep === 3 && (
            <ColorLegend type="efficiency" />
          )}
          <div className="bg-surface-muted border border-stone-200 rounded-lg p-4">
            <h4 className="font-display font-semibold text-[var(--color-ink)] mb-2 text-sm">Tip</h4>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {getHelpfulTip(currentStep)}
            </p>
          </div>
          <div className="bg-surface-muted border border-stone-200 rounded-lg p-4">
            <h4 className="font-display font-semibold text-[var(--color-ink)] mb-2 text-sm">Why it matters</h4>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {getWhyItMatters(currentStep)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - secondary left, primary right */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${currentStep === 0
                ? 'bg-surface-muted text-stone-400 cursor-not-allowed'
                : 'bg-surface-muted border border-stone-200 text-[var(--color-ink)] hover:bg-stone-100'
              }`}
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
            Previous
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed(currentStep)}
            className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${canProceed(currentStep)
                ? 'bg-accent text-white hover:bg-accent-hover'
                : 'bg-surface-muted text-stone-400 cursor-not-allowed'
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );

  function getHelpfulTip(step: number): string {
    const tips = [
      'Your ZIP code helps us get accurate weather data and local electricity rates for precise cost calculations.',
      'Larger homes and poor insulation require more cooling capacity, which affects both unit size and operating costs.',
      'Each degree lower on your thermostat can increase cooling costs by 6-8%. Find your comfort sweet spot!',
      'Higher SEER2 ratings mean better efficiency. A SEER2 16 unit uses about 25% less energy than a SEER2 13.',
      'Double-check your selections. You can always go back to adjust any settings before calculating.'
    ];
    return tips[step] || '';
  }

  function getWhyItMatters(step: number): string {
    const reasons = [
      'Local weather patterns directly impact how hard your AC works throughout the year.',
      'Proper sizing prevents short cycling and ensures optimal efficiency and comfort.',
      'Small preference changes can lead to significant savings over time.',
      'The right unit can save hundreds or thousands of dollars annually in energy costs.',
      'Accurate inputs ensure reliable cost projections for your investment decision.'
    ];
    return reasons[step] || '';
  }
};

export default MultiStepWizard;