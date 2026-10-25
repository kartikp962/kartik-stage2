// Domain types shared by the API layer, mocks and components.

export interface Property {
  id: string;
  name: string;
  location: string;
  pricePerToken: number;
  totalSupply: number;
  availableTokens: number;
  yieldPercent: number;
}

// ISO 4217 codes for the markets we serve. Adding a market means adding it
// here, and TypeScript then checks every place a currency is passed.
export const SUPPORTED_CURRENCIES = ['AED', 'USD'] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

// Single list of valid statuses: the union type and the runtime check
// are both derived from it, so they can never disagree.
export const KYC_STATUSES = ['pending', 'rejected', 'approved'] as const;

export type KycStatus = (typeof KYC_STATUSES)[number];

export function isKycStatus(value: unknown): value is KycStatus {
  return KYC_STATUSES.some((status) => status === value);
}
