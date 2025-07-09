import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart3, TrendingUp } from 'lucide-react';
import { generateCostProjections } from '../utils/calculations';
import { CalculationInputs, WeatherData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CostChartProps {
  inputs: CalculationInputs;
  weatherData: WeatherData;
}

const CostChart: React.FC<CostChartProps> = ({ inputs, weatherData }) => {
  const [projections, setProjections] = React.useState<Array<{ month: string; cost: number; usage: number }>>([]);
  const [seerComparisonData, setSeerComparisonData] = React.useState<Array<{ seer: number; annualCost: number }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProjections = async () => {
      setLoading(true);
      try {
        const data = await generateCostProjections(inputs, weatherData);
        setProjections(data);
        
        // Calculate SEER comparison data asynchronously
        const seerValues = [13, 14, 15, 16, 17, 18, 19, 20, 21];
        const seerPromises = seerValues.map(async (seer) => {
          const tempInputs = { ...inputs, seer2Rating: seer };
          const projections = await generateCostProjections(tempInputs, weatherData);
          const annualCost = projections.reduce((sum, p) => sum + p.cost, 0);
          return { seer, annualCost };
        });
        
        const seerResults = await Promise.all(seerPromises);
        setSeerComparisonData(seerResults);
      } catch (error) {
        console.error('Error generating projections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjections();
  }, [inputs, weatherData]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading detailed projections...</span>
        </div>
      </div>
    );
  }

  const lineChartData = {
    labels: projections.map(p => p.month),
    datasets: [
      {
        label: 'Monthly Cost ($)',
        data: projections.map(p => p.cost),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: projections.map(p => p.month),
    datasets: [
      {
        label: 'Monthly Energy Usage (kWh)',
        data: projections.map(p => p.usage),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label?.includes('Cost')) {
              return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
            }
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kWh`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return typeof value === 'number' ? 
              (this.chart?.data?.datasets?.[0]?.label?.includes('Cost') ? 
                `$${value.toFixed(0)}` : 
                `${value.toFixed(0)}`) : 
              value;
          },
        },
      },
    },
  };

  const seerChartData = {
    labels: seerComparisonData.map(s => `SEER2 ${s.seer}`),
    datasets: [
      {
        label: 'Annual Cost ($)',
        data: seerComparisonData.map(s => s.annualCost),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        Cost & Usage Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cost Projection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Monthly Cost Projection
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Energy Usage */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Monthly Energy Usage
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* SEER Rating Comparison */}
        <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            SEER2 Rating Cost Comparison (Annual)
          </h3>
          <div className="h-64">
            <Bar data={seerChartData} options={chartOptions} />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Higher SEER2 ratings mean better energy efficiency and lower operating costs. 
              While higher-rated units cost more upfront, they can save money in the long run through reduced energy bills.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600 font-medium">Peak Month</p>
          <p className="text-xl font-bold text-blue-800">
            {projections.reduce((peak, current) => 
              current.cost > peak.cost ? current : peak
            ).month}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-600 font-medium">Lowest Month</p>
          <p className="text-xl font-bold text-green-800">
            {projections.reduce((low, current) => 
              current.cost < low.cost ? current : low
            ).month}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-600 font-medium">Annual Total</p>
          <p className="text-xl font-bold text-purple-800">
            ${projections.reduce((sum, p) => sum + p.cost, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-sm text-orange-600 font-medium">Avg. Monthly</p>
          <p className="text-xl font-bold text-orange-800">
            ${(projections.reduce((sum, p) => sum + p.cost, 0) / 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostChart;