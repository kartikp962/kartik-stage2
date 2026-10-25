import { useMemo, type ReactNode } from 'react';
import { useKycStatus, useProperties } from '../../api/queries';
import type { CurrencyCode } from '../../api/types';
import { KYCStatusBanner } from '../../components/KYCStatusBanner/KYCStatusBanner';
import { PropertyCard } from '../../components/PropertyCard/PropertyCard';
import { PropertyCardSkeleton } from '../../components/PropertyCard/PropertyCardSkeleton';
import { PropertyFilters } from '../../components/PropertyFilters/PropertyFilters';
import {
  EMPTY_FILTERS,
  filterProperties,
  getLocationOptions,
  type PropertyFilterValues,
} from '../../components/PropertyFilters/filterProperties';
import { useListingFilters } from './useListingFilters';

// Single place the listing currency is decided. In production this would
// come from operator or property configuration rather than a constant.
const LISTING_CURRENCY: CurrencyCode = 'AED';

// 1 column on mobile, 2 on tablet (md), 3 on desktop (lg).
const GRID_COLUMN_CLASS = 'col-12 col-md-6 col-lg-4';
const SKELETON_CARD_COUNT = 3;

export function PropertyListingPage() {
  const properties = useProperties();
  const [filters, setFilters] = useListingFilters();

  const locations = useMemo(() => getLocationOptions(properties.data ?? []), [properties.data]);

  // Ignore a location from the URL that doesn't exist in the data
  // (e.g. a stale shared link) instead of showing an unexplained empty list.
  const activeFilters = useMemo<PropertyFilterValues>(
    () => ({
      ...filters,
      location: locations.includes(filters.location) ? filters.location : '',
    }),
    [filters, locations],
  );

  const visibleProperties = useMemo(
    () => filterProperties(properties.data ?? [], activeFilters),
    [properties.data, activeFilters],
  );

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  function renderListing(): ReactNode {
    if (properties.isPending) {
      return (
        <div role="status">
          <span className="visually-hidden">Loading properties…</span>
          <div className="row g-4">
            {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
              <div key={index} className={GRID_COLUMN_CLASS}>
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // No data at all means the request failed. If a background refetch fails
    // after a successful load, we keep showing the data we already have.
    if (!properties.data) {
      return (
        <div
          className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
          role="alert"
        >
          <div>
            <h2 className="alert-heading h6 mb-1">We couldn't load properties</h2>
            <p className="mb-0">Something went wrong while loading the listings. Please try again.</p>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger flex-shrink-0"
            onClick={() => properties.refetch()}
            disabled={properties.isFetching}
          >
            {properties.isFetching ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Retrying…
              </>
            ) : (
              'Retry'
            )}
          </button>
        </div>
      );
    }

    if (properties.data.length === 0) {
      return (
        <ListingMessage
          title="No properties are listed right now"
          message="New investment opportunities are added regularly. Please check back soon."
        />
      );
    }

    if (visibleProperties.length === 0) {
      return (
        <ListingMessage
          title="No properties match your filters"
          message="Try a lower minimum yield or a different location."
          action={
            <button type="button" className="btn btn-outline-primary" onClick={clearFilters}>
              Clear filters
            </button>
          }
        />
      );
    }

    return (
      <ul className="row g-4 list-unstyled mb-0">
        {visibleProperties.map((property) => (
          <li key={property.id} className={GRID_COLUMN_CLASS}>
            <PropertyCard property={property} currency={LISTING_CURRENCY} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="container py-4 py-lg-5">
      <KycStatusSection />

      <header className="mb-4">
        <h1 className="h2 mb-1">Investment properties</h1>
        <p className="text-body-secondary mb-0">
          Browse tokenized real estate and filter by yield or location.
        </p>
      </header>

      <PropertyFilters
        values={activeFilters}
        locations={locations}
        onChange={setFilters}
        onClear={clearFilters}
        disabled={!properties.data}
      />

      {properties.data && properties.data.length > 0 && (
        <p className="text-body-secondary small mb-3" aria-live="polite">
          Showing {visibleProperties.length} of {properties.data.length} properties
        </p>
      )}

      {renderListing()}
    </main>
  );
}

/**
 * KYC banner area. Fails closed: if the status can't be loaded, we say so
 * rather than rendering nothing, which would look the same as "approved".
 */
function KycStatusSection() {
  const kyc = useKycStatus();

  if (kyc.data) return <KYCStatusBanner status={kyc.data} />;

  if (kyc.isError) {
    return (
      <div className="alert alert-warning mb-4" role="status">
        We couldn't confirm your verification status. Investing is unavailable until it's
        confirmed.{' '}
        <button
          type="button"
          className="btn btn-link alert-link p-0 align-baseline"
          onClick={() => kyc.refetch()}
          disabled={kyc.isFetching}
        >
          Try again
        </button>
      </div>
    );
  }

  return null;
}

interface ListingMessageProps {
  title: string;
  message: string;
  action?: ReactNode;
}

function ListingMessage({ title, message, action }: ListingMessageProps) {
  return (
    <div className="text-center border rounded py-5 px-3">
      <h2 className="h5">{title}</h2>
      <p className="text-body-secondary mb-0">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
