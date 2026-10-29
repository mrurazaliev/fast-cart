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

- `src/main.tsx`: all route declarations and application entry
- `src/app`: Redux store and typed hooks
- `src/pages`: admin screens and route error handling
- `src/features`: authentication and Redux request state
- `src/shared/api`: Axios client with timeout and error handling
- `src/shared/components`: reusable request states
- `src/components/ui`: shadcn/ui components

Tailwind CSS uses the Vite plugin. shadcn/ui generates TypeScript components with `tsx: true` in `components.json`.

The shared Axios and authentication foundation is reused selectively from `marketplace`. Admin session storage uses its own `fastcart-admin-session` key. Passwords are never persisted.

Buyer storefront work remains in `marketplace`. Do not merge its complete application into this branch.

`/login` uses the existing API username/password flow. Every protected route separately requests the signed-in user's profile and requires a matching user ID and a server-returned role named `Admin` (case insensitive). Errors, missing roles and denied access keep the workspace closed. This conservative UI role rule still needs confirmation against the backend policy with a valid admin account; it does not establish permissions for future CRUD endpoints.

The dark Sidebar and Header surround a white workspace. Navigation contains Dashboard, Orders, Products and an Other group for categories, subcategories, brands and colors. Dashboard, Orders and the reference sections currently show explicit unavailable states with no simulated data.

Products loads the real API list with name search and pagination stored in the URL. Only the outgoing search value is lowercased. Redux tracks request IDs, cancels obsolete requests and clears list state on session changes. Table selection applies only to the current page and resets when the list is reloaded. Inventory comes from the list response; missing stock remains unknown. Prices use the API price without an assumed currency. Images use `/images/{filename}` with an unavailable fallback.

Product creation is available at `/products/new` with real categories/subcategories, brands, colors, plain text fields and image selection. It sends the documented multipart request and shows success only for a confirmed response. Unconfirmed saves must be checked in the product list before another attempt. Editing and product deletion are unavailable until the next stage. Date sorting, registration, role assignment and password recovery are not implemented.
