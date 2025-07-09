import React from 'react';
import { Info } from 'lucide-react';

interface ColorLegendProps {
  type: 'cost' | 'efficiency' | 'usage' | 'temperature';
  className?: string;
}

const ColorLegend: React.FC<ColorLegendProps> = ({ type, className = '' }) => {
  const legends = {
    cost: {
      title: 'Cost Level',
      items: [
        { color: 'bg-green-500', label: 'Low Cost', range: '$0-50' },
        { color: 'bg-yellow-500', label: 'Medium Cost', range: '$50-100' },
        { color: 'bg-orange-500', label: 'High Cost', range: '$100-150' },
        { color: 'bg-red-500', label: 'Very High Cost', range: '$150+' }
      ]
    },
    efficiency: {
      title: 'Efficiency Rating',
      items: [
        { color: 'bg-red-500', label: 'Low', range: 'SEER2 13-14' },
        { color: 'bg-yellow-500', label: 'Medium', range: 'SEER2 15-16' },
        { color: 'bg-blue-500', label: 'High', range: 'SEER2 17-18' },
        { color: 'bg-green-500', label: 'Excellent', range: 'SEER2 19+' }
      ]
    },
    usage: {
      title: 'Energy Usage',
      items: [
        { color: 'bg-blue-100', label: 'Low Usage', range: '0-500 kWh' },
        { color: 'bg-blue-300', label: 'Medium Usage', range: '500-1000 kWh' },
        { color: 'bg-blue-500', label: 'High Usage', range: '1000-1500 kWh' },
        { color: 'bg-blue-700', label: 'Very High Usage', range: '1500+ kWh' }
      ]
    },
    temperature: {
      title: 'Temperature Range',
      items: [
        { color: 'bg-blue-500', label: 'Cool', range: '60-70°F' },
        { color: 'bg-green-500', label: 'Mild', range: '70-80°F' },
        { color: 'bg-yellow-500', label: 'Warm', range: '80-90°F' },
        { color: 'bg-red-500', label: 'Hot', range: '90+°F' }
      ]
    }
  };

  const legend = legends[type];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-gray-600" />
        <h4 className="font-medium text-gray-800">{legend.title}</h4>
      </div>
      
      <div className="space-y-2">
        {legend.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded ${item.color}`}></div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-xs text-gray-500 ml-2">({item.range})</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Colors help you quickly identify patterns and make comparisons across different scenarios.
        </p>
      </div>
    </div>
  );
};

export default ColorLegend;