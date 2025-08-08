import { CalculationInputs } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// zip code validation
export const validateZipCode = (zipCode: string): ValidationError | null => {
  if (!zipCode.trim()) {
    return { field: 'zipCode', message: 'ZIP code is required' };
  }
  
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return { field: 'zipCode', message: 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)' };
  }
  
  return null;
};

// square footage validation
export const validateSquareFootage = (squareFootage: number): ValidationError | null => {
  if (!squareFootage || squareFootage <= 0) {
    return { field: 'squareFootage', message: 'Square footage must be greater than 0' };
  }
  
  if (squareFootage > 10000) {
    return { field: 'squareFootage', message: 'Square footage seems unusually large. Please verify your input.' };
  }
  
  return null;
};

// thermostat temperature validation
export const validateThermostatTemp = (temp: number): ValidationError | null => {
  if (temp < 60 || temp > 90) {
    return { field: 'thermostatTemp', message: 'Thermostat temperature must be between 60°F and 90°F' };
  }
  
  return null;
};

// SEER2 rating validation
export const validateSeer2Rating = (seer2: number): ValidationError | null => {
  if (seer2 < 13 || seer2 > 25) {
    return { field: 'seer2Rating', message: 'SEER2 rating must be between 13 and 25' };
  }
  
  return null;
};

// operating hours validation
export const validateOperatingHours = (hours: number): ValidationError | null => {
  if (hours < 1 || hours > 24) {
    return { field: 'operatingHours', message: 'Operating hours must be between 1 and 24' };
  }
  
  return null;
};

// AC unit validation
export const validateSelectedUnit = (unit: any): ValidationError | null => {
  if (!unit) {
    return { field: 'selectedUnit', message: 'Please select an AC unit' };
  }
  
  if (!unit.id || !unit.brand || !unit.model) {
    return { field: 'selectedUnit', message: 'Invalid AC unit selected' };
  }
  
  return null;
};

// validate all inputs at once
export const validateCalculationInputs = (inputs: CalculationInputs): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // check each field
  const validations = [
    validateZipCode(inputs.zipCode),
    validateSquareFootage(inputs.squareFootage),
    validateThermostatTemp(inputs.thermostatTemp),
    validateSeer2Rating(inputs.seer2Rating),
    validateOperatingHours(inputs.operatingHours),
    validateSelectedUnit(inputs.selectedUnit)
  ];
  
  validations.forEach(validation => {
    if (validation) {
      errors.push(validation);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// get validation for a single field
export const getFieldValidation = (field: keyof CalculationInputs, value: any): ValidationError | null => {
  switch (field) {
    case 'zipCode':
      return validateZipCode(value);
    case 'squareFootage':
      return validateSquareFootage(value);
    case 'thermostatTemp':
      return validateThermostatTemp(value);
    case 'seer2Rating':
      return validateSeer2Rating(value);
    case 'operatingHours':
      return validateOperatingHours(value);
    case 'selectedUnit':
      return validateSelectedUnit(value);
    default:
      return null;
  }
};

// helper functions
export const formatValidationError = (error: ValidationError): string => {
  return error.message;
};

export const hasFieldError = (field: string, errors: ValidationError[]): boolean => {
  return errors.some(error => error.field === field);
};

export const getFieldErrorMessage = (field: string, errors: ValidationError[]): string | null => {
  const error = errors.find(error => error.field === field);
  return error ? error.message : null;
};
