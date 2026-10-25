export interface PropertyDetailPlaceholderProps {
  propertyId: string;
}

// The detail page is out of scope for this task. This keeps the
// "View Property" links meaningful without adding a router dependency.
export function PropertyDetailPlaceholder({ propertyId }: PropertyDetailPlaceholderProps) {
  return (
    <main className="container py-5">
      <h1 className="h3 mb-3">Property {propertyId}</h1>
      <div className="alert alert-info" role="status">
        The property detail page is out of scope for this assessment.
      </div>
      <a href="/" className="btn btn-outline-primary">
        Back to properties
      </a>
    </main>
  );
}
