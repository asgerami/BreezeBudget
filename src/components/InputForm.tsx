import React, { useState } from 'react';
import { MapPin, Home, Thermometer, Zap, Shield, Clock } from 'lucide-react';
import { CalculationInputs, ACUnit } from '../types';
import { acUnits } from '../data/acUnits';
import { validateZipCode } from '../utils/api';

interface InputFormProps {
  inputs: CalculationInputs;
  onInputChange: (inputs: CalculationInputs) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  isCalculating
}) => {
  const [zipError, setZipError] = useState('');

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

  const canCalculate = inputs.zipCode && 
                      inputs.squareFootage > 0 && 
                      !zipError && 
                      inputs.selectedUnit !== null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Home className="w-6 h-6 text-blue-600" />
        AC System Configuration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            ZIP Code
          </label>
          <input
            type="text"
            value={inputs.zipCode}
            onChange={(e) => handleZipChange(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              zipError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter ZIP code"
            maxLength={5}
          />
          {zipError && (
            <p className="text-red-500 text-sm mt-1">{zipError}</p>
          )}
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Home className="w-4 h-4" />
            House Square Footage
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

        {/* Thermostat Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
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

        {/* Operating Hours */}
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

        {/* Insulation Quality */}
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

        {/* SEER2 Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            SEER2 Rating
          </label>
          <input
            type="number"
            value={inputs.seer2Rating}
            onChange={(e) => onInputChange({ ...inputs, seer2Rating: Number(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter SEER2 rating"
            min="13"
            max="21"
            step="0.1"
          />
          <p className="text-gray-500 text-sm mt-1">Range: 13 - 21 SEER2</p>
        </div>
      </div>

      {/* AC Unit Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select AC Unit Brand & Model
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Calculate Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onCalculate}
          disabled={!canCalculate || isCalculating}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
            canCalculate && !isCalculating
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
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
};

export default InputForm;