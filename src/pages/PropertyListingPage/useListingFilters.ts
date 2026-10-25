import { useCallback, useState } from 'react';
import type { PropertyFilterValues } from '../../components/PropertyFilters/filterProperties';

const PARAM_MIN_YIELD = 'minYield';
const PARAM_LOCATION = 'location';

function readFiltersFromUrl(): PropertyFilterValues {
  const params = new URLSearchParams(window.location.search);
  return {
    minYield: params.get(PARAM_MIN_YIELD) ?? '',
    location: params.get(PARAM_LOCATION) ?? '',
  };
}

function setOrDeleteParam(params: URLSearchParams, name: string, value: string): void {
  if (value === '') params.delete(name);
  else params.set(name, value);
}

/**
 * Filter state mirrored to the URL (?minYield=&location=), so a filtered view
 * survives a refresh and can be shared. Other query params are preserved.
 * replaceState (not pushState) avoids one history entry per keystroke.
 */
export function useListingFilters() {
  const [filters, setFiltersState] = useState<PropertyFilterValues>(readFiltersFromUrl);

  const setFilters = useCallback((next: PropertyFilterValues) => {
    setFiltersState(next);

    const url = new URL(window.location.href);
    setOrDeleteParam(url.searchParams, PARAM_MIN_YIELD, next.minYield);
    setOrDeleteParam(url.searchParams, PARAM_LOCATION, next.location);
    window.history.replaceState(window.history.state, '', url);
  }, []);

  return [filters, setFilters] as const;
}
