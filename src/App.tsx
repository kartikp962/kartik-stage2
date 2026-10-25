import { useProperties } from './api/queries'
import { PropertyCard } from './components/PropertyCard/PropertyCard'

// Temporary placeholder to preview PropertyCard with the mock data.
// Replaced by PropertyListingPage in Step 5.
function App() {
  const properties = useProperties()

  return (
    <main className="container py-5">
      <h1 className="h3 mb-4">CubeSquare — PropertyCard preview</h1>
      <div className="row g-4">
        {properties.data?.map((property) => (
          <div key={property.id} className="col-12 col-md-6 col-lg-4">
            <PropertyCard property={property} currency="AED" />
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
