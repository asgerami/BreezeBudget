import { ACUnit } from '../types';

// AC unit data - prices are estimates from 2024
// TODO: update prices and add more units
export const acUnits: ACUnit[] = [
  // Carrier
  { id: 'carrier-1', brand: 'Carrier', model: 'Comfort 13', seer2: 13, btu: 24000, estimatedPrice: 3200 },
  { id: 'carrier-2', brand: 'Carrier', model: 'Performance 16', seer2: 16, btu: 24000, estimatedPrice: 4100 },
  { id: 'carrier-3', brand: 'Carrier', model: 'Infinity 20', seer2: 20, btu: 24000, estimatedPrice: 5800 },
  
  // Trane
  { id: 'trane-1', brand: 'Trane', model: 'XR13', seer2: 13, btu: 24000, estimatedPrice: 3100 },
  { id: 'trane-2', brand: 'Trane', model: 'XR16', seer2: 16, btu: 24000, estimatedPrice: 4200 },
  { id: 'trane-3', brand: 'Trane', model: 'XV20i', seer2: 21, btu: 24000, estimatedPrice: 6200 },
  
  // Lennox
  { id: 'lennox-1', brand: 'Lennox', model: 'Merit 13ACX', seer2: 13, btu: 24000, estimatedPrice: 3000 },
  { id: 'lennox-2', brand: 'Lennox', model: 'Elite 16ACX', seer2: 16, btu: 24000, estimatedPrice: 4000 },
  { id: 'lennox-3', brand: 'Lennox', model: 'Signature XC25', seer2: 20, btu: 24000, estimatedPrice: 5900 },
  
  // Goodman
  { id: 'goodman-1', brand: 'Goodman', model: 'GSX13', seer2: 13, btu: 24000, estimatedPrice: 2800 },
  { id: 'goodman-2', brand: 'Goodman', model: 'GSX16', seer2: 16, btu: 24000, estimatedPrice: 3600 },
  { id: 'goodman-3', brand: 'Goodman', model: 'GSXC18', seer2: 18, btu: 24000, estimatedPrice: 4800 },
  
  // Rheem
  { id: 'rheem-1', brand: 'Rheem', model: 'Classic 13PJL', seer2: 13, btu: 24000, estimatedPrice: 2900 },
  { id: 'rheem-2', brand: 'Rheem', model: 'Prestige 16PJL', seer2: 16, btu: 24000, estimatedPrice: 3800 },
  { id: 'rheem-3', brand: 'Rheem', model: 'Prestige 20PJL', seer2: 20, btu: 24000, estimatedPrice: 5600 },
  
  // American Standard
  { id: 'american-1', brand: 'American Standard', model: 'Silver 13', seer2: 13, btu: 24000, estimatedPrice: 3150 },
  { id: 'american-2', brand: 'American Standard', model: 'Gold 16', seer2: 16, btu: 24000, estimatedPrice: 4050 },
  { id: 'american-3', brand: 'American Standard', model: 'Platinum 20', seer2: 20, btu: 24000, estimatedPrice: 5750 },
];
