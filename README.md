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

`npm run build` runs TypeScript checks and creates the production site in `dist`. `npm run preview` serves that build locally; it does not verify a Vercel deployment. Dependencies are pinned by the committed `package-lock.json`; use `npm ci` without regenerating the lockfile.

## Vercel preparation

The same repository contains two independent applications at its root, each in its own branch. Configure a separate Vercel project for this admin application and select `admin` as its Production Branch. The storefront project must use `marketplace`. Do not deploy `main` or merge the application branches to publish them.

| Setting                     | Admin project                                |
| --------------------------- | -------------------------------------------- |
| Production Branch           | `admin`                                      |
| Framework Preset            | Vite                                         |
| Root Directory              | `.` (repository root)                        |
| Install Command             | `npm ci`                                     |
| Build Command               | `npm run build`                              |
| Output Directory            | `dist`                                       |
| Node.js Version             | 24.x                                         |
| Public environment variable | `VITE_API_URL=https://store-api.softclub.tj` |

`VITE_API_URL` is the only application environment variable. It is a public, build-time Axios base URL, defaults to the URL above and has no `/api` suffix. Set it for Production and any enabled Preview environment. A changed value requires a new build. Images use the same backend at `/images/{filename}`. No account, password or token belongs in this configuration.

`vercel.json` uses the SPA rewrite from the [official Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). It sends deep links to `/index.html`, including `/dashboard`, `/orders`, `/products`, `/products/new`, `/products/:id/edit`, `/categories`, `/subcategories`, `/brands` and `/banners`. React Router still handles unknown routes and the existing authentication guard still controls protected pages.

Keep the two projects' branch builds separate: set each project's Production Branch explicitly and prevent Preview builds of the other application's branch. A project-specific Ignored Build Step can use `if [ "$VERCEL_GIT_COMMIT_REF" = "admin" ]; then exit 1; else exit 0; fi` for this project; in the storefront project use `marketplace` instead. Vercel's ignored-build convention is exit 0 to skip and exit 1 to continue. Configure this in each project's settings, rather than sharing one branch filter between both projects. See [Ignored Build Step](https://vercel.com/docs/project-configuration/git-settings#ignored-build-step).

Local context, design archives, session files, `.env.local`, `.vercel`, dependencies and build output are ignored. They are outside `public` and are not production assets. Commit only public `.env.example`, source, configuration and the lockfile.

After publication, verify direct navigation and refresh on nested routes, asset loading, API images, login/reload/logout and protected-page redirects. Check browser CORS/preflight for both Production and enabled Preview origins, including Authorization and multipart POST/PUT/DELETE operations. The backend must allow those origins; the SPA rewrite does not proxy the API or configure its CORS. Test mutations only on owned test records. A successful local build does not confirm hosting or browser interactions.

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

The dark Sidebar and Header surround a white workspace. Navigation contains Dashboard, Orders, Products and an Other group for Categories, Brands and Banners. Subcategories remain available inside Categories.

Dashboard keeps Sales, Cost, Profit and sales/transaction panels explicitly unavailable because the API provides no financial datasets. Its main chart shows real catalog product counts by category. It loads the complete category list, then reads totalRecord from the existing product endpoint with CategoryId and PageSize=1 for each category, at most three requests at a time. Counts cover all product pages and are not sales or stock quantities. Loading, error/Retry, empty categories, zero counts and Refresh are supported. Incomplete or malformed counts fail the entire chart instead of displaying a partial result. Requests are cancelled on unmount and state is cleared on session changes.

Orders includes the reference toolbar, search, Newest control, selection actions, table columns, status styling and pagination footer. The current API has no order contract; Cart is not used as Orders. The production page shows Orders API unavailable with an unknown result count and explained disabled actions, rather than claiming no orders exist. Separate display states support loading, error/Retry, confirmed empty data and no search results. These states and table rows are exercised with synthetic fixtures only in local tests; no sample orders are shipped or shown in the application.

Brands shows the real list beside an RHF/Zod create/edit form. Edit loads the current record by ID and exposes Cancel; errors retain the input. POST and PUT send the documented query parameters with an empty body. Delete requires confirmation, shows dependency errors and never issues related-product updates. Pending and ref guards prevent repeat submission. Confirmed changes reload Redux; an uncertain response blocks another submission until the list is checked. Product forms reuse the same complete brand reader and load fresh options whenever opened. The reader follows actual API pages, deduplicates IDs and rejects incomplete results.

Colors has no separate management page in the original design. The color API and complete reader remain available for product-form options. The reader handles the observed API pagination inconsistency by requesting up to 100 records, deduplicating IDs and detecting incomplete results. Product creation and editing retain their real color selection.

Banners follows the Main sliders / Banner layout with image selection, drag and drop, file previews, titles, subtitle, category selection and an end-date setting. The API has no banner management endpoints, so server saving is explicitly unavailable. The preview does not change the marketplace. Text settings and the absolute end date are stored only in this browser; selected image files are temporary and must be selected again after reload. The countdown reads the same fixed end date after reload and never starts a new duration automatically.

Categories displays the complete API hierarchy as image cards. Search and pagination run locally over that list. Create and edit use multipart `CategoryName`/`CategoryImage`, plus `Id` on update. The documented update requires a new image file. File previews and entered values survive errors. Delete requires confirmation and displays dependency errors without issuing related-record deletions. Only confirmed mutation responses show success; uncertain results block another submission until the list is checked. Redux reloads the category tree after changes. Product forms use the same category reader and load fresh options whenever opened.

Subcategories are shown for the category selected at `/subcategories?CategoryId=...`, with local search and pagination. Create and update send the documented query parameters with an empty body; deletion sends the subcategory ID. The detail response omits the parent ID, so edit resolves it from a freshly loaded category tree using the exact subcategory ID and requires a unique parent. It rechecks that association before saving. The existing parent stays selected unless the user explicitly changes it. Missing or ambiguous associations block editing. Successful changes reload the shared tree and the next product form receives fresh category/subcategory options.

Products loads the real API list with name search and pagination stored in the URL. Only the outgoing search value is lowercased. Redux tracks request IDs, cancels obsolete requests and clears list state on session changes. Table selection applies only to the current page and resets on a new request, except remaining visible items after deletion. Inventory comes from the list response; missing stock remains unknown. Prices use the API price without an assumed currency. Images use `/images/{filename}` with an unavailable fallback.

Product creation is available at `/products/new`; row Edit links open `/products/:id/edit`. The RHF/Zod form loads real categories/subcategories, brands and colors, uses plain text descriptions and previews selected images. Creation uses multipart; editing uses PUT query parameters, followed by separate multipart image uploads and image-ID deletions. The HTTP client generates multipart boundaries.

Editing matches brand/color names only when unique and verifies stock against an exact-ID catalog result. Unknown stock requires an explicit value. Errors retain inputs. A partial image result locks repeat submission and offers an explicit reload of saved data. A generic save notice survives session expiry so a completed field update is not hidden by an image failure. Success requires a confirmed response; unconfirmed saves must be checked before another attempt. Saving invalidates the list, which reloads when returning with the original search/page URL.

Row deletion and current-page selection deletion require confirmation with the product name or exact count. Each product is checked by ID, then deleted sequentially through `DELETE /Product/delete-product?id=...`; there is no bulk endpoint. Cancel sends no request. Pending blocks repeated confirmation. Results distinguish confirmed deletions, verified absence, errors, unverified outcomes and unattempted items. An ambiguous response is followed by a server read before any further deletion; failed verification stops the batch. Every new attempt checks server state again. Successful items are excluded from the remaining selection. The list and server result count reload; an empty page returns to the previous available page. Session changes abort the operation and stop further requests. HTTP 401 clears the session; 403 shows permission denial and keeps the session.

Bulk editing, tags, tax, HEX colors, multiple variants, date sorting, registration, role assignment and password recovery are not implemented. Server orders, payment processing, financial analytics and banner saving have no confirmed API contract. The user manually checked Dashboard, Orders and the previously implemented functions and accepted their appearance. This does not establish the backend's formal role policy; automated live mutations require an authorized session.

## Languages and appearance

The storefront and admin application support English, Russian and Tajik (EN / RU / TJ; language codes en / ru / tg). Language and light/dark controls are available in the header; the mobile storefront exposes them in its navigation sheet. Admin login and access-check screens also expose the controls. The initial defaults are English and light. Each application remembers the selection in its own browser origin and synchronizes it between tabs of that origin. Initial appearance is applied before React renders.

UI copy, navigation, labels, accessibility descriptions, validation and known application errors are localized. Switching language preserves current form input and retranslates existing errors. Product/category names, descriptions, customer input and unknown server messages remain unchanged. Displayed prices and dates use the selected locale; no currency is assumed. The API contracts, session handling, Redux data reducers and validation rules are unchanged.

Translation resources are in src/shared/i18n. English source phrases are used as keys. react-i18next drives React updates; a small text adapter also recognizes existing interpolated application messages without changing their stored values. Light/dark colors use semantic CSS variables. npm ci installs the added i18next and react-i18next dependencies from the committed lockfile.
