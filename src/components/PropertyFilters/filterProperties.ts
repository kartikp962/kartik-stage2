import type { Property } from '../../api/types';

/**
 * Raw filter values as the user typed/selected them. Kept as strings so the
 * inputs stay fully controlled (e.g. "7." mid-typing) and map 1:1 to URL params.
 * An empty string means "no filter".
 */
export interface PropertyFilterValues {
  minYield: string;
  location: string;
}

export const EMPTY_FILTERS: PropertyFilterValues = { minYield: '', location: '' };

/** Returns the minimum yield as a number, or null if empty or invalid. */
export function parseMinYield(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function hasFilterInput(filters: PropertyFilterValues): boolean {
  return filters.minYield.trim() !== '' || filters.location !== '';
}

/** Unique locations, sorted, for the location select. */
export function getLocationOptions(properties: readonly Property[]): string[] {
  return [...new Set(properties.map((property) => property.location))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterProperties(
  properties: readonly Property[],
  filters: PropertyFilterValues,
): Property[] {
  const minYield = parseMinYield(filters.minYield);

  return properties.filter(
    (property) =>
      (minYield === null || property.yieldPercent >= minYield) &&
      (filters.location === '' || property.location === filters.location),
  );
}
