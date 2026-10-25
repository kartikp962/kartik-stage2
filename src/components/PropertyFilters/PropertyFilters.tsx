import { useId } from 'react';
import { hasFilterInput, parseMinYield, type PropertyFilterValues } from './filterProperties';

export interface PropertyFiltersProps {
  values: PropertyFilterValues;
  /** Location options, derived from the loaded data by the parent. */
  locations: readonly string[];
  onChange: (values: PropertyFilterValues) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function PropertyFilters({
  values,
  locations,
  onChange,
  onClear,
  disabled = false,
}: PropertyFiltersProps) {
  const minYieldId = useId();
  const minYieldErrorId = useId();
  const locationId = useId();

  const isMinYieldInvalid = values.minYield.trim() !== '' && parseMinYield(values.minYield) === null;

  return (
    <form
      className="card card-body mb-4"
      role="search"
      aria-label="Filter properties"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label htmlFor={minYieldId} className="form-label">
            Minimum yield (%)
          </label>
          <input
            id={minYieldId}
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            placeholder="Any"
            className={`form-control${isMinYieldInvalid ? ' is-invalid' : ''}`}
            value={values.minYield}
            onChange={(event) => onChange({ ...values, minYield: event.target.value })}
            disabled={disabled}
            aria-invalid={isMinYieldInvalid}
            aria-describedby={isMinYieldInvalid ? minYieldErrorId : undefined}
          />
          {isMinYieldInvalid && (
            <div id={minYieldErrorId} className="invalid-feedback">
              Enter a yield of 0 or more.
            </div>
          )}
        </div>

        <div className="col-12 col-md-5">
          <label htmlFor={locationId} className="form-label">
            Location
          </label>
          <select
            id={locationId}
            className="form-select"
            value={values.location}
            onChange={(event) => onChange({ ...values, location: event.target.value })}
            disabled={disabled}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={onClear}
            disabled={disabled || !hasFilterInput(values)}
          >
            Clear filters
          </button>
        </div>
      </div>
    </form>
  );
}
