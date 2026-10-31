# FastCart Marketplace

Buyer storefront in the `marketplace` branch, using React + Vite and TypeScript/TSX. The independent administration application lives in `admin`, in the same repository root on that branch.

## Run locally

Requires Node.js 24 LTS and npm 11.

```sh
npm ci
npm run dev
```

On Windows PowerShell use `npm.cmd` if script execution is restricted. Copy `.env.example` to `.env.local` to override the public API URL. Never put secrets in VITE_ variables.

`npm run build` runs TypeScript checks and creates the production site in `dist`. `npm run preview` serves that build locally; it does not verify a Vercel deployment. Dependencies are pinned by the committed `package-lock.json`; use `npm ci` without regenerating the lockfile.

## Vercel preparation

Configure two separate Vercel projects from this repository. The storefront project's Production Branch is `marketplace`; the admin project's is `admin`. Each application is at the repository root on its own branch. Do not deploy `main` or merge the application branches to publish them.

| Setting                     | Storefront project                           |
| --------------------------- | -------------------------------------------- |
| Production Branch           | `marketplace`                                |
| Framework Preset            | Vite                                         |
| Root Directory              | `.` (repository root)                        |
| Install Command             | `npm ci`                                     |
| Build Command               | `npm run build`                              |
| Output Directory            | `dist`                                       |
| Node.js Version             | 24.x                                         |
| Public environment variable | `VITE_API_URL=https://store-api.softclub.tj` |

`VITE_API_URL` is the only application environment variable. It is a public, build-time Axios base URL, defaults to the URL above and has no `/api` suffix. Set it for Production and any enabled Preview environment. A changed value requires a new build. Images use the same backend at `/images/{filename}`. No account, password or token belongs in this configuration.

`vercel.json` uses the SPA rewrite from the [official Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). It sends deep links to `/index.html`, including `/products`, `/products/:id`, `/cart`, `/checkout`, `/wishlist`, `/login`, `/register`, `/account`, `/about` and `/contact`. React Router handles unknown routes with the existing 404 page. Authentication requirements remain enforced in the application and API.

Keep the two projects' branch builds separate: set each project's Production Branch explicitly and prevent Preview builds of the other application's branch. A project-specific Ignored Build Step can use `if [ "$VERCEL_GIT_COMMIT_REF" = "marketplace" ]; then exit 1; else exit 0; fi` for this project; in the admin project use `admin` instead. Vercel's ignored-build convention is exit 0 to skip and exit 1 to continue. Configure this in each project's settings, rather than sharing one branch filter between both projects. See [Ignored Build Step](https://vercel.com/docs/project-configuration/git-settings#ignored-build-step).

Local context, design archives, session files, `.env.local`, `.vercel`, dependencies and build output are ignored. They are outside `public` and are not production assets. Commit only public `.env.example`, source, configuration and the lockfile.

After publication, verify direct navigation and refresh on nested routes, asset loading, API images, login/reload/logout, cart and protected-page redirects. Check browser CORS/preflight for both Production and enabled Preview origins, including Authorization and the API methods used by the storefront. The backend must allow those origins; the SPA rewrite does not proxy the API or configure its CORS. A successful local build does not confirm hosting or browser interactions.

## Checks

```sh
npm run typecheck
npm run build
npm run lint
npm run format:check
```

## Features and limitations

- Home, catalog, product details, login/register, wishlist, server cart, read-only account, checkout form, About, Contact and 404 are implemented.
- Catalog search, price range and pagination use the API and URL state. Condition and rating filters are explicitly unavailable because their data contract is not confirmed.
- Product images use `/images/{filename}` with a fallback. Prices do not assume a currency. Discount percentages are calculated from confirmed prices; unavailable ratings do not become fabricated scores.
- Wishlist stores product IDs locally. The server cart requires login. Passwords are not persisted.
- Checkout validates billing details and saves one clearly marked local demo order per account in browser localStorage. The confirmation survives reload and can be deleted from Checkout. Billing details and the cart snapshot stay on this device and are not synced to the admin application. Storage failures show an error without a success confirmation. No real order is submitted, no payment is processed and the server cart is unchanged.
- Profile editing, password recovery, contact delivery, subscription delivery, coupons, tax, shipping calculations and delivery checks are unavailable without confirmed API support. Contact can validate fields locally without sending a message.
- Flash Sales selects discounted items from the first 100 catalog records, up to 12 cards. Its seven-day promotional interval has fixed start/end dates in code and does not restart on reload. The deadline is frontend campaign configuration, not a server-provided campaign. Home promotional images and copy do not guarantee product availability or voucher redemption.
- Financial analytics and server banner management are not provided by the confirmed API. Admin banner previews do not update this storefront.

The user manually checked and accepted the implemented storefront. Publication still requires the hosting, CORS and direct-route checks above.

## Structure

- `src/main.tsx`: application entry
- `src/app`: buyer layout, router and Redux store
- `src/pages`: storefront screens and route error handling
- `src/features`: forms, catalog, cart, authentication and Redux request state
- `src/shared/api`: Axios client with timeout and error handling
- `src/shared/components`: shared storefront components and request states
- `src/components/ui`: shadcn/ui components

Tailwind CSS uses the Vite plugin. shadcn/ui generates TypeScript components with `tsx: true` in `components.json`.

## Image sources

The local iPhone hero photograph comes from [Apple Newsroom](https://www.apple.com/ie/newsroom/2022/09/apple-debuts-iphone-14-pro-and-iphone-14-pro-max/).

The five standalone home promo images in `src/assets/home` come from the [EcommerceFigma reference assets](https://github.com/M-Subhan-Ali/EcommerceFigma/tree/6983d80593646fc51c6af60bd96bd715ac68cf24/src/Components): `MusicEnhance/image/jbl.png` and `Arrival/Images/{ps5,girl,speaker,gucci}.png`. No reference application code was copied. Promo links use existing category IDs from Redux. If category data is unavailable, links open the catalog without inventing an ID.

## Languages and appearance

The storefront and admin application support English, Russian and Tajik (EN / RU / TJ; language codes en / ru / tg). Language and light/dark controls are available in the header; the mobile storefront exposes them in its navigation sheet. Admin login and access-check screens also expose the controls. The initial defaults are English and light. Each application remembers the selection in its own browser origin and synchronizes it between tabs of that origin. Initial appearance is applied before React renders.

UI copy, navigation, labels, accessibility descriptions, validation and known application errors are localized. Switching language preserves current form input and retranslates existing errors. Product/category names, descriptions, customer input and unknown server messages remain unchanged. Displayed prices and dates use the selected locale; no currency is assumed. The API contracts, session handling, Redux data reducers and validation rules are unchanged.

Translation resources are in src/shared/i18n. English source phrases are used as keys. react-i18next drives React updates; a small text adapter also recognizes existing interpolated application messages without changing their stored values. Light/dark colors use semantic CSS variables. npm ci installs the added i18next and react-i18next dependencies from the committed lockfile.
