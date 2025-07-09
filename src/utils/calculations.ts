import { CalculationInputs, CostCalculation, WeatherData } from '../types';
import { fetchElectricityRates, fetchHistoricalWeather } from './api';

// More accurate BTU calculation based on industry standards
export const calculateBTURequirement = (
  squareFootage: number,
  insulationQuality: string,
  outdoorTemp: number,
  indoorTemp: number,
  humidity: number
): number => {
  // Base BTU calculation using more accurate formula
  // Accounts for ceiling height (assumed 8-9 ft), windows, and other factors
  let baseBTU = squareFootage * 25; // More accurate base rate
  
  // Dynamic insulation factors based on temperature differential
  const tempDiff = Math.abs(outdoorTemp - indoorTemp);
  const insulationFactors: { [key: string]: number } = {
    poor: 1.3 + (tempDiff > 20 ? 0.2 : 0),
    average: 1.1 + (tempDiff > 20 ? 0.1 : 0),
    good: 1.0,
    excellent: 0.85 - (tempDiff > 25 ? 0.05 : 0)
  };
  
  baseBTU *= insulationFactors[insulationQuality] || 1.1;
  
  // Humidity factor (higher humidity requires more cooling)
  const humidityFactor = 1 + ((humidity - 50) * 0.003);
  baseBTU *= Math.max(0.9, Math.min(1.2, humidityFactor));
  
  // Temperature differential factor
  const tempFactor = 1 + (tempDiff - 20) * 0.04;
  baseBTU *= Math.max(0.8, tempFactor);
  
  // Add 10% for safety margin
  baseBTU *= 1.1;
  
  return Math.max(baseBTU, 12000); // Minimum 12,000 BTU
};

export const calculateEnergyUsage = (
  btuRequirement: number,
  seer2Rating: number,
  operatingHours: number,
  outdoorTemp: number,
  indoorTemp: number
): number => {
  // More accurate SEER2 calculation accounting for part-load conditions
  const tempDiff = Math.abs(outdoorTemp - indoorTemp);
  
  // SEER2 efficiency decreases with extreme temperature differences
  let effectiveSEER = seer2Rating;
  if (tempDiff > 25) {
    effectiveSEER *= 0.9; // 10% efficiency loss in extreme conditions
  } else if (tempDiff > 20) {
    effectiveSEER *= 0.95; // 5% efficiency loss
  }
  
  // Convert BTU to watts using effective SEER2 rating
  const watts = btuRequirement / effectiveSEER;
  
  // Convert to kWh
  const kwhPerHour = watts / 1000;
  
  return kwhPerHour * operatingHours;
};

export const calculateCosts = async (
  inputs: CalculationInputs,
  weatherData: WeatherData & { state?: string }
): Promise<CostCalculation['results']> => {
  // Use seasonal projections for accurate annual calculations
  const projections = await generateCostProjections(inputs, weatherData);
  
  // Calculate annual totals from seasonal data
  const annualCost = projections.reduce((sum, p) => sum + p.cost, 0);
  const annualUsage = projections.reduce((sum, p) => sum + p.usage, 0);
  
  // Calculate averages for daily and monthly display
  const dailyCost = annualCost / 365;
  const monthlyCost = annualCost / 12;
  const dailyEnergyUsage = annualUsage / 365;
  
  // Calculate BTU requirement using current conditions for display
  const btuRequirement = calculateBTURequirement(
    inputs.squareFootage,
    inputs.insulationQuality,
    weatherData.temperature,
    inputs.thermostatTemp,
    weatherData.humidity
  );
  
  return {
    dailyCost,
    monthlyCost,
    annualCost,
    energyUsage: dailyEnergyUsage,
    btuRequirement,
    efficiencyRating: inputs.seer2Rating,
  };
};

export const generateCostProjections = async (
  inputs: CalculationInputs,
  weatherData: WeatherData & { lat?: number; lon?: number; state?: string }
): Promise<Array<{ month: string; cost: number; usage: number }>> => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  let monthlyTemperatures: number[] = [];
  
  // Try to fetch historical weather data
  if (weatherData.lat && weatherData.lon) {
    try {
      monthlyTemperatures = await fetchHistoricalWeather(weatherData.lat, weatherData.lon);
    } catch (error) {
      console.error('Failed to fetch historical data, using fallback:', error);
    }
  }
  
  // Fallback to estimated seasonal variations if historical data unavailable
  if (monthlyTemperatures.length === 0) {
    const currentTemp = weatherData.temperature;
    const seasonalFactors = [
      -20, -15, -5, 5, 10, 15, 20, 18, 12, 2, -10, -18
    ];
    
    monthlyTemperatures = seasonalFactors.map(factor => {
      const seasonalTemp = currentTemp + factor;
      return Math.max(40, Math.min(110, seasonalTemp));
    });
  }
  
  // Get electricity rate
  const electricityRate = weatherData.state ? 
    await fetchElectricityRates(weatherData.state) : 0.13;
  
  const projections = await Promise.all(months.map(async (month, index) => {
    const seasonalTemp = monthlyTemperatures[index];
    const tempWeatherData = { 
      ...weatherData, 
      temperature: seasonalTemp 
    };
    
    const btuRequirement = calculateBTURequirement(
      inputs.squareFootage,
      inputs.insulationQuality,
      seasonalTemp,
      inputs.thermostatTemp,
      weatherData.humidity
    );
    
    const dailyEnergyUsage = calculateEnergyUsage(
      btuRequirement,
      inputs.seer2Rating,
      inputs.operatingHours,
      seasonalTemp,
      inputs.thermostatTemp
    );
    
    const monthlyCost = dailyEnergyUsage * electricityRate * 30;
    const monthlyUsage = dailyEnergyUsage * 30;
    
    return {
      month,
      cost: monthlyCost,
      usage: monthlyUsage,
    };
  }));
  
  return projections;
};

export const saveCostCalculation = (calculation: CostCalculation): void => {
  const saved = localStorage.getItem('ac-calculations');
  const calculations = saved ? JSON.parse(saved) : [];
  calculations.push(calculation);
  
  // Keep only last 10 calculations
  if (calculations.length > 10) {
    calculations.shift();
  }
  
  localStorage.setItem('ac-calculations', JSON.stringify(calculations));
};

export const getSavedCalculations = (): CostCalculation[] => {
  const saved = localStorage.getItem('ac-calculations');
  return saved ? JSON.parse(saved) : [];
};