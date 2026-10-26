# FastCart

Initial React + Vite foundation in TypeScript/TSX.

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
- `src/pages`: initial screen and route error handling
- `src/features`: Redux request state
- `src/shared/api`: Axios client with timeout and error handling
- `src/shared/components`: reusable request states
- `src/components/ui`: shadcn/ui components

Tailwind CSS uses the Vite plugin. shadcn/ui generates TypeScript components with `tsx: true` in `components.json`.

Only `/` is implemented. Store pages, authentication and admin UI are later tasks. API authentication and business contracts still need verification. No token storage or guessed authorization response is implemented.

The `marketplace` and `admin` branches start from the same setup commit. Continue buyer storefront work in `marketplace`.
