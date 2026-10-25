import type { CurrencyCode } from '../api/types';

const DEFAULT_LOCALE = 'en';

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatNumber(value: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(fraction: number, locale: string = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(
    fraction,
  );
}
