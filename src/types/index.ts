// types for the app
export interface ACUnit {
  id: string;
  brand: string;
  model: string;
  seer2: number;
  btu: number;
  estimatedPrice: number;
}

export interface CalculationInputs {
  zipCode: string;
  squareFootage: number;
  thermostatTemp: number;
  seer2Rating: number;
  insulationQuality: "poor" | "average" | "good" | "excellent";
  selectedUnit: ACUnit | null;
  operatingHours: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  location: string;
  lat?: number;
  lon?: number;
  state?: string;
}

export interface CostCalculation {
  id: string;
  timestamp: number;
  inputs: CalculationInputs;
  results: {
    dailyCost: number;
    monthlyCost: number;
    annualCost: number;
    energyUsage: number;
    btuRequirement: number;
    efficiencyRating: number;
  };
  weatherData: WeatherData;
}

export interface InsulationFactor {
  poor: number;
  average: number;
  good: number;
  excellent: number;
}
