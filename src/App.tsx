import { useKycStatus, useProperties } from './api/queries'

// Temporary placeholder to verify the API layer and mocks.
// Replaced by PropertyListingPage in Step 5.
function App() {
  const properties = useProperties()
  const kyc = useKycStatus()

  return (
    <main className="container py-5">
      <h1 className="h3">CubeSquare — API check</h1>
      <p>
        Properties: {properties.status}
        {properties.data && ` (${properties.data.length} loaded)`}
        {properties.error && ` — ${properties.error.message}`}
      </p>
      <p>
        KYC: {kyc.status}
        {kyc.data && ` (${kyc.data})`}
      </p>
    </main>
  )
}

export default App
