import React from 'react';
import { DollarSign, Zap, Thermometer, Calendar } from 'lucide-react';
import { CostCalculation } from '../types';

interface CostDisplayProps {
  calculation: CostCalculation;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ calculation }) => {
  const { results, weatherData, inputs } = calculation;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-600" />
        Cost Analysis Results
      </h2>

      {/* Weather & Location Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Current Conditions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Location:</span>
            <p className="font-medium">{weatherData.location}</p>
          </div>
          <div>
            <span className="text-gray-600">Temperature:</span>
            <p className="font-medium">{weatherData.temperature}°F</p>
          </div>
          <div>
            <span className="text-gray-600">Humidity:</span>
            <p className="font-medium">{weatherData.humidity}%</p>
          </div>
        </div>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Daily Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(results.dailyCost)}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Monthly Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(results.monthlyCost)}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Annual Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(results.annualCost)}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Energy Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Energy Usage:</span>
              <span className="font-medium">{results.energyUsage.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Energy Usage:</span>
              <span className="font-medium">{(results.energyUsage * 30.4).toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Energy Usage:</span>
              <span className="font-medium">{(results.energyUsage * 365).toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SEER2 Rating:</span>
              <span className="font-medium">{results.efficiencyRating}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-600" />
            System Specifications
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">BTU Requirement:</span>
              <span className="font-medium">{formatNumber(results.btuRequirement)} BTU/hr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Square Footage:</span>
              <span className="font-medium">{inputs.squareFootage.toLocaleString()} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Insulation Quality:</span>
              <span className="font-medium capitalize">{inputs.insulationQuality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Operating Hours:</span>
              <span className="font-medium">{inputs.operatingHours} hrs/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Unit Information */}
      {inputs.selectedUnit && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Selected AC Unit</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Brand:</span>
              <p className="font-medium">{inputs.selectedUnit.brand}</p>
            </div>
            <div>
              <span className="text-gray-600">Model:</span>
              <p className="font-medium">{inputs.selectedUnit.model}</p>
            </div>
            <div>
              <span className="text-gray-600">SEER2:</span>
              <p className="font-medium">{inputs.selectedUnit.seer2}</p>
            </div>
            <div>
              <span className="text-gray-600">Est. Price:</span>
              <p className="font-medium">{formatCurrency(inputs.selectedUnit.estimatedPrice)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostDisplay;