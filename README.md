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

The dark Sidebar and Header surround a white workspace. Navigation contains Dashboard, Orders, Products and an Other group for categories, subcategories, brands and colors. Dashboard, Orders, brands and colors currently show explicit unavailable states with no simulated data.

Categories displays the complete API hierarchy as image cards. Search and pagination run locally over that list. Create and edit use multipart `CategoryName`/`CategoryImage`, plus `Id` on update. The documented update requires a new image file. File previews and entered values survive errors. Delete requires confirmation and displays dependency errors without issuing related-record deletions. Only confirmed mutation responses show success; uncertain results block another submission until the list is checked. Redux reloads the category tree after changes. Product forms use the same category reader and load fresh options whenever opened.

Subcategories are shown for the category selected at `/subcategories?CategoryId=...`, with local search and pagination. Create and update send the documented query parameters with an empty body; deletion sends the subcategory ID. The detail response omits the parent ID, so edit resolves it from a freshly loaded category tree using the exact subcategory ID and requires a unique parent. It rechecks that association before saving. The existing parent stays selected unless the user explicitly changes it. Missing or ambiguous associations block editing. Successful changes reload the shared tree and the next product form receives fresh category/subcategory options.

Products loads the real API list with name search and pagination stored in the URL. Only the outgoing search value is lowercased. Redux tracks request IDs, cancels obsolete requests and clears list state on session changes. Table selection applies only to the current page and resets on a new request, except remaining visible items after deletion. Inventory comes from the list response; missing stock remains unknown. Prices use the API price without an assumed currency. Images use `/images/{filename}` with an unavailable fallback.

Product creation is available at `/products/new`; row Edit links open `/products/:id/edit`. The RHF/Zod form loads real categories/subcategories, brands and colors, uses plain text descriptions and previews selected images. Creation uses multipart; editing uses PUT query parameters, followed by separate multipart image uploads and image-ID deletions. The HTTP client generates multipart boundaries.

Editing matches brand/color names only when unique and verifies stock against an exact-ID catalog result. Unknown stock requires an explicit value. Errors retain inputs. A partial image result locks repeat submission and offers an explicit reload of saved data. A generic save notice survives session expiry so a completed field update is not hidden by an image failure. Success requires a confirmed response; unconfirmed saves must be checked before another attempt. Saving invalidates the list, which reloads when returning with the original search/page URL.

Row deletion and current-page selection deletion require confirmation with the product name or exact count. Each product is checked by ID, then deleted sequentially through `DELETE /Product/delete-product?id=...`; there is no bulk endpoint. Cancel sends no request. Pending blocks repeated confirmation. Results distinguish confirmed deletions, verified absence, errors, unverified outcomes and unattempted items. An ambiguous response is followed by a server read before any further deletion; failed verification stops the batch. Every new attempt checks server state again. Successful items are excluded from the remaining selection. The list and server result count reload; an empty page returns to the previous available page. Session changes abort the operation and stop further requests. HTTP 401 clears the session; 403 shows permission denial and keeps the session.

Bulk editing, tags, tax, HEX colors, multiple variants, date sorting, registration, role assignment and password recovery are not implemented. Actual product mutations still require validation with an authorized admin session; the available local session is expired.
