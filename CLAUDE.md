# TourShuttle Client: project rules

React client for the TourShuttle API (the ASP.NET Core server lives in the separate `TourShuttle` repository).
Brand name in the UI: "שבילי קדם". Hebrew, right to left. This client is also a learning project for a React course,
so code should show React idioms clearly and explain non-obvious choices in short comments.

## Communication
- Reply to the user in Hebrew. Code, identifiers and commands stay in English.

## Stack
- Vite + React 19 + TypeScript (strict, `erasableSyntaxOnly`: no enums, no parameter properties; use unions and explicit fields).
- React Router 7 (`react-router`), TanStack Query for server data (`useQuery` / `useMutation`).
- CSS Modules + design tokens (`src/styles/tokens.css`). No UI framework, no Tailwind.
- Icons: `lucide-react`. Fonts: `@fontsource` (bundled, Hebrew subsets).
- Tests: Vitest + React Testing Library. Lint: oxlint.

## Structure
- `src/app`: providers, router, query client, theme.
- `src/api`: HTTP client (`client.ts`), one `*.api.ts` per resource, DTO types (`types.ts`) mirroring the server.
- `src/features/<feature>`: pages, components and hooks of one area (auth, home, tours, bookings, driver, admin).
- `src/components/ui`: the UI kit (Button, Card, TextField, Alert, Toast...). `src/components/layout`, `src/components/feedback`.
- `src/hooks`: generic hooks. `src/lib`: helpers (errors, session, formatting).

## Rules
- Components use only semantic tokens (`--color-surface`, `--color-primary`...), never palette values or raw colors.
- Element selectors inside a CSS module are global: always nest them under a class.
- All HTTP goes through `src/api/client.ts`; errors are `ApiError` and are shown with `ApiErrorAlert`.
- Dates arrive in UTC; convert to Asia/Jerusalem only for display.
- Files that export components export only components (fast refresh); shared constants go to `src/lib`.
- Run before committing: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## Commands
- `npm run dev`: dev server on http://localhost:5173, proxying `/api` to the local API on :5282.
- `npm test`, `npm run test:watch`, `npm run lint`, `npm run typecheck`, `npm run build`.
