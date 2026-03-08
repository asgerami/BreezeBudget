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
    <div className="bg-surface-elevated border border-stone-200 rounded-xl p-6 mb-6">
      <h2 className="font-display text-2xl font-bold text-[var(--color-ink)] mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-accent" aria-hidden />
        Cost analysis results
      </h2>

      {/* Weather & location - neutral panel */}
      <div className="bg-surface-muted border border-stone-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="w-5 h-5 text-[var(--color-ink-muted)]" aria-hidden />
          <h3 className="font-display font-semibold text-[var(--color-ink)] text-sm">Current conditions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[var(--color-ink-muted)]">Location</span>
            <p className="font-medium text-[var(--color-ink)]">{weatherData.location}</p>
          </div>
          <div>
            <span className="text-[var(--color-ink-muted)]">Temperature</span>
            <p className="font-medium text-[var(--color-ink)]">{weatherData.temperature}°F</p>
          </div>
          <div>
            <span className="text-[var(--color-ink-muted)]">Humidity</span>
            <p className="font-medium text-[var(--color-ink)]">{weatherData.humidity}%</p>
          </div>
        </div>
      </div>

      {/* Cost summary: one accent (monthly), rest neutral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-muted border border-stone-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-wider">Daily cost</p>
              <p className="font-display text-xl font-bold text-[var(--color-ink)] mt-1">{formatCurrency(results.dailyCost)}</p>
            </div>
            <Calendar className="w-6 h-6 text-[var(--color-ink-muted)]" aria-hidden />
          </div>
        </div>
        <div className="bg-accent rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">Monthly cost</p>
              <p className="font-display text-xl font-bold mt-1">{formatCurrency(results.monthlyCost)}</p>
            </div>
            <Calendar className="w-6 h-6 text-teal-200" aria-hidden />
          </div>
        </div>
        <div className="bg-surface-muted border border-stone-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-ink-muted)] uppercase tracking-wider">Annual cost</p>
              <p className="font-display text-xl font-bold text-[var(--color-ink)] mt-1">{formatCurrency(results.annualCost)}</p>
            </div>
            <Calendar className="w-6 h-6 text-[var(--color-ink-muted)]" aria-hidden />
          </div>
        </div>
      </div>

      {/* Details - neutral, single accent for labels/icons where useful */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-muted border border-stone-200 rounded-lg p-4">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2 text-sm">
            <Zap className="w-5 h-5 text-[var(--color-ink-muted)]" aria-hidden />
            Energy details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Daily usage</span>
              <span className="font-medium text-[var(--color-ink)]">{results.energyUsage.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Monthly usage</span>
              <span className="font-medium text-[var(--color-ink)]">{(results.energyUsage * 30.4).toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Annual usage</span>
              <span className="font-medium text-[var(--color-ink)]">{(results.energyUsage * 365).toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">SEER2 rating</span>
              <span className="font-medium text-accent">{results.efficiencyRating}</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-muted border border-stone-200 rounded-lg p-4">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2 text-sm">
            <Thermometer className="w-5 h-5 text-[var(--color-ink-muted)]" aria-hidden />
            System specs
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">BTU requirement</span>
              <span className="font-medium text-[var(--color-ink)]">{formatNumber(results.btuRequirement)} BTU/hr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Square footage</span>
              <span className="font-medium text-[var(--color-ink)]">{inputs.squareFootage.toLocaleString()} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Insulation</span>
              <span className="font-medium text-[var(--color-ink)] capitalize">{inputs.insulationQuality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-muted)]">Operating hours</span>
              <span className="font-medium text-[var(--color-ink)]">{inputs.operatingHours} hrs/day</span>
            </div>
          </div>
        </div>
      </div>

      {inputs.selectedUnit && (
        <div className="mt-6 bg-surface-muted border border-stone-200 rounded-lg p-4">
          <h3 className="font-display font-semibold text-[var(--color-ink)] mb-3 text-sm">Selected AC unit</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-[var(--color-ink-muted)]">Brand</span>
              <p className="font-medium text-[var(--color-ink)]">{inputs.selectedUnit.brand}</p>
            </div>
            <div>
              <span className="text-[var(--color-ink-muted)]">Model</span>
              <p className="font-medium text-[var(--color-ink)]">{inputs.selectedUnit.model}</p>
            </div>
            <div>
              <span className="text-[var(--color-ink-muted)]">SEER2</span>
              <p className="font-medium text-accent">{inputs.selectedUnit.seer2}</p>
            </div>
            <div>
              <span className="text-[var(--color-ink-muted)]">Est. price</span>
              <p className="font-medium text-[var(--color-ink)]">{formatCurrency(inputs.selectedUnit.estimatedPrice)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostDisplay;
