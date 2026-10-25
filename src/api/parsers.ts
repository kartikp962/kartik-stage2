// Runtime validation for API responses. TypeScript types disappear at runtime,
// so these guards are what actually protect the UI from a malformed payload.

import { InvalidResponseError } from './client';
import { isKycStatus, type KycStatus, type Property } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseProperty(value: unknown, index: number): Property {
  if (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.location === 'string' &&
    isFiniteNumber(value.pricePerToken) &&
    isFiniteNumber(value.totalSupply) &&
    isFiniteNumber(value.availableTokens) &&
    isFiniteNumber(value.yieldPercent)
  ) {
    return {
      id: value.id,
      name: value.name,
      location: value.location,
      pricePerToken: value.pricePerToken,
      totalSupply: value.totalSupply,
      availableTokens: value.availableTokens,
      yieldPercent: value.yieldPercent,
    };
  }
  throw new InvalidResponseError(`Invalid property at index ${index}`);
}

export function parseProperties(data: unknown): Property[] {
  if (!Array.isArray(data)) {
    throw new InvalidResponseError('Expected an array of properties');
  }
  return data.map((item, index) => parseProperty(item, index));
}

export function parseKycStatus(data: unknown): KycStatus {
  if (isRecord(data) && isKycStatus(data.status)) {
    return data.status;
  }
  throw new InvalidResponseError('Invalid KYC status response');
}
