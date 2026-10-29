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

`/login` uses the existing API username/password flow. Every protected route separately requests the signed-in user's profile and requires a matching user ID and a server-returned role named `Admin` (case insensitive). Errors, missing roles and denied access keep the workspace closed. This conservative UI role rule still needs confirmation against the backend policy with a valid admin account; it does not establish permissions for future CRUD endpoints.

The workspace contains navigation for products, categories, subcategories, brands and colors. These sections currently show explicit unavailable states. Registration, role assignment and password recovery are not implemented.
