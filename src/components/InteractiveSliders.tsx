import React from 'react';
import { Thermometer, Home, Clock, Zap } from 'lucide-react';
import { CalculationInputs } from '../types';

interface InteractiveSlidersProps {
  inputs: CalculationInputs;
  onInputChange: (inputs: CalculationInputs) => void;
  onRealTimeUpdate: (inputs: CalculationInputs) => void;
  realTimeCosts: {
    dailyCost: number;
    monthlyCost: number;
    annualCost: number;
  } | null;
}

const InteractiveSliders: React.FC<InteractiveSlidersProps> = ({
  inputs,
  onInputChange,
  onRealTimeUpdate,
  realTimeCosts
}) => {
  const handleSliderChange = (field: keyof CalculationInputs, value: number) => {
    const newInputs = { ...inputs, [field]: value };
    onInputChange(newInputs);
    onRealTimeUpdate(newInputs);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6 text-purple-600" />
        Real-Time Cost Adjustments
      </h2>

      {/* Real-time cost display */}
      {realTimeCosts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
            <p className="text-green-100 text-sm">Daily Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(realTimeCosts.dailyCost)}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
            <p className="text-blue-100 text-sm">Monthly Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(realTimeCosts.monthlyCost)}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
            <p className="text-purple-100 text-sm">Annual Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(realTimeCosts.annualCost)}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Square Footage Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            <label className="font-medium text-gray-700">
              Square Footage: {inputs.squareFootage.toLocaleString()} sq ft
            </label>
          </div>
          <div className="relative">
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={inputs.squareFootage}
              onChange={(e) => handleSliderChange('squareFootage', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>500</span>
              <span>2,750</span>
              <span>5,000</span>
            </div>
          </div>
        </div>

        {/* Thermostat Temperature Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-600" />
            <label className="font-medium text-gray-700">
              Thermostat Setting: {inputs.thermostatTemp}°F
            </label>
          </div>
          <div className="relative">
            <input
              type="range"
              min="65"
              max="85"
              step="1"
              value={inputs.thermostatTemp}
              onChange={(e) => handleSliderChange('thermostatTemp', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>65°F</span>
              <span>75°F</span>
              <span>85°F</span>
            </div>
          </div>
        </div>

        {/* Operating Hours Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <label className="font-medium text-gray-700">
              Operating Hours: {inputs.operatingHours} hrs/day
            </label>
          </div>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={inputs.operatingHours}
              onChange={(e) => handleSliderChange('operatingHours', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1hr</span>
              <span>12hrs</span>
              <span>24hrs</span>
            </div>
          </div>
        </div>

        {/* SEER2 Rating Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <label className="font-medium text-gray-700">
              SEER2 Rating: {inputs.seer2Rating}
            </label>
          </div>
          <div className="relative">
            <input
              type="range"
              min="13"
              max="21"
              step="0.5"
              value={inputs.seer2Rating}
              onChange={(e) => handleSliderChange('seer2Rating', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>13</span>
              <span>17</span>
              <span>21</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Adjust the sliders above to see how different settings affect your energy costs in real-time. 
          Lower thermostat settings and higher SEER2 ratings generally reduce costs, while larger homes and longer operating hours increase them.
        </p>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default InteractiveSliders;