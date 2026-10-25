# Tokenized Property Listing

A property listing experience for a tokenized real-estate investment platform: browse properties, filter by yield and location, and see the investor's KYC status.

**Stack:** React 19 · Vite 8 · TypeScript (strict) · Bootstrap 5.3 compiled from Sass · TanStack Query v5 · MSW (mock API)

## Quick start

Requires Node `^20.19.0` or `>=22.12.0`.

```bash
npm install && npm run dev
```

Open http://localhost:5173. The mock API starts automatically in development, so no backend is needed.

## Reviewer toggles

Every UI state can be seen without changing code, using URL parameters:

| URL | What you'll see |
|---|---|
| `/` | Listing with the amber KYC "pending" banner (the default) |
| `/?kyc=rejected` | Red KYC banner |
| `/?kyc=approved` | No banner |
| `/?kyc=error` | KYC status can't be loaded, so investing is shown as unavailable (fails closed) |
| `/?scenario=empty` | API returns no properties |
| `/?scenario=error` | API returns 500 → error state with Retry (after 2 automatic retries, about 3s) |
| `/?minYield=7&location=Dubai%20Marina` | Filters applied from the URL |

Parameters can be combined, e.g. `/?kyc=rejected&minYield=8`. The mock API adds 800ms of latency so the loading state is visible.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server with the mock API |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | oxlint (TS/React) + Stylelint (theme governance) |
| `npm run lint:styles` | Stylelint only |
| `npm run preview` | Serve the production build (no mock API, see Limitations) |

## Project structure

```
src/
  styles/
    _theme.scss            Designer-owned Bootstrap variable overrides (single source of truth)
    main.scss              Theme first, then Bootstrap
  api/
    types.ts               Property, KycStatus, CurrencyCode
    client.ts              Typed fetch wrapper, ApiError, InvalidResponseError
    parsers.ts             Runtime validation of API responses (no `as` casts)
    queries.ts             Query keys, useProperties, useKycStatus
    queryClient.ts         Retry policy (network/5xx only)
  mocks/                   MSW handlers + the brief's mock data (dev only)
  utils/format.ts          Intl-based currency/number/percent formatting
  components/
    PropertyCard/          Card, skeleton, availability rules (20% threshold)
    PropertyFilters/       Filter form + pure filtering functions
    KYCStatusBanner/       Status → Bootstrap contextual alert
  pages/
    PropertyListingPage/   Page + URL-synced filter state
    PropertyDetailPlaceholder.tsx
```

## How the brief maps to the code

- **PropertyCard:** typed props (`property`, `currency`). The low-availability indicator is derived from data: `availableTokens / totalSupply < 0.2` (`LOW_AVAILABILITY_THRESHOLD`). With the mock data this flags Marina (18%) and JVC (0.6%), but not Downtown (99.6%).
- **PropertyListingPage:** `GET /properties` via TanStack Query. Bootstrap grid `col-12 col-md-6 col-lg-4` (1 / 2 / 3 columns). Filters for minimum yield (inclusive) and location. Explicit loading (skeleton cards), error (message + Retry), empty (no listings) and filtered-empty (no matches + Clear filters) states.
- **KYCStatusBanner:** `pending` → `alert-warning`, `rejected` → `alert-danger`, `approved` → nothing. No colour values in the component.
- **Theme:** `$primary`, `$border-radius` (+ sm/lg) and `$font-family-sans-serif` are overridden in `_theme.scss`. `npm run lint` (Stylelint) fails on any SCSS outside the theme that hardcodes colours, radius, fonts or spacing. See [CSS-GOVERNANCE.md](CSS-GOVERNANCE.md).

## Key decisions

- **Client-side filtering.** Three properties don't justify server-side filtering. Filters are kept out of the query key, so changing a filter never refetches. With a large catalogue I'd move filters into the query key and API parameters, with pagination.
- **Filters live in the URL** (`replaceState`, so typing doesn't flood browser history). A filtered view survives refresh and can be shared. Other parameters are preserved.
- **API responses are validated at runtime** (`parsers.ts`) instead of cast, so a malformed payload fails at the boundary with a clear error.
- **Retries only where they can help:** network errors and 5xx, at most twice. 4xx and malformed responses fail immediately.
- **A failed background refetch keeps existing data on screen.** The page checks for missing data, not `isError`, because TanStack Query v5 keeps the last good data when a refetch fails.
- **KYC fails closed.** If the status can't be loaded, the page says investing is unavailable instead of showing nothing, which would look like "approved".
- **Currency is a typed prop** (`'AED' | 'USD'`), set once on the page (`LISTING_CURRENCY`). In production it would come from operator or property configuration.
- **"View Property" links to `/properties/:id`**, which shows an "out of scope" placeholder. Simple path matching is used instead of adding a router for one route.
- **MSW starts only in development** and is loaded with a dynamic import, so it isn't in the production bundle.
- **Bootstrap Sass deprecation warnings** (Bootstrap 5.3 still uses `@import`) are silenced for dependencies only (`quietDeps`), so warnings from our own SCSS still show. See `vite.config.ts`.

## Limitations and next steps

- **Tests:** add Vitest + React Testing Library. The pure functions (`filterProperties`, `getAvailabilityLevel`, the parsers) are written to be unit-tested first, then the four page states using the existing MSW handlers.
- **Production API:** `npm run preview` has no mock API, so the listing shows its error state. That's expected without a backend.
- **CI and ownership:** add a GitHub Actions workflow running `npm run lint` and `npm run build` as required checks, and a CODEOWNERS rule for `src/styles/`.
- **Routing:** replace the path matching with a router once the detail page exists.
- **Bundle size:** the full Bootstrap Sass is imported (about 31 kB CSS gzipped). Importing only the Bootstrap partials we use would reduce it.
- **Visual regression:** Storybook or Playwright screenshots per component, and per operator theme (see the governance note).

## Documents

- [CSS-GOVERNANCE.md](CSS-GOVERNANCE.md): theme structure, PR enforcement, white-label theming
- [AI-USAGE.md](AI-USAGE.md): AI tools used, key prompts, and review
