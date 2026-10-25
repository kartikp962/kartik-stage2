import type { CurrencyCode, Property } from '../../api/types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/format';
import { getAvailabilityLevel, getAvailableRatio, type AvailabilityLevel } from './availability';

export interface PropertyCardProps {
  property: Property;
  /** Currency that pricePerToken is denominated in (ISO 4217). */
  currency: CurrencyCode;
}

// Display rules per availability level. Colours come from Bootstrap's
// contextual classes, so they follow the theme rather than hardcoded values.
const AVAILABILITY_DISPLAY: Record<
  AvailabilityLevel,
  { badge: { label: string; className: string } | null; progressBarClassName: string }
> = {
  'sold-out': {
    badge: { label: 'Sold out', className: 'text-bg-secondary' },
    progressBarClassName: 'bg-secondary',
  },
  low: {
    badge: { label: 'Low availability', className: 'text-bg-warning' },
    progressBarClassName: 'bg-warning',
  },
  available: {
    badge: null,
    progressBarClassName: 'bg-primary',
  },
};

export function PropertyCard({ property, currency }: PropertyCardProps) {
  const { id, name, location, pricePerToken, totalSupply, availableTokens, yieldPercent } = property;

  const availableRatio = getAvailableRatio(availableTokens, totalSupply);
  const display = AVAILABILITY_DISPLAY[getAvailabilityLevel(availableTokens, totalSupply)];
  const availablePercent = Math.round(availableRatio * 100);

  return (
    <article className="card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h2 className="card-title h5 mb-1">{name}</h2>
          {display.badge && (
            <span className={`badge ${display.badge.className}`}>{display.badge.label}</span>
          )}
        </div>
        <p className="card-subtitle text-body-secondary mb-3">{location}</p>

        <dl className="row small mb-3">
          <dt className="col-7 fw-normal text-body-secondary">Price per token</dt>
          <dd className="col-5 text-end fw-semibold mb-1">{formatCurrency(pricePerToken, currency)}</dd>

          <dt className="col-7 fw-normal text-body-secondary">Total supply</dt>
          <dd className="col-5 text-end fw-semibold mb-1">{formatNumber(totalSupply)} tokens</dd>

          <dt className="col-7 fw-normal text-body-secondary">Yield</dt>
          <dd className="col-5 text-end fw-semibold mb-0">{formatPercent(yieldPercent / 100)}</dd>
        </dl>

        <div className="mb-3">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-body-secondary">Available</span>
            <span className="fw-semibold">
              {formatNumber(availableTokens)} / {formatNumber(totalSupply)}
            </span>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-label={`${name}: tokens available`}
            aria-valuenow={availablePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Width is data-driven (not a design token), so an inline style is appropriate here. */}
            <div
              className={`progress-bar ${display.progressBarClassName}`}
              style={{ width: `${availablePercent}%` }}
            />
          </div>
        </div>

        <a
          href={`/properties/${encodeURIComponent(id)}`}
          className="btn btn-primary mt-auto"
          aria-label={`View property: ${name}`}
        >
          View Property
        </a>
      </div>
    </article>
  );
}
