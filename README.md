# FastCart Admin

Independent administration application in the `admin` branch, using React + Vite and TypeScript/TSX.

## Run locally

Requires Node.js 24 LTS and npm 11.

```sh
npm ci
npm run dev
```

On Windows PowerShell use `npm.cmd` if script execution is restricted.
Copy `.env.example` to `.env.local` to override the public API URL. Never put secrets in VITE_ variables.

## Checks

```sh
npm run typecheck
npm run build
npm run lint
npm run format:check
```

## Structure

- `src/app`: router and Redux store
- `src/pages`: admin screens and route error handling
- `src/features`: authentication and Redux request state
- `src/shared/api`: Axios client with timeout and error handling
- `src/shared/components`: reusable request states
- `src/components/ui`: shadcn/ui components

Tailwind CSS uses the Vite plugin. shadcn/ui generates TypeScript components with `tsx: true` in `components.json`.

The shared Axios and authentication foundation is reused selectively from `marketplace`. Admin session storage uses its own `fastcart-admin-session` key. Passwords are never persisted.

Buyer storefront work remains in `marketplace`. Do not merge its complete application into this branch.
