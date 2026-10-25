import { delay, http, HttpResponse } from 'msw';
import { isKycStatus, type KycStatus } from '../api/types';
import { mockProperties } from './data';

// Simulated network latency, so the loading state is visible during review.
const MOCK_LATENCY_MS = 800;

const DEFAULT_KYC_STATUS: KycStatus = 'pending';

// Reviewer toggles are read from the PAGE URL (not the API request), so every
// UI state can be demonstrated without code changes:
//   ?scenario=error   -> GET /properties returns 500
//   ?scenario=empty   -> GET /properties returns []
//   ?kyc=pending|rejected|approved -> GET /investor/kyc status
// This is a mock-only concern; real endpoints obviously don't read the page URL.
function pageParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export const handlers = [
  http.get('/properties', async () => {
    await delay(MOCK_LATENCY_MS);

    const scenario = pageParam('scenario');
    if (scenario === 'error') {
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    if (scenario === 'empty') {
      return HttpResponse.json([]);
    }
    return HttpResponse.json(mockProperties);
  }),

  http.get('/investor/kyc', async () => {
    await delay(MOCK_LATENCY_MS);

    const requested = pageParam('kyc');
    const status = isKycStatus(requested) ? requested : DEFAULT_KYC_STATUS;
    return HttpResponse.json({ status });
  }),
];
