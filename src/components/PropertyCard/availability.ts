// Availability rules, kept as pure functions so they're easy to unit test
// and the card component only decides how to *display* the result.

/** Below this share of total supply, a property is flagged as low availability. */
export const LOW_AVAILABILITY_THRESHOLD = 0.2;

export type AvailabilityLevel = 'sold-out' | 'low' | 'available';

/** Share of total supply still available, from 0 to 1. */
export function getAvailableRatio(availableTokens: number, totalSupply: number): number {
  if (totalSupply <= 0) return 0;
  return Math.min(Math.max(availableTokens / totalSupply, 0), 1);
}

export function getAvailabilityLevel(availableTokens: number, totalSupply: number): AvailabilityLevel {
  if (availableTokens <= 0) return 'sold-out';
  if (getAvailableRatio(availableTokens, totalSupply) < LOW_AVAILABILITY_THRESHOLD) return 'low';
  return 'available';
}
