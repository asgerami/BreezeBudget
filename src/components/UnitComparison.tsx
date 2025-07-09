import React, { useState, useEffect } from 'react';
import { Zap, DollarSign, TrendingUp, Award, X } from 'lucide-react';
import { CalculationInputs, ACUnit, WeatherData } from '../types';
import { acUnits } from '../data/acUnits';
import { calculateCosts } from '../utils/calculations';

interface UnitComparisonProps {
  inputs: CalculationInputs;
  weatherData: WeatherData & { state?: string } | null;
}

interface ComparisonData {
  unit: ACUnit;
  costs: {
    dailyCost: number;
    monthlyCost: number;
    annualCost: number;
    energyUsage: number;
  };
  paybackPeriod: number;
  efficiency: 'Low' | 'Medium' | 'High' | 'Excellent';
}

const UnitComparison: React.FC<UnitComparisonProps> = ({ inputs, weatherData }) => {
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(false);

  const getEfficiencyRating = (seer2: number): 'Low' | 'Medium' | 'High' | 'Excellent' => {
    if (seer2 >= 18) return 'Excellent';
    if (seer2 >= 16) return 'High';
    if (seer2 >= 14) return 'Medium';
    return 'Low';
  };

  const getEfficiencyColor = (efficiency: string): string => {
    switch (efficiency) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculatePaybackPeriod = (unit: ACUnit, annualSavings: number): number => {
    const baseUnit = acUnits.find(u => u.seer2 === 13);
    if (!baseUnit || annualSavings <= 0) return 0;
    
    const priceDifference = unit.estimatedPrice - baseUnit.estimatedPrice;
    return priceDifference / annualSavings;
  };

  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnits(prev => {
      if (prev.includes(unitId)) {
        return prev.filter(id => id !== unitId);
      } else if (prev.length < 4) {
        return [...prev, unitId];
      }
      return prev;
    });
  };

  const removeUnit = (unitId: string) => {
    setSelectedUnits(prev => prev.filter(id => id !== unitId));
  };

  useEffect(() => {
    const loadComparisonData = async () => {
      if (!weatherData || selectedUnits.length === 0) {
        setComparisonData([]);
        return;
      }

      setLoading(true);
      try {
        const comparisons: ComparisonData[] = [];
        
        for (const unitId of selectedUnits) {
          const unit = acUnits.find(u => u.id === unitId);
          if (!unit) continue;

          const unitInputs = { ...inputs, selectedUnit: unit, seer2Rating: unit.seer2 };
          const results = await calculateCosts(unitInputs, weatherData);
          
          const baselineUnit = acUnits.find(u => u.seer2 === 13);
          let paybackPeriod = 0;
          
          if (baselineUnit) {
            const baselineInputs = { ...inputs, selectedUnit: baselineUnit, seer2Rating: 13 };
            const baselineResults = await calculateCosts(baselineInputs, weatherData);
            const annualSavings = baselineResults.annualCost - results.annualCost;
            paybackPeriod = calculatePaybackPeriod(unit, annualSavings);
          }

          comparisons.push({
            unit,
            costs: {
              dailyCost: results.dailyCost,
              monthlyCost: results.monthlyCost,
              annualCost: results.annualCost,
              energyUsage: results.energyUsage,
            },
            paybackPeriod,
            efficiency: getEfficiencyRating(unit.seer2),
          });
        }

        // Sort by annual cost (lowest first)
        comparisons.sort((a, b) => a.costs.annualCost - b.costs.annualCost);
        setComparisonData(comparisons);
      } catch (error) {
        console.error('Error calculating comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComparisonData();
  }, [selectedUnits, inputs, weatherData]);

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
        <TrendingUp className="w-6 h-6 text-green-600" />
        AC Unit Comparison Tool
      </h2>

      {/* Unit Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select units to compare (up to 4)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {acUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() => toggleUnitSelection(unit.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedUnits.includes(unit.id)
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{unit.brand}</h4>
                  <p className="text-sm text-gray-600">{unit.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-blue-600">
                      SEER2: {unit.seer2}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEfficiencyColor(getEfficiencyRating(unit.seer2))}`}>
                      {getEfficiencyRating(unit.seer2)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  ${unit.estimatedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        {selectedUnits.length >= 4 && (
          <p className="text-sm text-orange-600 mt-2">
            Maximum of 4 units can be compared at once.
          </p>
        )}
      </div>

      {/* Comparison Results */}
      {selectedUnits.length > 0 && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Calculating comparisons...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Units Header */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUnits.map(unitId => {
                  const unit = acUnits.find(u => u.id === unitId);
                  return unit ? (
                    <div key={unitId} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <span>{unit.brand} {unit.model}</span>
                      <button
                        onClick={() => removeUnit(unitId)}
                        className="hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border-b font-semibold text-gray-800">Unit</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">SEER2</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">Efficiency</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">Purchase Price</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">Annual Cost</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">10-Year Total</th>
                      <th className="text-center p-3 border-b font-semibold text-gray-800">Payback Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((data, index) => (
                      <tr key={data.unit.id} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                        <td className="p-3 border-b">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Award className="w-4 h-4 text-green-600" />}
                            <div>
                              <p className="font-medium text-gray-800">{data.unit.brand}</p>
                              <p className="text-sm text-gray-600">{data.unit.model}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-3 border-b font-medium">{data.unit.seer2}</td>
                        <td className="text-center p-3 border-b">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyColor(data.efficiency)}`}>
                            {data.efficiency}
                          </span>
                        </td>
                        <td className="text-center p-3 border-b font-medium">
                          {formatCurrency(data.unit.estimatedPrice)}
                        </td>
                        <td className="text-center p-3 border-b font-medium">
                          {formatCurrency(data.costs.annualCost)}
                        </td>
                        <td className="text-center p-3 border-b font-medium">
                          {formatCurrency(data.unit.estimatedPrice + (data.costs.annualCost * 10))}
                        </td>
                        <td className="text-center p-3 border-b">
                          {data.paybackPeriod > 0 ? `${data.paybackPeriod.toFixed(1)} years` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Insights */}
              {comparisonData.length > 1 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Most Cost-Effective</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      {comparisonData[0].unit.brand} {comparisonData[0].unit.model} offers the lowest annual operating cost.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Highest Efficiency</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      {comparisonData.reduce((highest, current) => 
                        current.unit.seer2 > highest.unit.seer2 ? current : highest
                      ).unit.brand} {comparisonData.reduce((highest, current) => 
                        current.unit.seer2 > highest.unit.seer2 ? current : highest
                      ).unit.model} has the highest SEER2 rating.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Potential Savings</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Choosing the most efficient unit could save up to {formatCurrency(
                        Math.max(...comparisonData.map(d => d.costs.annualCost)) - 
                        Math.min(...comparisonData.map(d => d.costs.annualCost))
                      )} annually.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedUnits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select AC units above to start comparing costs and efficiency ratings.</p>
        </div>
      )}
    </div>
  );
};

export default UnitComparison;