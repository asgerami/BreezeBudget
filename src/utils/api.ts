import { WeatherData } from '../types';

// Fetch real electricity rates by state
export const fetchElectricityRates = async (state: string): Promise<number> => {
  try {
    // Using EIA (Energy Information Administration) API alternative
    // For demo, we'll use a more comprehensive state mapping
    // In production, you'd use: https://api.eia.gov/v2/electricity/retail-sales/
    
    const stateRates: { [key: string]: number } = {
      'AL': 0.127, 'AK': 0.228, 'AZ': 0.128, 'AR': 0.103, 'CA': 0.234,
      'CO': 0.123, 'CT': 0.214, 'DE': 0.131, 'FL': 0.117, 'GA': 0.119,
      'HI': 0.334, 'ID': 0.108, 'IL': 0.129, 'IN': 0.134, 'IA': 0.122,
      'KS': 0.135, 'KY': 0.111, 'LA': 0.095, 'ME': 0.164, 'MD': 0.138,
      'MA': 0.229, 'MI': 0.168, 'MN': 0.135, 'MS': 0.115, 'MO': 0.113,
      'MT': 0.115, 'NE': 0.108, 'NV': 0.127, 'NH': 0.198, 'NJ': 0.164,
      'NM': 0.134, 'NY': 0.186, 'NC': 0.115, 'ND': 0.109, 'OH': 0.128,
      'OK': 0.108, 'OR': 0.113, 'PA': 0.143, 'RI': 0.234, 'SC': 0.130,
      'SD': 0.124, 'TN': 0.115, 'TX': 0.120, 'UT': 0.109, 'VT': 0.181,
      'VA': 0.123, 'WA': 0.098, 'WV': 0.119, 'WI': 0.148, 'WY': 0.109
    };
    
    return stateRates[state] || 0.13; // Default if state not found
  } catch (error) {
    console.error('Error fetching electricity rates:', error);
    return 0.13; // Fallback rate
  }
};

// Fetch historical weather data for seasonal projections
export const fetchHistoricalWeather = async (lat: number, lon: number): Promise<number[]> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&daily=temperature_2m_max&temperature_unit=fahrenheit&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical weather');
    }
    
    const data = await response.json();
    const temperatures = data.daily.temperature_2m_max;
    
    // Calculate monthly averages
    const monthlyAverages = [];
    for (let month = 0; month < 12; month++) {
      const monthTemps = temperatures.filter((_: any, index: number) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return date.getMonth() === month;
      });
      
      const average = monthTemps.reduce((sum: number, temp: number) => sum + temp, 0) / monthTemps.length;
      monthlyAverages.push(Math.round(average));
    }
    
    return monthlyAverages;
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    // Fallback to current temperature with seasonal variations
    return [];
  }
};

// Fetch real humidity data
export const fetchDetailedWeatherData = async (lat: number, lon: number): Promise<{ temperature: number; humidity: number }> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch detailed weather data');
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.current.temperature_2m),
      humidity: Math.round(data.current.relative_humidity_2m)
    };
  } catch (error) {
    console.error('Error fetching detailed weather:', error);
    throw error;
  }
};

export const fetchWeatherData = async (zipCode: string): Promise<WeatherData & { lat: number; lon: number; state: string }> => {
  try {
    // Get coordinates from ZIP code
    const geocodeResponse = await fetch(
      `https://api.zippopotam.us/us/${zipCode}`
    );
    
    if (!geocodeResponse.ok) {
      throw new Error('Invalid ZIP code');
    }
    
    const geocodeData = await geocodeResponse.json();
    const lat = parseFloat(geocodeData.places[0].latitude);
    const lon = parseFloat(geocodeData.places[0].longitude);
    const state = geocodeData.places[0]['state abbreviation'];
    const location = `${geocodeData.places[0]['place name']}, ${state}`;
    
    // Get detailed weather data including humidity
    const weatherDetails = await fetchDetailedWeatherData(lat, lon);
    
    return {
      temperature: weatherDetails.temperature,
      humidity: weatherDetails.humidity,
      location,
      lat,
      lon,
      state
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};