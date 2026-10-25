import type { Property } from '../api/types';

// Mock data exactly as provided in the assessment brief.
export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Marina Tower Unit 4B',
    location: 'Dubai Marina',
    pricePerToken: 500,
    totalSupply: 1000,
    availableTokens: 180,
    yieldPercent: 7.2,
  },
  {
    id: '2',
    name: 'Downtown Loft 12A',
    location: 'Downtown Dubai',
    pricePerToken: 750,
    totalSupply: 500,
    availableTokens: 498,
    yieldPercent: 6.1,
  },
  {
    id: '3',
    name: 'JVC Studio Block C',
    location: 'Jumeirah Village Circle',
    pricePerToken: 250,
    totalSupply: 2000,
    availableTokens: 12,
    yieldPercent: 8.4,
  },
];
