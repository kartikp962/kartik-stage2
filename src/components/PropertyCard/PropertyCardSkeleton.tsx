// Loading placeholder with the same shape as PropertyCard, so the layout
// doesn't jump when data arrives. Hidden from screen readers; the page
// announces loading with a single visually hidden status message instead.
export function PropertyCardSkeleton() {
  return (
    <div className="card h-100" aria-hidden="true">
      <div className="card-body d-flex flex-column placeholder-glow">
        <span className="placeholder col-8 mb-2" />
        <span className="placeholder placeholder-sm col-5 mb-4" />
        <span className="placeholder placeholder-sm col-12 mb-2" />
        <span className="placeholder placeholder-sm col-12 mb-2" />
        <span className="placeholder placeholder-sm col-12 mb-4" />
        <span className="placeholder col-12 mb-4" />
        <span className="btn btn-primary disabled placeholder col-12 mt-auto" />
      </div>
    </div>
  );
}
