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
      case 0: return inputs.zipCode && !zipError;
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
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Where is your home located?</h2>
              <p className="text-gray-600">We'll use this to get accurate weather data and electricity rates.</p>
            </div>
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={inputs.zipCode}
                onChange={(e) => handleZipChange(e.target.value)}
                className={`w-full p-4 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  zipError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter ZIP code (e.g., 90210)"
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
              <Home className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about your home</h2>
              <p className="text-gray-600">These details help us calculate the right AC size for your space.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage
                </label>
                <input
                  type="number"
                  value={inputs.squareFootage}
                  onChange={(e) => onInputChange({ ...inputs, squareFootage: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter square footage"
                  min="500"
                  max="10000"
                />
                <p className="text-gray-500 text-sm mt-1">Range: 500 - 10,000 sq ft</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Insulation Quality
                </label>
                <select
                  value={inputs.insulationQuality}
                  onChange={(e) => onInputChange({ ...inputs, insulationQuality: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              <Thermometer className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Comfort preferences</h2>
              <p className="text-gray-600">Set your ideal temperature and usage patterns.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Temperature (°F)
                </label>
                <input
                  type="number"
                  value={inputs.thermostatTemp}
                  onChange={(e) => onInputChange({ ...inputs, thermostatTemp: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter desired temperature"
                  min="65"
                  max="85"
                />
                <p className="text-gray-500 text-sm mt-1">Range: 65°F - 85°F</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Operating Hours per Day
                </label>
                <input
                  type="number"
                  value={inputs.operatingHours}
                  onChange={(e) => onInputChange({ ...inputs, operatingHours: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter hours per day"
                  min="1"
                  max="24"
                />
                <p className="text-gray-500 text-sm mt-1">Range: 1 - 24 hours</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose your AC unit</h2>
              <p className="text-gray-600">Select from popular brands and models with different efficiency ratings.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {acUnits.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => handleUnitSelection(unit.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    inputs.selectedUnit?.id === unit.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800">{unit.brand}</h3>
                    <p className="text-sm text-gray-600">{unit.model}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-600">
                        SEER2: {unit.seer2}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${unit.estimatedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review your configuration</h2>
              <p className="text-gray-600">Check your settings before calculating costs.</p>
            </div>
            <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Location & Home</h3>
                  <p className="text-sm text-gray-600">ZIP Code: {inputs.zipCode}</p>
                  <p className="text-sm text-gray-600">Square Footage: {inputs.squareFootage.toLocaleString()} sq ft</p>
                  <p className="text-sm text-gray-600">Insulation: {inputs.insulationQuality}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Preferences</h3>
                  <p className="text-sm text-gray-600">Temperature: {inputs.thermostatTemp}°F</p>
                  <p className="text-sm text-gray-600">Operating Hours: {inputs.operatingHours} hrs/day</p>
                </div>
                {inputs.selectedUnit && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-2">Selected AC Unit</h3>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium">{inputs.selectedUnit.brand} {inputs.selectedUnit.model}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-blue-600">SEER2: {inputs.selectedUnit.seer2}</span>
                        <span className="text-sm text-gray-500">${inputs.selectedUnit.estimatedPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={onCalculate}
                disabled={isCalculating}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 mx-auto ${
                  !isCalculating
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Calculate Costs
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const canAccess = index <= currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : canAccess
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>
        
        {/* Sidebar with helpful information */}
        <div className="space-y-4">
          {currentStep === 3 && (
            <ColorLegend type="efficiency" />
          )}
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Helpful Tip</h4>
            <p className="text-sm text-blue-800">
              {getHelpfulTip(currentStep)}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">✅ Why This Matters</h4>
            <p className="text-sm text-green-800">
              {getWhyItMatters(currentStep)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed(currentStep)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              canProceed(currentStep)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
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