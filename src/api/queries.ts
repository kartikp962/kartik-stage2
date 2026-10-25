import { useQuery } from '@tanstack/react-query';
import { apiGet } from './client';
import { parseKycStatus, parseProperties } from './parsers';

// One place for query keys, so fetching and invalidation can't drift apart.
export const queryKeys = {
  properties: ['properties'] as const,
  kycStatus: ['investor', 'kyc'] as const,
};

/**
 * All listed properties. Filtering happens on the client (see README),
 * so filter values are deliberately NOT part of this query key.
 */
export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: ({ signal }) => apiGet('/properties', parseProperties, signal),
    staleTime: 5 * 60_000,
  });
}

/**
 * The signed-in investor's KYC status. Kept fresher than listings because
 * it can change while the user is browsing (e.g. verification completes).
 */
export function useKycStatus() {
  return useQuery({
    queryKey: queryKeys.kycStatus,
    queryFn: ({ signal }) => apiGet('/investor/kyc', parseKycStatus, signal),
    staleTime: 60_000,
  });
}
