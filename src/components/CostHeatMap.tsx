import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Thermometer } from 'lucide-react';
import { CalculationInputs, WeatherData } from '../types';
import { generateCostProjections } from '../utils/calculations';

interface CostHeatMapProps {
  inputs: CalculationInputs;
  weatherData: WeatherData & { lat?: number; lon?: number; state?: string };
}

const CostHeatMap: React.FC<CostHeatMapProps> = ({ inputs, weatherData }) => {
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; cost: number; usage: number; temperature: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cost' | 'usage'>('cost');

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const loadHeatMapData = async () => {
      setLoading(true);
      try {
        const projections = await generateCostProjections(inputs, weatherData);
        
        // Add temperature data (estimated seasonal variations)
        const currentTemp = weatherData.temperature;
        const seasonalFactors = [-20, -15, -5, 5, 10, 15, 20, 18, 12, 2, -10, -18];
        
        const enhancedData = projections.map((proj, index) => ({
          ...proj,
          temperature: Math.max(40, Math.min(110, currentTemp + seasonalFactors[index]))
        }));
        
        setMonthlyData(enhancedData);
      } catch (error) {
        console.error('Error loading heat map data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeatMapData();
  }, [inputs, weatherData]);

  const getHeatMapColor = (value: number, min: number, max: number, type: 'cost' | 'usage'): string => {
    const intensity = (value - min) / (max - min);
    
    if (type === 'cost') {
      // Red gradient for costs (higher = more red)
      const red = Math.round(255 * intensity);
      const green = Math.round(255 * (1 - intensity));
      return `rgb(${red}, ${green}, 50)`;
    } else {
      // Blue gradient for usage (higher = more blue)
      const blue = Math.round(255 * intensity);
      const red = Math.round(255 * (1 - intensity));
      return `rgb(${red}, 50, ${blue})`;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading heat map...</span>
        </div>
      </div>
    );
  }

  const values = monthlyData.map(d => viewMode === 'cost' ? d.cost : d.usage);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-600" />
          Monthly Cost Heat Map
        </h2>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cost')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'cost'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cost View
          </button>
          <button
            onClick={() => setViewMode('usage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'usage'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Usage View
          </button>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {monthlyData.map((data, index) => {
            const value = viewMode === 'cost' ? data.cost : data.usage;
            const color = getHeatMapColor(value, minValue, maxValue, viewMode);
            
            return (
              <div
                key={data.month}
                className="relative group"
              >
                <div
                  className="aspect-square rounded-lg border border-gray-200 flex flex-col items-center justify-center text-white font-medium text-sm cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                >
                  <div className="text-xs opacity-90">{data.month}</div>
                  <div className="text-xs font-bold">
                    {viewMode === 'cost' 
                      ? formatCurrency(value)
                      : `${Math.round(value)} kWh`
                    }
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <div className="font-semibold">{data.month}</div>
                  <div>Cost: {formatCurrency(data.cost)}</div>
                  <div>Usage: {Math.round(data.usage)} kWh</div>
                  <div>Temp: {data.temperature}°F</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {viewMode === 'cost' ? 'Monthly Cost' : 'Monthly Usage'}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ 
              backgroundColor: getHeatMapColor(minValue, minValue, maxValue, viewMode) 
            }}></div>
            <span className="text-xs text-gray-600">Low</span>
            <div className="w-8 h-2 rounded" style={{
              background: `linear-gradient(to right, ${getHeatMapColor(minValue, minValue, maxValue, viewMode)}, ${getHeatMapColor(maxValue, minValue, maxValue, viewMode)})`
            }}></div>
            <span className="text-xs text-gray-600">High</span>
            <div className="w-4 h-4 rounded" style={{ 
              backgroundColor: getHeatMapColor(maxValue, minValue, maxValue, viewMode) 
            }}></div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Range: {viewMode === 'cost' 
            ? `${formatCurrency(minValue)} - ${formatCurrency(maxValue)}`
            : `${Math.round(minValue)} - ${Math.round(maxValue)} kWh`
          }
        </div>
      </div>

      {/* Seasonal Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { season: 'Winter', months: [0, 1, 11], icon: '❄️' },
          { season: 'Spring', months: [2, 3, 4], icon: '🌸' },
          { season: 'Summer', months: [5, 6, 7], icon: '☀️' },
          { season: 'Fall', months: [8, 9, 10], icon: '🍂' }
        ].map(({ season, months, icon }) => {
          const seasonalData = months.map(i => monthlyData[i]);
          const avgCost = seasonalData.reduce((sum, d) => sum + d.cost, 0) / seasonalData.length;
          const avgUsage = seasonalData.reduce((sum, d) => sum + d.usage, 0) / seasonalData.length;
          const avgTemp = seasonalData.reduce((sum, d) => sum + d.temperature, 0) / seasonalData.length;
          
          return (
            <div key={season} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{icon}</span>
                <h3 className="font-semibold text-gray-800">{season}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Cost:</span>
                  <span className="font-medium">{formatCurrency(avgCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Usage:</span>
                  <span className="font-medium">{Math.round(avgUsage)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Temp:</span>
                  <span className="font-medium">{Math.round(avgTemp)}°F</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Thermometer className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Heat Map Insights</h4>
            <p className="text-orange-800 text-sm">
              The heat map shows how your AC costs vary throughout the year. Darker colors indicate higher costs/usage, 
              typically during peak summer months when outdoor temperatures are highest and your AC works harder to maintain comfort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostHeatMap;