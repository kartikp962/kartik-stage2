import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/main.scss'
import App from './App.tsx'
import { queryClient } from './api/queryClient'

// Start the mock API in development only. The dynamic import keeps MSW
// out of the production bundle entirely.
async function enableMocking(): Promise<void> {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

// Render only after mocking is ready, so the first fetch is intercepted.
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
