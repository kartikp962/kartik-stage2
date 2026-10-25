import { PropertyDetailPlaceholder } from './pages/PropertyDetailPlaceholder'
import { PropertyListingPage } from './pages/PropertyListingPage/PropertyListingPage'

const PROPERTY_DETAIL_PATH = /^\/properties\/([^/]+)\/?$/

// Minimal path matching instead of a router: there is only one real page.
// A router (e.g. React Router / TanStack Router) would replace this once
// the detail page exists.
function getPropertyIdFromPath(pathname: string): string | null {
  const match = PROPERTY_DETAIL_PATH.exec(pathname)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null // malformed %-encoding; fall back to the listing
  }
}

function App() {
  const propertyId = getPropertyIdFromPath(window.location.pathname)

  if (propertyId !== null) {
    return <PropertyDetailPlaceholder propertyId={propertyId} />
  }
  return <PropertyListingPage />
}

export default App
